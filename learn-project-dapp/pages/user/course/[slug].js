import React, { useEffect, useState } from "react";
import { user, isAuthenticated, useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import UserNavbar from "../../../components/user/UserNavBar";
import InstructorNavbar from "../../../components/instructor/InstructorNavBar";
import { useRouter } from "next/router";
import remarkGfm from "remark-gfm";
import ReactPlayer from "react-player";
import {
  BookOpenIcon,
  CheckCircleIcon,
  CheckIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/outline";
import QuizAccordion from "../../../components/QuizAccordion";
import Accordion from "../../../components/Accordion";
import { PlayIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/react/solid";
import UserQuiz from "../../../components/UserQuiz";
import AdminNavBar from "../../../components/admin/AdminNavBar";
import toast, { Toaster } from "react-hot-toast";
import { allowedStatusCodes } from "next/dist/lib/load-custom-routes";

function CourseMainpage() {
  const { user, isAuthenticated } = useMoralis();
  const [isLoading, setIsLoading] = useState(true);
  const [userIsEnrolled, setUserIsEnrolled] = useState(false);
  const [course, setCourse] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const router = useRouter();
  const { slug } = router.query;
  const [preview, setPreview] = useState("imagePreview");
  const [availableQuizSections, setAvailableQuizSections] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [unlockedQuizzes, setUnlockedQuizzes] = useState([]);
  const [currentQuizSection, setCurrentQuizSection] = useState("");
  const [rewardsEarned, setRewardsEarned] = useState(0);
  const [rewardsClaimed, setRewardsClaimed] = useState(0);

  useEffect(() => {
    //check if user accessing this course is enrolled in this course

    console.log("wow");
    loadCourseLessonsQuizData();
    //loadQuizQuestions();
  }, [isAuthenticated, isLoading]);

  // const checkIfUserIsEnrolled = async () => {
  //   const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
  //   const query = new Moralis.Query(EnrolledUserCourses);
  //   query.equalTo("user", user);
  //   const result = await query.find();
  //   if (result.length != 0) {
  //     setUserIsEnrolled(true);
  //     console.log(result);
  //   } else {
  //     setUserIsEnrolled(false);
  //   }
  // };

  const loadCourseLessonsQuizData = async () => {
    const Course = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Course);
    query.equalTo("slug", slug);

    const result = await query.find();

    if (result[0]) {
      console.log(result);
      setCourse(result);
      console.log(user.attributes.role);
      setUnlockedQuizzes(result[0].attributes.sections);
    }
    //check completed courses
    const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
    const query3 = new Moralis.Query(EnrolledUserCourses);
    query3.equalTo("user", user);
    query3.equalTo("course", result[0]);
    const result3 = await query3.find();
    if (result3[0]) {
      //user is
      if (
        result[0].attributes.state !="published" &&
        user &&
        user.attributes.role != "admin"
      ) {
        router.push("/marketplace");
      }
      setUserIsEnrolled(true);
      setCompletedLessons(result3[0].attributes.completedLessons);
      console.log(result3[0].attributes.completedLessons);

      if (user.attributes.role != "admin") {
        setUnlockedQuizzes(result3[0].attributes.unlockedQuizzes);
      }

      setRewardsEarned(result3[0].attributes.rewardsEarned);
      setRewardsClaimed(result3[0].attributes.rewardsClaimed);
    } else {
      setUserIsEnrolled(false);
    }

    if (user && user.attributes.role == "admin") {
      setUserIsEnrolled(true);
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

    const QuizQuestion = Moralis.Object.extend("QuizQuestion");
    const query4 = new Moralis.Query(QuizQuestion);
    query4.equalTo("course", result[0]);
    const result4 = await query4.find();
    let arr = [];
    // console.log(result2);
    setQuizQuestions([]);
    for (let question of result4) {
      setQuizQuestions((oldArray) => [...oldArray, question]);
      //   console.log(lesson);
      if (!arr.includes(question.attributes.section)) {
        arr.push(question.attributes.section);
      }
    }

    setAvailableQuizSections(arr);

    setIsLoading(false);
  };

  const loadQuizQuestions = async () => {
    // const QuizQuestion = Moralis.Object.extend("QuizQuestion");
    // const query = new Moralis.Query(QuizQuestion);
    // query.equalTo("course", course[0]);
    // const result = await query.find();
    // let arr = [];
    // // console.log(result2);
    // setQuizQuestions([]);
    // for (let question of result) {
    //   setQuizQuestions((oldArray) => [...oldArray, question]);
    //   //   console.log(lesson);
    //   if (!arr.includes(question.attributes.section)) {
    //     arr.push(question.attributes.section);
    //   }
    // }
    // setAvailableQuizSections(arr);
  };

  const lessonCompleted = async (lessonCompletedId, section) => {
    console.log(section);

    if (user.attributes.role != "admin") {
      if (!completedLessons.includes(lessonCompletedId)) {
        setCompletedLessons((oldArray) => [...oldArray, lessonCompletedId]);

        //need to update Moralis as well

        const EnrolledUserCourses = Moralis.Object.extend(
          "EnrolledUsersCourses"
        );
        const query = new Moralis.Query(EnrolledUserCourses);
        query.equalTo("user", user);
        query.equalTo("course", course[0]);
        const objectToUpdate = await query.first();
        console.log(objectToUpdate);
        let arr = completedLessons;
        arr.push(lessonCompletedId);
        objectToUpdate.set("completedLessons", arr);
        await objectToUpdate.save();

        //need to check if all the lessons have been watched for the section. If they have then quiz should be unlocked.

        unlockQuiz(section);
      }
    }
  };

  const unlockQuiz = async (section) => {
    //completed lessons ids and lessons ids
    // i need to filter the lessons array by section and then for each lesson id check if it is in completed lessons if not then quiz is not unlockable yet
    if (!unlockedQuizzes.includes(section)) {
      const sectionLessons = lessons.filter(
        (lesson) => lesson.attributes.section == section
      );
      console.log(sectionLessons);
      console.log(completedLessons);

      for (let lesson of sectionLessons) {
        if (!completedLessons.includes(lesson.id)) {
          return;
        }
      }

      setUnlockedQuizzes((oldArray) => [...oldArray, section]);
      const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
      const query = new Moralis.Query(EnrolledUserCourses);
      query.equalTo("user", user);
      query.equalTo("course", course[0]);
      const objectToUpdate = await query.first();
      console.log(objectToUpdate);
      let arr = unlockedQuizzes;
      arr.push(section);
      objectToUpdate.set("unlockedQuizzes", arr);
      await objectToUpdate.save();
    }
  };

  const claimLearn = async () => {
    if (user.attributes.role != "admin") {
      const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
      const query = new Moralis.Query(EnrolledUserCourses);
      query.equalTo("user", user);
      query.equalTo("course", course[0]);
      const objectToUpdate = await query.first();
      objectToUpdate.set("rewardsClaimed", rewardsEarned);
      setRewardsClaimed(rewardsEarned);
      await objectToUpdate.save();
    } else if (user.attributes.role == "admin") {
      toast.error("Must Be valid user");
    }
  };

  const openQuiz = (section) => {
    if (unlockedQuizzes.includes(section)) {
      setCurrentQuizSection(section);
      setShowQuiz(true);
    }
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
      {isAuthenticated && course[0] && lessons[0] && (
        <div className="flex justify-evenly mt-10 flex-wrap  rounded-3xl ">
          <div className="flex       w-full  sm:ml-5 sm:mr-2.5    mb-10 mt-5 h-full sm:w-full   shadow-teal-800 rounded-3xl lg:w-6/12 xl:w-7/12    items-start flex-col     flex-stretch  ">
            <div className="flex  w-full flex-col">
              <div className="w-full flex rounded-3xl   mb-5 justify-between">
                <div class="shadow stats w-full">
                  <div class="stat bg-zinc-800  ">
                    <div class="stat-figure text-yellow-500">
                      <CheckCircleIcon className="w-10 h-10" />
                    </div>
                    <div class="stat-title text-white">Progress</div>
                    <div class="stat-value text-white">
                      {Math.round(
                        (completedLessons.length / lessons.length) * 100
                      )}
                      %
                    </div>
                  </div>
                  <div class="stat bg-zinc-800  ">
                    <div class="stat-figure text-emerald-500">
                      <LockOpenIcon className="w-10 h-10" />
                    </div>
                    <div class="stat-title text-white">Unlocked Quizzes</div>
                    <div class="stat-value text-white">
                      {unlockedQuizzes.length}/{availableQuizSections.length}
                    </div>
                  </div>

                  <div class="stat bg-zinc-800 ">
                    <div class="stat-figure text-emerald-500">
                      <CurrencyDollarIcon className="w-10 h-10" />
                    </div>
                    <div class="stat-title text-white">$LEARN Rewarded</div>
                    <div class="stat-value text-white ">{rewardsEarned}</div>
                    <div class="stat-desc text-white">
                      Pending Claim: {rewardsEarned - rewardsClaimed} LEARN
                    </div>
                  </div>

                  <div class="stat bg-zinc-800  flex items-center p-3 justify-center">
                    <div
                      onClick={claimLearn}
                      class=" w-3/4 h-3/4   btn bg-gradient-to-br   from-teal-500 to-emerald-500      border-none text-xl"
                    >
                      {" "}
                      Claim LEARN
                    </div>
                  </div>
                </div>
              </div>
              {!showQuiz ? (
                <div className="w-full  rounded-3xl">
                  {lessons[0].attributes.video &&
                  lessons[0].attributes.video.Location ? (
                    <div className="flex flex-wrap justify-start        player-wrapper  ">
                      <ReactPlayer
                        id="reactPlayer"
                        url={
                          preview == "imagePreview"
                            ? lessons[0].attributes.video.Location
                            : preview.attributes.video.Location
                        }
                        width={"100%"}
                        height={"100%"}
                        controls
                        onEnded={() =>
                          lessonCompleted(
                            preview.id,
                            preview.attributes.section
                          )
                        }
                        className="react-player rounded-3xl "
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
                </div>
              ) : (
                <div className="flex justify-center ">
                  <UserQuiz
                    availableQuizSections={availableQuizSections}
                    claimLearn={claimLearn}
                    setRewardsClaimed={setRewardsClaimed}
                    rewardsEarned={rewardsEarned}
                    setRewardsEarned={setRewardsEarned}
                    user={user}
                    course={course}
                    section={currentQuizSection}
                    quizQuestions={quizQuestions.filter(
                      (question) =>
                        question.attributes.section == currentQuizSection
                    )}
                  />
                </div>
              )}
              <div className=""></div>
            </div>
          </div>
          <div className="flex h-full bg-zinc-800 rounded-3xl sm:mr-5 sm:ml-2.5    shadow-teal-800   border-none pt-5 pb-10 w-full sm:w-full lg:w-4/12 md:w-full  flex-col  mb-10 sm:mb-10   mt-5">
            <div className="justify-center flex  w-full items-start font-extrabold text-3xl my-2">
              Course Content
            </div>
            <div className="flex flex-col w-full overflow-auto h-[42rem] scroll-smooth scrollbar-thin  scrollbar-track-rounded-3xl scrollbar-thumb-white   scrollbar-track-zinc-800">
              {course[0].attributes.sections.map((section, sectionIndex) => (
                <ul className="">
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
                              key={
                                course[0].attributes.sections.length +
                                lessonIndex
                              }
                              class="px-4 py-5  w-full justify-between flex cursor-pointer group "
                              onClick={() => {
                                setPreview(lesson);
                                setShowQuiz(false);
                              }}
                            >
                              <div className="flex">
                                <span className="rounded-full h-[1.5rem] flex justify-center items-center flex-col bg-gradient-to-br from-emerald-500   to-teal-400 px-2.5 ">
                                  {lessonIndex + 1}
                                </span>
                                <span className=" px-3 py-1">
                                  {lesson.attributes.title}
                                </span>
                              </div>
                              <div>
                                {completedLessons.includes(lesson.id) ? (
                                  <CheckCircleIcon className="w-6 h-6 text-emerald-500 cursor-pointer " />
                                ) : (
                                  <PlayIcon className="w-6 h-6 text-zinc-500 group-hover:text-teal-500 group-hover:scale-110 cursor-pointer " />
                                )}
                              </div>
                            </li>
                          ))}
                        <div>
                          {availableQuizSections.includes(section) && (
                            <div
                              onClick={() => {
                                openQuiz(section);
                              }}
                              className="flex cursor-pointer transition transform hover:-translate-y-1 justify-between hover:bg-emerald-500   border-2 border-emerald-500 mx-2 my-3  py-5 font-bold   rounded-2xl"
                            >
                              <div className="ml-5 text-md">
                                <span>{section + " " + "Quiz"}</span>
                              </div>
                              {unlockedQuizzes.includes(section) ? (
                                <LockOpenIcon className="h-6 text-emerald-500 w-6 mr-5 hover:text-emerald-700 cursor-pointer" />
                              ) : (
                                <LockClosedIcon className="h-6 text-emerald-500 w-6 mr-5 hover:text-emerald-700 cursor-pointer" />
                              )}
                            </div>
                          )}
                        </div>
                      </ul>
                    </Accordion>
                  </li>
                </ul>
              ))}
            </div>
            <Toaster />
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseMainpage;
