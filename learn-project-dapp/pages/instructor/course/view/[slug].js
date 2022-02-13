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
import toast from "react-hot-toast";
import Router from "next/router";
import axios from "axios";
import Accordion from "../../../../components/Accordion";
import { DocumentTextIcon, PlusCircleIcon } from "@heroicons/react/outline";
import QuizModal from "../../../../components/QuizModal";
import QuizAccordion from "../../../../components/QuizAccordion";

function CourseView() {
  const [course, setCourse] = useState([]);
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);
  const { user, isAuthenticated } = useMoralis();
  const [lessons, setLessons] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [editing, setEditing] = useState(false);
  const [quizEditing, setQuizEditing] = useState(false);
  const [availableQuizSections, setAvailableQuizSections] = useState([]);

  //for lessons

  const [values, setValues] = useState({
    title: "",
    section: "",
    content: "",
    video: {},
    free_preview: false,
  });

  const [orginalLessonValues, setOrginalLessonValues] = useState();
  const [uploading, setUploading] = useState(false);
  const [uploadBtnText, setUploadBtnText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);


  //for questions
  const [questionDetails, setQuestionDetails] = useState({
    question: "",
    answer: "",
    options: Array(4).fill(""), // now contains n empty strings. // will check if empty then we will remove from array and only story the ones with options min 2 max 4
    section: "",
  });
  const [originalQuizQuestionDetails, setOriginalQuizQuestionDetails] = useState();


  useEffect(() => {
    //load course from moralis based on slug
    //console.log(course)

    loadCourseandLessons();
    loadQuizQuestions();

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
    query2.ascending("index");
    const result2 = await query2.find();
    // console.log(result2);
    setLessons([]);
    for (let lesson of result2) {
      setLessons((oldArray) => [...oldArray, lesson]);
      //   console.log(lesson);
    }
    console.log(result2);
    setIsLoading(false);
  };

  const loadQuizQuestions = async () => {
    const QuizQuestion = Moralis.Object.extend("QuizQuestion");
    const query = new Moralis.Query(QuizQuestion);
    const result = await query.find();
    let arr = [];
    // console.log(result2);
    setQuizQuestions([]);
    for (let question of result) {
      setQuizQuestions((oldArray) => [...oldArray, question]);
      //   console.log(lesson);
      if (!arr.includes(question.attributes.section)) {
        arr.push(question.attributes.section);
      }
    }

    setAvailableQuizSections(arr);
  };

  //functions for add Lessons

  const handleEditLesson = async (lesson) => {
    setVisible(true);
    setEditing(true);
    setValues(lesson.attributes);
    setOrginalLessonValues(lesson.attributes);
    // console.log(lesson);
  };

  const handleEditQuizQuestion = async (question) =>{
      setQuizVisible(true);
      setQuizEditing(true)
      setQuestionDetails(question.attributes)
      setOriginalQuizQuestionDetails(question.attributes);
      
  }

  const handleAddLesson = async (e) => {
    //add lesson to course array
    e.preventDefault();
    console.log(lessons.length);
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
        // console.log(lessons);
        // console.log(lessons.length);
        course[0].set("lessonCount", lessons.length + 1);
        await course[0].save();

        //go through each lesson find max value and then max value + 1 is the incremnt proivded to index field that way this number will only increase
        //index values of the lessons will be swapped that are chainging order
        // whenever we query the lessons we will query based on accending of index attribute
        let maxValue = 0;
        for (let lesson of lessons) {
          if (lesson.attributes.index > maxValue) {
            maxValue = lesson.attributes.index;
          }
        }

        const newLesson = new Lesson();
        newLesson.set("title", values.title);
        newLesson.set("content", values.content);
        newLesson.set("video", values.video);
        newLesson.set("course", course[0]);
        newLesson.set("free_preview", values.free_preview);
        newLesson.set("index", maxValue + 1);
        if (course[0].attributes.sections.includes(values.section)) {
          newLesson.set("section", values.section);
        } else {
          console.log("select pending");
        }
        const addedLesson = await newLesson.save();

        setLessons((oldArray) => [...oldArray, addedLesson]);
        // console.log(lessons);
        setVisible(false);
        setUploadBtnText("Upload Video");
        setValues({
          ...values,
          title: "",
          content: "",
          section: "",
          video: {},
        });
      } else {
        toast("Please Input All Fields");
        // console.log("here i am");
      }
    } catch {}
    // console.log(values);
    // creates a lesson in the database which includes the video hash and url, title, course object id, , content
  };

  const handleUpdateLesson = async (e) => {
    try {
      //   console.log("CALLED");
      //   console.log(values);
      const Lesson = Moralis.Object.extend("Lesson");
      const query = new Moralis.Query(Lesson);
      query.equalTo("course", course[0]);
      query.equalTo("title", orginalLessonValues.title);
      const lessonToUpdate = await query.first();
      //   console.log(lessonToUpdate);
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

  const handleUpdateQuizQuestion = async(e)=>{
      try {
         

        const QuizQuestion = Moralis.Object.extend("QuizQuestion");
        const query = new Moralis.Query(QuizQuestion);
        query.equalTo("course", course[0]);
        query.equalTo("question", originalQuizQuestionDetails.question);
        const quizQuestionToUpdate = await query.first();
        quizQuestionToUpdate.set("question", questionDetails.question.trim());
        quizQuestionToUpdate.set("answer", questionDetails.answer.trim());
        quizQuestionToUpdate.set("options", questionDetails.options.filter((option) => option != ""));
        quizQuestionToUpdate.set("section", questionDetails.section.trim());
        await quizQuestionToUpdate.save();
        setOriginalQuizQuestionDetails(questionDetails);
        toast.success("Question Updated!",{duration:2000});
          
      } catch (error) {
          
      }
  }

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
      //   console.log(course[0]);
      //   console.log(courseUpdated);
      setCourse([courseUpdated]);
    }
  };

  const handleDeleteQuizQuestion = async(quizQuestionToRemove)=>{
       try {
        const QuizQuestion = Moralis.Object.extend("QuizQuestion")
        const query = new Moralis.Query(QuizQuestion);
        console.log(quizQuestionToRemove)
        query.equalTo("objectId",quizQuestionToRemove.id);
        const questionToDelete = await query.first();
        await questionToDelete.destroy();
        setQuizQuestions(quizQuestions.filter((question)=>question.id !=quizQuestionToRemove.id))
        toast.success("Question Deleted!",{duration:2000});

           
       } catch (error) {
           console.log(error)
       }
 
      
}

  const handleVideo = async (e) => {
    console.log("wow");
    try {
      //first check if there is already an exisitng video for the lesson if so delete before uplaoding new video
      if (values.video && values.video.Location) {
        await handleVideoRemove();
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
            //console.log(values);
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

  const activated = false;
  const handleLessonDrag = (e, index, section) => {
    activated = true;
    console.log("LESSON DRAG" + activated);
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleLessonDrop = async (e, index, section) => {
    console.log("LESSON DROP" + activated);
    console.log(section);
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;
    let allLessons = lessons.slice();

    let increment = 0;
    let indexToMove;
    let indexLocation;
    console.log(lessons);
    for (let i = 0; i < allLessons.length; i++) {
      if (allLessons[i].attributes.section == section) {
        if (increment == movingItemIndex) {
          indexToMove = i;
        }
        if (increment == targetItemIndex) {
          indexLocation = i;
        }
        increment++;
      }
    }
    if (indexToMove != undefined && indexLocation != undefined) {
      if (indexToMove != indexLocation) {
        console.log("indexToMove " + indexToMove);
        console.log("indexLocation " + indexLocation);
        let movingItem = allLessons[indexToMove];
        allLessons.splice(indexToMove, 1);
        allLessons.splice(indexLocation, 0, movingItem);
        setLessons(allLessons);

        const Lesson = Moralis.Object.extend("Lesson");
        const query = new Moralis.Query(Lesson);
        query.equalTo("objectId", lessons[indexToMove].id);
        const lessonToMove = await query.first();
        //   console.log(lessonToUpdate);
        lessonToMove.set("index", indexLocation);
        await lessonToMove.save();
        console.log(allLessons[indexToMove].id);
        query.equalTo("objectId", lessons[indexLocation].id);
        const lessonToTarget = await query.first();
        lessonToTarget.set("index", indexToMove);
        await lessonToTarget.save();
      }
    }
    //moralis query to update the two lessons and there index
  };

  const handleSectionDrag = (e, index, type) => {
    if (!activated) {
      e.dataTransfer.setData("sectionIndex", index);

      console.log("SECTION DRAG" + activated);
    }
  };

  const handleSectionDrop = async (e, index) => {
    if (!activated) {
      const movingItemIndex = e.dataTransfer.getData("sectionIndex");
      const targetItemIndex = index;
      let allSections = sections.slice();
      let movingItem = allSections[movingItemIndex];

      allSections.splice(movingItemIndex, 1);
      allSections.splice(targetItemIndex, 0, movingItem);

      setSections(allSections);
      console.log(allSections);

      course[0].set("sections", allSections);
      await course[0].save();
    }
    activated = false;
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
                class="  text-white font-bold  border-b-4 hover:border-b-2 hover:border-t-1 border-emerald-600   bg-emerald-500 shadow-md shadow-emerald-500/50 rounded-2xl justify-center text-md   w-full px-3  ml-10 mr-5 py-3 flex"
              >
                <PlusCircleIcon className="h-6 w-6 mx-1 " /> Add Lesson
              </button>
              <button
                onClick={() => {
                  setQuizVisible(true);
                }}
                class="  text-white font-bold  border-b-4 hover:border-b-2 hover:border-t-1 border-emerald-600   bg-emerald-500 shadow-md shadow-emerald-500/50 rounded-2xl justify-center text-md mr-10  w-full px-3 py-3 flex"
              >
                <DocumentTextIcon className="h-6 w-6 mx-1  " /> Add Quiz
              </button>
              <QuizModal
                course={course}
                quizVisible={quizVisible}
                setQuizVisible={setQuizVisible}
                setValues={setValues}
                setQuizEditing={setQuizEditing}
                values={values}
                uploading={uploading}
                sections={sections}
                quizEditing={quizEditing}
                setAvailableQuizSections={setAvailableQuizSections}
                availableQuizSections={availableQuizSections}
                questionDetails={questionDetails}
                setQuestionDetails={setQuestionDetails}
                handleUpdateQuizQuestion={handleUpdateQuizQuestion}
                quizQuestions={quizQuestions}
                setQuizQuestions={setQuizQuestions}
              ></QuizModal>

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
            {sections.map((section, sectionIndex) => (
              <ul onDragOver={(e) => e.preventDefault()}>
                <li
                  draggable
                  onDragStart={(e) =>
                    handleSectionDrag(e, sectionIndex, "section")
                  }
                  onDrop={(e) => handleSectionDrop(e, sectionIndex, "section")}
                  key={sectionIndex}
                >
                  <Accordion
                    title={section}
                    key={sectionIndex}
                    number={sectionIndex + 1}
                  >
                    <ul
                      onDragOver={(e) => e.preventDefault()}
                      class="bg-white rounded-xl border mx-10 border-gray-200 text-gray-900 text-sm  font-medium"
                    >
                      {lessons
                        .filter(
                          (lesson) => lesson.attributes.section == section
                        )
                        .map((lesson, lessonIndex) => (
                          <li
                            key={sections.length + lessonIndex}
                            class="px-4 py-5 border-b border-gray-200 w-full justify-between flex "
                            draggable
                            onDragStart={(e) =>
                              handleLessonDrag(
                                e,
                                lessonIndex,
                                lesson.attributes.section
                              )
                            }
                            onDrop={(e) =>
                              handleLessonDrop(
                                e,
                                lessonIndex,
                                lesson.attributes.section
                              )
                            }
                          >
                            <div>
                              <span className="rounded-full bg-gray-200 px-3 py-1">
                                {lessonIndex + 1}
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
                      <div>
                        {availableQuizSections.includes(section) && (
                          <QuizAccordion section={section}>
                              <ul className="m-3">
                            {quizQuestions
                              .filter(
                                (question) => question.attributes.section == section
                              )
                              .map((question, questionIndex) => (
                                <li
                                  key={questionIndex }
                                  class="px-4 py-5 border-b border-gray-200 w-full justify-between flex "
                               
                                >
                                  <div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1">
                                      {questionIndex + 1}
                                    </span>
                                    <span className=" px-3 py-1">
                                      {question.attributes.question}
                                    </span>
                                  </div>
                                  <span className=" px-3 py-1 flex">
                                    <PencilIcon
                                      onClick={() => handleEditQuizQuestion(question)}
                                      className="h-5 w-5  mr-2  text-cyan-400"
                                    />
                                    <TrashIcon
                                      onClick={() => handleDeleteQuizQuestion(question)}
                                      className="h-5 w-5    text-red-400"
                                    />
                                  </span>
                                </li>
                              ))}
                              </ul>
                          </QuizAccordion>
                        )}
                      </div>
                    </ul>
                  </Accordion>
                </li>
              </ul>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseView;
