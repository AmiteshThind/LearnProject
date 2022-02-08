import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorNavbar from "../../../../components/instructor/InstructorNavBar";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import ReactMarkdown from "react-markdown";
import {
  ArrowCircleLeftIcon,
  ArrowLeftIcon,
  PencilIcon,
  CheckIcon,
  UploadIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import Tooltip from "../../../../components/Tooltip";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import Modal from "../../../../components/Modal";
import { toast, ToastContainer } from "react-toastify";
import Router from "next/router";
import axios from "axios";
import Accordion from "../../../../components/Accordion";

function CourseView() {
  const [course, setCourse] = useState([]);
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const { user, isAuthenticated } = useMoralis();
  const [lessons, setLessons] = useState([]);
  const [sections, setSections] = useState([]);
  const [editing, setEditing] = useState(false);

  //for lessons

  const [values, setValues] = useState({
    title: "",
    section: "",
    content: "",
    video: {},
    free_preview:false
  });

  const [orginalLessonValues, setOrginalLessonValues] = useState();
  const [uploading, setUploading] = useState(false);
  const [uploadBtnText, setUploadBtnText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    //load course from moralis based on slug
    //console.log(course)

    loadCourseandLessons();

    //console.log(course)
  }, [isLoading]);

  const loadCourseandLessons = async () => {
    const Course = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Course);
    query.equalTo("slug", slug);

    const result = await query.find();

    if (result[0]) {
      setCourse(result);
      setSections(result[0].attributes.sections);
    }

    const Lesson = Moralis.Object.extend("Lesson");
    const query2 = new Moralis.Query(Lesson);

    const result2 = await query2.find();
    console.log(result2);
    setLessons([]);
    for (let lesson of result2) {
      setLessons((oldArray) => [...oldArray, lesson]);
      console.log(lesson);
    }

    setIsLoading(false);
  };

  //functions for add Lessons

  const handleEditLesson = async (lesson) => {
    setVisible(true);
    setEditing(true);
    setValues(lesson.attributes);
    setOrginalLessonValues(lesson.attributes);
    console.log(lesson);
  };

  const handleAddLesson = async (e) => {
    //add lesson to course array
    e.preventDefault();

    try {
      if (
        values.title != "" &&
        values.content != "" &&
        values.video != {} &&
        values.section != ""
      ) {
        //create Lesson in Lessons Class in Moralis while referecing course to which this Lesson belongs to
        const Lesson = Moralis.Object.extend("Lesson");

        const query = new Moralis.Query(Lesson);
        query.equalTo("course", course[0]);
        const lessons = await query.find();

        // add this lesson object to the lessons array under the course to which it belongs
        console.log(lessons);
        console.log(lessons.length);
        course[0].set("lessonCount", lessons.length + 1);
        await course[0].save();

        const newLesson = new Lesson();
        newLesson.set("title", values.title);
        newLesson.set("content", values.content);
        newLesson.set("video", values.video);
        newLesson.set("course", course[0]);
        newLesson.set("free_preview",values.free_preview)
        if (course[0].attributes.sections.includes(values.section)) {
          newLesson.set("section", values.section);
        } else {
          console.log("select pending");
        }
        const addedLesson = await newLesson.save();

        setLessons((oldArray) => [...oldArray, addedLesson]);
        console.log(lessons);
        setVisible(false);
        setUploadBtnText("Upload Video");
        setValues({
          ...values,
          title: "",
          content: "",
          section:"",
          video: {},
          
        });
      } else {
        toast("Please Input All Fields");
        console.log("here i am");
      }
    } catch {}
    console.log(values);
    // creates a lesson in the database which includes the video hash and url, title, course object id, , content
  };

  const handleUpdateLesson = async (e) => {
    try {
      console.log("CALLED");
      console.log(values);
      const Lesson = Moralis.Object.extend("Lesson");
      const query = new Moralis.Query(Lesson);
      query.equalTo("course", course[0]);
      query.equalTo("title", orginalLessonValues.title);
      const lessonToUpdate = await query.first();
      console.log(lessonToUpdate);
      lessonToUpdate.set("title", values.title);
      lessonToUpdate.set("content", values.content);
      lessonToUpdate.set("video", values.video);
      lessonToUpdate.set("section", values.section);
      lessonToUpdate.set("free_preview", values.free_preview);
      await lessonToUpdate.save();
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLesson = async (lessonRemove) => {
    setLessons(lessons.filter((lesson) => lesson.id != lessonRemove.id));
    const Lesson = Moralis.Object.extend("Lesson");
    const query = new Moralis.Query(Lesson);
    query.equalTo("course", course[0]);
    const lessonsList = await query.find();

    // add this lesson object to the lessons array under the course to which it belongs
    if (lessonsList.length > 0) {
      course[0].set("lessonCount", lessonsList.length - 1);
      const courseUpdated = await course[0].save();
      query.equalTo("objectId", lessonRemove.id);
      const lessonToDelete = await query.first();
      await lessonToDelete.destroy();
      console.log(course[0]);
      console.log(courseUpdated);
      setCourse([courseUpdated]);
    }
  };

  const handleVideo = async (e) => {
    console.log("wow");
    try {
        //first check if there is already an exisitng video for the lesson if so delete before uplaoding new video 
        if(values.video && values.video.Location){
            await handleVideoRemove()
        }

        const instructorId = course[0].attributes.instructor.id;
        console.log("im here");
        const file = e.target.files[0];
        if (file) {
            console.log(file);
            const videoData = new FormData();
            videoData.append("video", file);
            setUploading(true);
            // get current user objectId

            //sendData.append("userId",userObjectId)

            await axios
            .post(
                `http://localhost:8000/api/course/video-upload/${instructorId}`,
                videoData,
                {
                onUploadProgress: (e) => {
                    setProgress(Math.round((100 * e.loaded) / e.total));
                    console.log(e);
                },
                withCredentials: true,
                }
            )
            .then(function (response) {
                setProgress(0);
                setUploading(false);
                setUploadBtnText(file.name);
                // console.log(data)

                //once response is received

                setValues({ ...values, video: response.data });
                console.log(values);
            });
        }
      

      // work on progress bar
    } catch (error) {
      console.log(error);
      setUploading(false);
      toast("Video Upload Failed");
    }
  };

  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      const instructorId = course[0].attributes.instructor.id;
      const { data } = await axios.post(
        `http://localhost:8000/api/course/video-remove/${instructorId}`,
        values.video,
        {
          withCredentials: true,
        }
      );
      setValues({ ...values, video: {} });
      setProgress(0);
      setUploading(false);
      setUploadBtnText("Upload Another Video");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-cyan-100 via-white to-red-100 ">
      <InstructorNavbar />
      <div className="flex flex-wrap  ">
        <Link href={"/instructor/dashboard"}>
          <a>
            <div data-tip="Dashboard" class="tooltip ml-6 ">
              <ArrowCircleLeftIcon className="h-10 w-10      text-emerald-500" />
            </div>
          </a>
        </Link>
      </div>

      {course.length == 1 && (
        <div className="flex  flex-wrap  justify-center">
          <div className="flex bg-white  h-full sm:w-full md:w-6/12 shadow-2xl rounded-3xl lg:w-6/12 xl:6/12 p-5     items-start flex-col   ml-10 mb-10  mt-5 sm:mr-10 mr-10   flex-stretch   ">
            <div className="flex   w-full justify-between ">
              <div className=" px-1   flex-wrap text-4xl   text-emerald-500 ">
                <h1>{course[0].attributes.name} </h1>
              </div>
              <div className="flex      mr-10">
                <div data-tip="edit" class="tooltip ">
                  <PencilIcon
                    onClick={() =>
                      router.push(
                        `/instructor/course/edit/${course[0].attributes.slug}`
                      )
                    }
                    className="h-8 w-8 mx-3 cursor-pointer  text-amber-200 hover:text-amber-300"
                  />
                </div>
                <div data-tip="publish" class="tooltip">
                  <CheckIcon className="h-9 w-9 cursor-pointer  text-cyan-200  hover:text-cyan-400" />
                </div>
              </div>
            </div>
            <div className="text-md mt-1 px-1 text-gray-700 ">
              {course[0].attributes.lessonCount} Lessons
            </div>
            <div className="text-sm  mt-2 text-gray-500">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full border-2 border-emerald-500 text-emerald-800">
                {course[0].attributes.category}
              </span>
            </div>

            <div className="flex-shrink-0 mr-5 mt-4  ">
              <div className="mb-3 font-semibold">Image Preview</div>
              <Image
                src={course[0].attributes.image_preview._url}
                className="rounded-lg"
                width="400rem"
                height="200rem"
              />
            </div>
            <div className="mt-3 w-full relative flex flex-col flex-wrap">
              <div className="mb-3    font-semibold">Description</div>
              <div className="prose flex    ">
                <ReactMarkdown
                  className="w-12/12 flex-grow "
                  remarkPlugins={[remarkGfm]}
                  children={course[0].attributes.description}
                />
              </div>
            </div>
          </div>

          <div className="flex h-full bg-white shadow-2xl rounded-3xl border-none py-5 w-full lg:w-4/12 md:w-3/12 sm:w-full flex-col  mr-10 ml-10 mb-10 mt-5 ">
            <div className="   flex flex-wrap text-4xl justify-center  text-emerald-500 ">
              <h1>Manage Lessons </h1>
            </div>
            <div className="flex items-center justify-center mt-10">
              <button
                onClick={() => {
                  setVisible(true);
                }}
                class="  text-white font-bold  border-b-4 hover:border-b-2 hover:border-t-1 border-emerald-600   bg-emerald-500 shadow-md shadow-emerald-500/50 rounded-2xl justify-center text-md   w-full px-3 mx-10 py-3 flex"
              >
                <UploadIcon className="h-6 w-6  " /> Add Lesson
              </button>
              <Modal
                editing={editing}
                setEditing={setEditing}
                uploadBtnText={uploadBtnText}
                setUploadBtnText={setUploadBtnText}
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                handleUpdateLesson={handleUpdateLesson}
                visible={visible}
                setVisible={setVisible}
                uploading={uploading}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
                sections={sections}
              ></Modal>
            </div>
            {/* // list of lessons will be rendered here  */}
            {/* <ul class="bg-white rounded-lg border border-gray-200 m-10 text-gray-900 text-sm  font-medium">
                            {lessons.map((lesson, index) => (
                                <li class="px-4 py-5 border-b border-gray-200 w-full justify-between flex rounded-t-lg">
                                    <div>
                                        <span className='rounded-full bg-gray-200 px-3 py-1'>{index + 1}</span>
                                        <span className=' px-3 py-1'>{lesson.attributes.title}</span>
                                    </div>
                                    <span className=' px-3 py-1 flex'>
                                        <PencilIcon className="h-5 w-5  mr-2  text-cyan-400" />
                                        <TrashIcon className="h-5 w-5    text-red-400" />
                                    </span>
                                </li>
                            ))}

                        </ul> */}
            {sections.map((section, index) => (
              <Accordion title={section} key={index} number={index + 1}>
                <ul class="bg-white rounded-xl border mx-10 border-gray-200 text-gray-900 text-sm  font-medium">
                  {lessons
                    .filter((lesson) => lesson.attributes.section == section)
                    .map((lesson, index) => (
                      <li
                        key={sections.length + index}
                        class="px-4 py-5 border-b border-gray-200 w-full justify-between flex rounded-lg"
                      >
                        <div>
                          <span className="rounded-full bg-gray-200 px-3 py-1">
                            {index + 1}
                          </span>
                          <span className=" px-3 py-1">
                            {lesson.attributes.title}
                          </span>
                        </div>
                        <span className=" px-3 py-1 flex">
                          <PencilIcon
                            onClick={() => handleEditLesson(lesson)}
                            className="h-5 w-5  mr-2  text-cyan-400"
                          />
                          <TrashIcon
                            onClick={() => handleDeleteLesson(lesson)}
                            className="h-5 w-5    text-red-400"
                          />
                        </span>
                      </li>
                    ))}
                </ul>
              </Accordion>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseView;
