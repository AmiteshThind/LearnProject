import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import UserNavbar from "../../components/user/UserNavBar";
import InstructorNavbar from "../../components/instructor/InstructorNavBar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReactPlayer from "react-player";
import Image from "next/image";
import { PlayIcon } from "@heroicons/react/outline";
import Accordion from "../../components/Accordion";
import defaultImage from "../../public/images/defaultImage.png";
import {
  EyeIcon,
  LockClosedIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import QuizAccordion from "../../components/QuizAccordion";
import toast, { Toaster } from "react-hot-toast";
import AdminNavBar from "../../components/admin/AdminNavBar";

function SingleCourse() {
  const [course, setCourse] = useState([]);
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useMoralis();
  const [lessons, setLessons] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [preview, setPreview] = useState("imagePreview");
  const [isUserEnrolled, setIsUserEnrolled] = useState(false);
  const [instructorUsername, setInstructorUsername] = useState("");
  const [instructorDescription, setInstructorDescription] = useState("");
  const [instructorProfilePicture, setInstructorProfilePicture] = useState("");

  //using the slug find the correct course so you can read that data and display it on this page
  // will also need lessons

  useEffect(() => {
    //load course from moralis based on slug
    //console.log(course)

    loadCourseandLessons();
    loadQuizQuestions();

    // checkIfUserIsEnrolled();

    //console.log(course)
  }, [isLoading, isAuthenticated, user]);

  const loadCourseandLessons = async () => {
    const Course = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Course);
    query.equalTo("slug", slug);

    const result = await query.find();

    if (result[0]) {
      console.log(result);
      setCourse(result);
      checkIfUserIsEnrolled(result[0]);
      loadInstructorDetails(result[0]);
    }

    const Lesson = Moralis.Object.extend("Lesson");
    const query2 = new Moralis.Query(Lesson);
    query2.equalTo("course", result[0]);
    query2.ascending("index");
    const result2 = await query2.find();
    // console.log(result2);
    setLessons([]);
    for (let lesson of result2) {
      setLessons((oldArray) => [...oldArray, lesson]);
      //   console.log(lesson);
    }
    console.log(result2);
    if (result2[0]) {
      //setPreview(result2[0].attributes.video.Location);
    }

    setIsLoading(false);
  };

  const loadQuizQuestions = async () => {
    const QuizQuestion = Moralis.Object.extend("QuizQuestion");
    const query = new Moralis.Query(QuizQuestion);
    query.equalTo("course", course[0]);
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
  };

  const checkIfUserIsEnrolled = async (course) => {
    const EnrolledUsersCourses = Moralis.Object.extend("EnrolledUsersCourses");
    const query = new Moralis.Query(EnrolledUsersCourses);

    console.log("this runs");

    query.equalTo("course", course);
    query.equalTo("user", user);
    const result = await query.find();
    console.log(result + "w");
    if (result[0] != undefined && isAuthenticated) {
      console.log("r");
      setIsUserEnrolled(true);
    } else {
      setIsUserEnrolled(false);
    }

    // if (
    //   course[0] != undefined &&
    //   course[0].attributes.usersEnrolled.includes(user.id)
    // ) {
    //   setIsUserEnrolled(true);
    // }
  };

  const loadInstructorDetails = async (course) => {
    const Instructors = Moralis.Object.extend("instructorSubmissions");
    const query = new Moralis.Query(Instructors);
    query.equalTo("user", course.attributes.instructor);
    const result = await query.find();
    console.log(course);
    if (result[0]) {
      setInstructorUsername(result[0].attributes.name);
      setInstructorDescription(result[0].attributes.question1);
      if (result[0].attributes.profilePicture != undefined) {
        setInstructorProfilePicture(result[0].attributes.profilePicture._url);
      } else {
        setInstructorProfilePicture(defaultImage);
      }
    }
  };

  const unlockMessage = () => {
    toast("Purchase Course To Unlock", {
      icon: "⚠️",
      style: {
        borderRadius: "10px",
        background: "#fff",
      },
    });
  };

  const enrollUser = async () => {
    // if user isnt enrolled there will be smart contract interaction in which user will pay or if free still interact with smart contract to be enrolled and then once paid to smart contract user will be granted access and added to enrolled users in the Moralis Database
    //for now we will just add users and intergrate smart contract later

    //enrolled user class checks all the courses a user is enrolled in

    // make a query to EnrolledUsersCourses to add user with course they are enrolled in
    try {
      const EnrolledUsersCourses = Moralis.Object.extend(
        "EnrolledUsersCourses"
      );
      const newEnrolledUserCourse = new EnrolledUsersCourses();
      // //check if user is already in enrolled in course first
      // const query = new Moralis.Query(newEnrolledUserCourse);
      // query.equalTo("course",course[0])
      // query.equalTo("user",user)
      // const result = await query.find();
      newEnrolledUserCourse.set("course", course[0]);
      newEnrolledUserCourse.set("user", user);
      newEnrolledUserCourse.set("courseName", course[0].attributes.name);

      let quizScore = {};
      for (let section of course[0].attributes.sections) {
        quizScore[section] = 0;
      }

      newEnrolledUserCourse.set("quizScore", quizScore);

      await newEnrolledUserCourse.save();
      console.log("done");

      setIsUserEnrolled(true);

      const Courses = Moralis.Object.extend("Course");
      const query = new Moralis.Query(Courses);
      query.equalTo("slug", slug);
      let objectToUpdate = await query.first();
      objectToUpdate.set(
        "amountEarned",
        course[0].attributes.amountEarned + course[0].attributes.price
      );
      objectToUpdate.set(
        "studentsEnrolled",
        course[0].attributes.studentsEnrolled + 1
      );
      await objectToUpdate.save();
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      // must be conencted tot ry to enroll in course
    }
  };

  const updatePreview = (lesson) => {
    console.log(preview);
    setPreview(lesson.attributes.video.Location);
    console.log(lesson.attributes.video.Location);
    document
      .getElementById("reactPlayer")
      .scrollIntoView({ block: "end", behavior: "smooth" });
  };

  return (
    <div className="  bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white ">
      <div>
        {isAuthenticated && user.attributes.role == "instructor" ? (
          <InstructorNavbar />
        ) : isAuthenticated && user.attributes.role == "admin" ? (
          <AdminNavBar />
        ) : (
          <UserNavbar />
        )}
      </div>
      {course[0] && lessons[0] && (
        <div className="flex flex-col p-5  items-stretch sm:p-10     ">
          <div className="flex flex-wrap justify-center ">
            <div className="w-full lg:w-6/12 h-full bg-zinc-800 p-10 rounded-3xl rounded-bl-3xl flex mx-5 flex-col">
              <div className=" text-4xl text-transparent bg-clip-text bg-gradient-to-br pb-2 from-teal-500 to-emerald-500   font-extrabold ">
                {course[0].attributes.name}
              </div>
              <div className=" text-md text-transparent bg-clip-text bg-gradient-to-br  from-teal-500 to-emerald-500 mt-2   font-semibold ">
                By {instructorUsername}
              </div>

              <div class="badge bg-gradient-to-l from-teal-500    to-emerald-500  border-none px-4 py-4 mt-4     truncate   ">
                {course[0].attributes.category}
              </div>
              <div className=" mt-4 text-md text-transparent bg-clip-text bg-gradient-to-br from-teal-500 to-emerald-500 font-semibold ">
                Updated {course[0].updatedAt.toISOString().split("T")[0]}
              </div>

              <div class=" mt-4 text-3xl text-transparent bg-clip-text bg-gradient-to-br pb-2 from-teal-500 to-emerald-500 font-extrabold ">
                {course[0].attributes.paid
                  ? course[0].attributes.price + " BUSD"
                  : "Free"}
              </div>

              <div className="prose flex mt-7 text-sm    ">
                <ReactMarkdown
                  className="w-12/12 flex-grow  "
                  remarkPlugins={[remarkGfm]}
                  children={course[0].attributes.description}
                />
              </div>
              <label className="font-extrabold text-3xl mt-10 text-transparent bg-clip-text bg-gradient-to-br pb-2 from-teal-500 to-emerald-500">
                Instructor
              </label>
              <div className="w-full flex-wrap  border p-5 flex rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-500   border-zinc-700">
                <div className="flex-wrap justify-center w-full flex">
                  <div class=" avatar">
                    <div class="w-24 h-24 md:w-48 md:h-48 rounded-full  ">
                      <label>
                        {instructorProfilePicture && (
                          <Image
                            src={instructorProfilePicture}
                            className="w-2 h-2"
                            height={250}
                            width={250}
                          />
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex mt-2 flex-col  flex-wrap px-5  w-full  ">
                  <div className="text-xl flex-wrap font-extrabold">
                    Hi I'm {instructorUsername}!
                  </div>
                  <div className="mt-2 flex-wrap">{instructorDescription}</div>
                </div>
              </div>
            </div>
            <div className="w-full h-full pb-10 mt-10 lg:mt-0 flex flex-col lg:w-4/12 bg-zinc-800 mx-5 px-5 py-5 rounded-3xl  items-center  flex-wrap ">
              {lessons[0].attributes.video &&
              lessons[0].attributes.video.Location ? (
                <div className="flex justify-start p-5 sm:p-10  w-full player-wrapper  ">
                  <ReactPlayer
                    id="reactPlayer"
                    url={
                      preview == "imagePreview"
                        ? lessons[0].attributes.video.Location
                        : preview
                    }
                    width={"100%"}
                    height={"100%"}
                    controls
                    className="react-player border-8 border-zinc-800 rounded-3xl      "
                    light={
                      preview == "imagePreview"
                        ? course[0].attributes.image_preview._url
                        : null
                    }
                    playIcon={
                      <button
                        type="button"
                        class="text-white bg-emerald-500 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
                      >
                        <PlayIcon className="h-10 w-10 text-emerald-50" />
                      </button>
                    }
                    config={{
                      file: {
                        attributes: {
                          controlsList: "nodownload",
                        },
                      },
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              ) : (
                <div>
                  <Image
                    src={course[0].attributes.image_preview._url}
                    className="rounded-lg"
                    width="400rem"
                    height="200rem"
                  />
                </div>
              )}
              <button
                disabled={!isAuthenticated}
                onClick={() => {
                  isUserEnrolled
                    ? router.push(`/user/course/${slug}`)
                    : enrollUser();
                }}
                className={`py-3 bg-gradient-to-bl from-teal-500 to-emerald-500 w-full rounded-3xl hover:scale-95 duration-300 font-semibold my-2 text-xl ${
                  !isAuthenticated ? "brightness-75" : "brightness-100"
                }`}
              >
                {!isAuthenticated?"Connect Wallet to Enroll" : isUserEnrolled ? "Go To Course" : "Enroll"}
              </button>
              <div className="mt-8  justify-center flex  w-4/5 items-start font-extrabold text-3xl">
                Course Content
              </div>
              {course[0].attributes.sections.map((section, sectionIndex) => (
                <ul className="w-full">
                  <li key={sectionIndex}>
                    <Accordion
                      title={section}
                      key={sectionIndex}
                      number={sectionIndex + 1}
                    >
                      <ul class=" rounded-xl  mx-10 text-white text-sm  font-medium">
                        {lessons
                          .filter(
                            (lesson) => lesson.attributes.section == section
                          )
                          .map((lesson, lessonIndex) => (
                            <li
                              key={lessonIndex}
                              class="px-4 py-5  w-full justify-between flex "
                            >
                              <div className="flex">
                                <span className="rounded-full h-[1.5rem] flex justify-center items-center flex-col bg-gradient-to-br from-emerald-500   to-teal-400 px-2.5 ">
                                  {lessonIndex + 1}
                                </span>
                                <span className=" px-3 py-1">
                                  {lesson.attributes.title}
                                </span>
                              </div>
                              <span className=" px-3 py-1 flex">
                                {lesson.attributes.free_preview && (
                                  <EyeIcon
                                    onClick={() => updatePreview(lesson)}
                                    className="h-5 w-5  mr-2  text-emerald-200 hover:text-emerald-500 cursor-pointer"
                                  />
                                )}
                              </span>
                            </li>
                          ))}

                        <div className="flex transition transform hover:-translate-y-1 justify-between   border-2 border-emerald-500 mx-2 my-3  py-5 font-bold   rounded-2xl">
                          <div className="ml-5 text-md">
                            <span>{section + " " + "Quiz"}</span>
                          </div>
                          <LockClosedIcon
                            onClick={unlockMessage}
                            className="h-6 text-emerald-500 w-6 mr-5 hover:text-emerald-700 cursor-pointer"
                          />
                        </div>
                      </ul>
                    </Accordion>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      )}
      <div>
        <Toaster position="bottom-left" reverseOrder={false} />
      </div>
    </div>
  );
}

export default SingleCourse;
