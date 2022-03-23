import Moralis from "moralis";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMoralis } from "react-moralis";
import AdminNavBar from "../../components/admin/AdminNavBar";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import ReactPlayer from "react-player";

function courseupdate() {
  const { user, isAuthenticated } = useMoralis();
  const [courseDescriptionToUpdate, setCourseDescriptionToUpdate] = useState(
    []
  );
  const [lessonsToUpdate, setLessonsToUpdate] = useState([]);
  const [quizQuestionsToUpdate, setQuizQuestionsToUpdate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.attributes.role != "admin") {
        router.push("/error/access");
      } else {
        loadCourseUpdatedContent();
        if (user.attributes.role == "admin") {
          console.log("be");
          setIsLoading(false);
        }
      }
    }
  }, [isAuthenticated, isLoading, user]);

  const loadCourseUpdatedContent = async () => {
    //3 differnt sections and if change is approved or not for each change must be displayed and approved

    // const updatedCourse = Moralis.Object.extend("UpdatedCourse");
    // const query = new Moralis.Query(updatedCourse);
    // query.equalTo("state", "pending");
    // const courseData = await query.find();

    const courseToUpdate = Moralis.Object.extend("UpdatedCourse");
    const query = new Moralis.Query(courseToUpdate);
    query.equalTo("state", "pending");
    const result = await query.find();
    console.log(result);
    console.log("wo");
    if (result[0] != undefined) {
      console.log("w");
      setCourseDescriptionToUpdate(result);
    }

    const updatedLessons = Moralis.Object.extend("UpdatedLesson");
    const queryLesson = new Moralis.Query(updatedLessons);
    queryLesson.equalTo("state", "pending");
    const lessonsData = await queryLesson.find();
    console.log(JSON.stringify(lessonsData[1]) + "o");
    if (lessonsData[0] != undefined) {
      setLessonsToUpdate(lessonsData);
      console.log("meow");
    }

    const updatedQuiz = Moralis.Object.extend("UpdatedQuizQuestion");
    const queryQuiz = new Moralis.Query(updatedQuiz);
    queryQuiz.equalTo("state", "pending");
    const quizData = await queryQuiz.find();
    if (quizData[0] != undefined) {
      setQuizQuestionsToUpdate(quizData);
    }
  };

  const approveUpdatedQuizQuestion = async (updatedQuizQuestion) => {
   
    try {
      console.log(updatedQuizQuestion)
      const quizQuestion = Moralis.Object.extend("QuizQuestion");
      const query = new Moralis.Query(quizQuestion);
      query.equalTo(
        "objectId",
        updatedQuizQuestion.attributes.quizQuestionToUpdate
      );
      const result = await query.find();
      console.log(result)
      if (result[0] != undefined) {
        console.log('wme')
        result[0].set("section", updatedQuizQuestion.attributes.section);
        result[0].set("question", updatedQuizQuestion.attributes.question);
        result[0].set("options", updatedQuizQuestion.attributes.options);
        result[0].set("answer", updatedQuizQuestion.attributes.answer);
        await result[0].save();

        const quizQuestionToUpdate = Moralis.Object.extend(
          "UpdatedQuizQuestion"
        );
        const queryUpdatedQuizQuestion = new Moralis.Query(
          quizQuestionToUpdate
        );
        queryUpdatedQuizQuestion.equalTo("state", "pending");
        queryUpdatedQuizQuestion.equalTo("objectId", updatedQuizQuestion.id);
        const updatedQuizQuestionResult = await queryUpdatedQuizQuestion.find();
        if (updatedQuizQuestionResult[0] != undefined) {
          updatedQuizQuestionResult[0].set("state", "approved");
          await updatedQuizQuestionResult[0].save();
          let updatedQuizArray = quizQuestionsToUpdate.filter(
            (submission) => submission.id != updatedQuizQuestion.id
          );
          setQuizQuestionsToUpdate(updatedQuizArray);
          toast.success("Quiz Question Update Approved");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const rejectUpdatedQuizQuestion = async(updatedQuizQuestion)=>{
    try {
      const quizQuestionToUpdate = Moralis.Object.extend("UpdatedQuizQuestion");
      const query = new Moralis.Query(quizQuestionToUpdate);
      query.equalTo("state", "pending");
      query.equalTo("objectId", updatedQuizQuestion.id);
      const result = await query.find();
      result[0].set("state","rejected");
      await result[0].save();

      let updatedQuizArray = quizQuestionsToUpdate.filter(
        (submission) => submission.id != updatedQuizQuestion.id
      );
      setQuizQuestionsToUpdate(updatedQuizArray);

      toast.success("Lesson Update Rejected");
    } catch (error) {
      toast.error(error.message);
    }
  }

  const approveUpdatedLesson = async (updatedLesson) => {
    try {
      console.log("reacehd");
      const Lesson = Moralis.Object.extend("Lesson");
      const query = new Moralis.Query(Lesson);
      query.equalTo("objectId", updatedLesson.attributes.lessonToUpdate);
      const result = await query.find();

      if (result[0] != undefined) {
        result[0].set("title", updatedLesson.attributes.title);
        result[0].set("content", updatedLesson.attributes.content);
        result[0].set("video", updatedLesson.attributes.video);
        result[0].set("section", updatedLesson.attributes.section);
        result[0].set("free_preview", updatedLesson.attributes.free_preview);
        await result[0].save();

        const LessonToUpdate = Moralis.Object.extend("UpdatedLesson");
        const queryUpdatedLesson = new Moralis.Query(LessonToUpdate);
        queryUpdatedLesson.equalTo("state", "pending");
        queryUpdatedLesson.equalTo("objectId", updatedLesson.id);
        const updatedLessonResult = await queryUpdatedLesson.find();
        if (updatedLessonResult[0] != undefined) {
          updatedLessonResult[0].set("state", "approved");
          await updatedLessonResult[0].save();
          let updatedLessonsArray = lessonsToUpdate.filter(
            (submission) => submission.id != updatedLesson.id
          );

          setLessonsToUpdate(updatedLessonsArray);
          toast.success("Lesson Update Approved");
        }
      }
    } catch (error) {}
  };

  const rejectUpdatedLesson = async (updatedLesson) => {
    try {
      const lessonToUpdate = Moralis.Object.extend("UpdatedLesson");
      const query = new Moralis.Query(lessonToUpdate);
      query.equalTo("state", "pending");
      query.equalTo("objectId", updatedLesson.id);
      const result = await query.find();
      await result[0].destroy();

      let updatedLessonsArray = lessonsToUpdate.filter(
        (submission) => submission.id != updatedLesson.id
      );

      setLessonsToUpdate(updatedLessonsArray);

      toast.success("Lesson Update Rejected");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const rejectCourseDescriptionUpdate = async (updatedCourse) => {
    try {
      const courseToUpdate = Moralis.Object.extend("UpdatedCourse");
      const queryCourseToUpdate = new Moralis.Query(courseToUpdate);
      queryCourseToUpdate.equalTo("state", "pending");
      queryCourseToUpdate.equalTo("objectId", updatedCourse.id);
      const result = await queryCourseToUpdate.find();
      await result[0].destroy();
      let updatedCourseDescriptionToUpdate = courseDescriptionToUpdate.filter(
        (submission) => submission.id != updatedCourse.id
      );

      setCourseDescriptionToUpdate(updatedCourseDescriptionToUpdate);

      toast.success("Course Update Rejected");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const approveCourseDescriptionUpdate = async (updatedCourse) => {
    try {
      const Course = Moralis.Object.extend("Course");
      const query = new Moralis.Query(Course);
      query.equalTo("objectId", updatedCourse.attributes.courseToUpdate);
      const result = await query.find();
      console.log(result[0] + "wpw");
      if (result[0] != undefined) {
        result[0].set("name", updatedCourse.attributes.name);
        result[0].set("description", updatedCourse.attributes.description);
        result[0].set("paid", updatedCourse.attributes.paid);
        result[0].set("price", updatedCourse.attributes.price);
        result[0].set("slug", updatedCourse.attributes.slug);
        result[0].set("sections", updatedCourse.attributes.sections);
        result[0].set("category", updatedCourse.attributes.category);

        if (updatedCourse.attributes.image_preview != undefined) {
          result[0].set(
            "image_preview",
            updatedCourse.attributes.image_preview
          );
        }

        await result[0].save();

        const courseToUpdate = Moralis.Object.extend("UpdatedCourse");
        const queryCourseToUpdate = new Moralis.Query(courseToUpdate);
        queryCourseToUpdate.equalTo("state", "pending");
        queryCourseToUpdate.equalTo("objectId", updatedCourse.id);
        const result2 = await queryCourseToUpdate.find();
        console.log(result);
        console.log("wo");
        if (result2[0] != undefined) {
          console.log("w");
          result2[0].set("state", "approved");
          await result2[0].save();
          //need to update courseDescriptionToUpdate array as well by removing this elemnent from the array
          let updatedCourseDescriptionToUpdate =
            courseDescriptionToUpdate.filter(
              (submission) => submission.id != updatedCourse.id
            );

          setCourseDescriptionToUpdate(updatedCourseDescriptionToUpdate);
          toast.success("Course Update Approved");
        }
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className=" bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white">
      <div>
        <AdminNavBar />
      </div>
      {!isLoading && (
        <div>
          <div>
            <div className="flex justify-center ">
              {/* {JSON.stringify(
            userEnrolledCourses[0].attributes.course.attributes,
            0,
            null
          )} */}
              <div className="w-3/4 bg-zinc-800 rounded-3xl mb-5  flex-col mt-10">
                <div className="text-5xl font-extrabold pt-8 pb-4 px-8 w-full text-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 ">
                  Course Updates
                </div>

                <div className="mx-5 flex flex-col flex-wrap my-8 ">
                  <div className="flex flex-col">
                    <div className="text-3xl font-extrabold mb-3">
                      Updated Course Descriptions
                    </div>
                    <div>
                      {courseDescriptionToUpdate.map((course, index) => (
                        <div className="w-full   my-3 border border-zinc-600 rounded-2xl p-3 ">
                          <div className="flex flex-wrap  md:flex-none  justify-between  w-full items-center">
                            <div className="text-xl font-semibold my-3 w-full md:w-1/4    ">
                              {course.attributes.originalCourseName}
                            </div>
                            <div>
                              <button className="text-xl  bg-transparent border-2 border-teal-500 rounded-2xl p-3 hover:bg-gradient-to-r from-teal-500 to-teal-400 font-semibold  ">
                                <label
                                  for={"my-modal2" + index}
                                  class=" cursor-pointer  modal-button"
                                >
                                  View Updates
                                </label>
                              </button>

                              <input
                                type="checkbox"
                                id={"my-modal2" + index}
                                class="modal-toggle"
                              />
                              <div class="modal text-white">
                                <div class="modal-box border border-zinc-600 bg-zinc-800">
                                  <label className="  flex justify-center text-3xl font-extrabold mb-5">
                                    Course Description Update
                                  </label>
                                  <form>
                                    <div class="flex items-center  ">
                                      <div class="w-full flex flex-col   ">
                                        <label class="font-semibold leading-none text-white">
                                          Course Name
                                        </label>
                                        <input
                                          name="name"
                                          value={course.attributes.name}
                                          disabled
                                          placeholder="eg. Beginners  Guide to Investing in Crypto "
                                          type="text"
                                          class="  border border-zinc-600 bg-transparent p-3 rounded-xl  mt-2  "
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <div className="w-full flex flex-col mt-5  ">
                                        <label class="font-semibold leading-none text-white">
                                          Description
                                        </label>
                                        <textarea
                                          name="description"
                                          value={course.attributes.description}
                                          disabled
                                          required
                                          placeholder="Give a breif overfiew of what students can expect to learn from this course"
                                          type="text"
                                          className="h-40 w-prose border border-zinc-600 bg-transparent p-3 rounded-xl  mt-3  "
                                        ></textarea>
                                      </div>
                                    </div>

                                    <div class="flex items-center mt-5  ">
                                      <div class="w-full flex flex-col   ">
                                        <label class="font-semibold leading-none text-white ">
                                          Sections
                                        </label>
                                        <input
                                          name="sections"
                                          value={course.attributes.sections}
                                          disabled
                                          required
                                          placeholder="eg. Setup, Config, Defi ... "
                                          type="text"
                                          class="border border-zinc-600 bg-transparent p-3 rounded-xl  mt-2 "
                                        />
                                      </div>
                                    </div>
                                    <div className="mt-5 mb-4 w-full flex-col  flex-stretch justify-start">
                                      <div className="flex  ">
                                        <div className="flex">
                                          <div className="flex flex-col  sm:mr-5 md:mr-5 lg:mr-5 xl:mr-5 ">
                                            <label className=" font-semibold leading-none mb-3 text-white ">
                                              Paid
                                            </label>
                                            <div class="flex justify-center ">
                                              <div class="mb-3 w-full">
                                                {course.attributes.paid && (
                                                  <select class=" select select-ghost text-white text-center ">
                                                    <option selected>
                                                      Yes
                                                    </option>
                                                  </select>
                                                )}
                                                {!course.attributes.paid && (
                                                  <select class=" select select-ghost text-white text-center ">
                                                    <option selected>No</option>
                                                  </select>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {course.attributes.paid && (
                                          <div className="flex">
                                            <div className="flex flex-col mr-5 ">
                                              <label className=" font-semibold leading-none mb-3 text-white ">
                                                Price(BUSD)
                                              </label>
                                              <div class="flex justify-center text ">
                                                <div class="mb-3 w-full">
                                                  <select
                                                    value={
                                                      course.attributes.price
                                                    }
                                                    class="text-center select select-ghost text-white  "
                                                  >
                                                    <option>
                                                      {course.attributes.price}
                                                    </option>
                                                  </select>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      <div class="flex items-center  ">
                                        <div class="w-full flex flex-col   ">
                                          <label class="font-semibold leading-none text-white">
                                            Category
                                          </label>
                                          <input
                                            name="name"
                                            value={course.attributes.category}
                                            disabled
                                            placeholder="eg. Beginners  Guide to Investing in Crypto "
                                            type="text"
                                            class="  border border-zinc-600 bg-transparent p-3 rounded-xl  mt-2  "
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    {course.attributes.image_preview && (
                                      <div>
                                        <label class="inline-block  font-semibold text-white">
                                          Course Image Preview
                                        </label>

                                        <div class="flex justify-start  mt-3 ">
                                          <div class="w-full sm:w-4/12 md:w-8/12 lg:w-8/12 xl:w-3/12 rounded-lg shadow-xl ">
                                            <div class=" ">
                                              <div class="flex items-center justify-center w-full">
                                                <label class="flex flex-col w-full h-full border-4 border-zinc-600 border-dashed rounded-2xl   hover:border-emerald-500">
                                                  <Image
                                                    src={
                                                      course.attributes
                                                        .image_preview._url
                                                    }
                                                    width={300}
                                                    height={200}
                                                    className="rounded-2xl"
                                                  />

                                                  <input
                                                    type="file"
                                                    name="image"
                                                    accept="image/*"
                                                    hidden
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </form>

                                  <div class="modal-action">
                                    <label
                                      for={"my-modal2" + index}
                                      class=" cursor-pointer p-3 px-10 rounded-2xl bg-transparent border-2 border-teal-500 hover:bg-gradient-to-r from-teal-500 to-teal-400"
                                    >
                                      Done
                                    </label>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() =>
                                  rejectCourseDescriptionUpdate(course)
                                }
                                className="text-xl cursor-pointer modal-button   bg-transparent border-2 border-red-500  rounded-2xl p-3 hover:bg-gradient-to-r from-red-500 to-rose-400 font-semibold mx-5 "
                              >
                                <label
                                  for={"my-modal2" + index}
                                  class=" cursor-pointer  modal-button"
                                >
                                  Reject
                                </label>
                              </button>

                              <button
                                onClick={() =>
                                  approveCourseDescriptionUpdate(course)
                                }
                                className="text-xl   bg-transparent border-2 border-emerald-500  rounded-2xl p-3 hover:bg-gradient-to-r from-emerald-500 to-teal-400 font-semibold mr-2.5 "
                              >
                                <label
                                  for={"my-modal2" + index}
                                  class=" cursor-pointer  modal-button"
                                >
                                  Approve
                                </label>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col my-3">
                      <div className="text-3xl font-extrabold">
                        Updated Lessons
                      </div>
                      <div>
                        {lessonsToUpdate.map((lesson, index) => (
                          <div className="w-full   my-3 border border-zinc-600 rounded-2xl p-3 ">
                            <div className="flex flex-wrap  md:flex-none  justify-between  w-full items-center">
                              <div className=" font-semibold my-3 w-full md:w-1/4    ">
                                <div className="text-xl">
                                  {lesson.attributes.originalLessonName}
                                </div>
                                <div className="text-sm text-zinc-500">
                                  Section: {lesson.attributes.originalSection}
                                </div>
                                <div className="text-sm text-zinc-500">
                                  Course: {lesson.attributes.courseName}
                                </div>
                              </div>
                              <div>
                                <button className="text-xl  bg-transparent border-2 border-teal-500 rounded-2xl p-3 hover:bg-gradient-to-r from-teal-500 to-teal-400 font-semibold  ">
                                  <label
                                    for={"my-modal3" + index}
                                    class=" cursor-pointer  modal-button"
                                  >
                                    View Updates
                                  </label>
                                </button>

                                <input
                                  type="checkbox"
                                  id={"my-modal3" + index}
                                  class="modal-toggle"
                                />
                                <div class="modal text-white">
                                  <div class="modal-box border border-zinc-600 bg-zinc-800">
                                    <label className="  flex justify-center text-3xl font-extrabold mb-5">
                                      Lesson Update
                                    </label>
                                    <form>
                                      <label className="block text-sm font-medium text-white">
                                        Title
                                      </label>

                                      <div className="  relative rounded-md shadow-sm">
                                        <input
                                          type="text"
                                          name="title"
                                          className="border border-zinc-600 bg-transparent p-3 rounded-xl  mt-2 w-full"
                                          placeholder="eg. Setup Server"
                                          value={lesson.attributes.title}
                                          disabled
                                        />
                                      </div>
                                      <label className="block text-sm font-medium my-3 text-white">
                                        Section
                                      </label>

                                      <div className="flex">
                                        <div className="flex flex-col  ">
                                          <div class="flex justify-center  ">
                                            <div class="  w-full">
                                              <select
                                                disabled
                                                value={
                                                  lesson.attributes.section
                                                }
                                                class="border border-zinc-600 bg-transparent text-center  p-3 rounded-2xl select-ghost w-full text-white truncate "
                                              >
                                                <option value={""}>
                                                  {lesson.attributes.section}
                                                </option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <label className="block text-sm my-3 font-medium text-white">
                                        Content
                                      </label>

                                      <div>
                                        <textarea
                                          value={lesson.attributes.content}
                                          disabled
                                          name="content"
                                          required
                                          placeholder="eg. Setting up a server"
                                          type="text"
                                          className=" border border-zinc-600 bg-transparent p-3 rounded-xl  w-full h-[8rem]"
                                        ></textarea>
                                      </div>
                                      <div class="flex justify-center">
                                        <div class="w-full ">
                                          <div class="flex   flex-col   w-full">
                                            <div>
                                              <div className="flex justify-between ">
                                                <label className="block text-sm font-medium text-white mt-3">
                                                  Preview
                                                </label>
                                                <div class=" card">
                                                  <div class="form-control">
                                                    <label class="label">
                                                      <span class="label-text"></span>
                                                      <input
                                                        defaultChecked={
                                                          lesson.attributes
                                                            .free_preview
                                                        }
                                                        type="checkbox"
                                                        disabled
                                                        class="toggle toggle-accent "
                                                      />
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <label className="block text-sm font-medium text-white mt-3 mb-3">
                                                Video
                                              </label>
                                              {lesson.attributes.video &&
                                                lesson.attributes.video
                                                  .Location && (
                                                  <div className=" flex justify-center">
                                                    <ReactPlayer
                                                      url={
                                                        lesson.attributes.video
                                                          .Location
                                                      }
                                                      width={"410px"}
                                                      height={"240px"}
                                                      controls
                                                      config={{
                                                        file: {
                                                          attributes: {
                                                            controlsList:
                                                              "nodownload",
                                                          },
                                                        },
                                                      }}
                                                      onContextMenu={(e) =>
                                                        e.preventDefault()
                                                      }
                                                    />
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </form>

                                    <div class="modal-action">
                                      <label
                                        for={"my-modal3" + index}
                                        class=" cursor-pointer p-3 px-10 rounded-2xl bg-transparent border-2 border-teal-500 hover:bg-gradient-to-r from-teal-500 to-teal-400"
                                      >
                                        Done
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() => rejectUpdatedLesson(lesson)}
                                  className="text-xl cursor-pointer modal-button   bg-transparent border-2 border-red-500  rounded-2xl p-3 hover:bg-gradient-to-r from-red-500 to-rose-400 font-semibold mx-5 "
                                >
                                  Reject
                                </button>

                                <button
                                  onClick={() => approveUpdatedLesson(lesson)}
                                  className="text-xl   bg-transparent border-2 border-emerald-500  rounded-2xl p-3 hover:bg-gradient-to-r from-emerald-500 to-teal-400 font-semibold mr-2.5 "
                                >
                                  Approve
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col my-3">
                      <div className="text-3xl font-extrabold">
                        Updated Quiz Questions
                      </div>
                      <div>
                        {quizQuestionsToUpdate.map((question, index) => (
                          <div className="w-full   my-3 border border-zinc-600 rounded-2xl p-3 ">
                            <div className="flex flex-wrap  md:flex-none  justify-between  w-full items-center">
                              <div className=" font-semibold my-3 w-full md:w-1/4    ">
                                <div className="text-xl">
                                  {question.attributes.originalQuizQuestion}
                                </div>
                                <div className="text-sm text-zinc-500">
                                  Section: {question.attributes.section}
                                </div>
                                <div className="text-sm text-zinc-500">
                                  Course: {question.attributes.courseName}
                                </div>
                              </div>
                              <div>
                                <button className="text-xl  bg-transparent border-2 border-teal-500 rounded-2xl p-3 hover:bg-gradient-to-r from-teal-500 to-teal-400 font-semibold  ">
                                  <label
                                    for={"my-modal4" + index}
                                    class=" cursor-pointer  modal-button"
                                  >
                                    View Updates
                                  </label>
                                </button>

                                <input
                                  type="checkbox"
                                  id={"my-modal4" + index}
                                  class="modal-toggle"
                                />
                                <div class="modal text-white">
                                  <div class="modal-box border border-zinc-600 bg-zinc-800">
                                    <label className="  flex justify-center text-3xl font-extrabold mb-5">
                                      Quiz Question Update
                                    </label>
                                    <form>
                                      <label className="block text-sm font-medium mt-3 text-white">
                                        Section
                                      </label>
                                      <div className="flex">
                                        <div className="flex flex-col  ">
                                          <div class="flex justify-center ">
                                            <div class="  w-full">
                                              <select
                                                value={
                                                  question.attributes.section
                                                }
                                                class="text-center select select-ghost w-full text-white truncate "
                                              >
                                                <option value={""}>
                                                  {question.attributes.section}
                                                </option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      {/* <label className="block text-sm font-medium mt-3 text-gray-700">
          Number of Questions
        </label>
        <div className="flex">
          <div className="flex flex-col  ">
            <div class="flex justify-center ">
              <div class="  w-full">
                <select onChange={(e)=>setNumberOfQuestions(e.target.value)} 
                  class="text-center w-full mt-2 px-2  rounded-md border border-gray-200 shadow-sm py-2 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-emerald-500">
                  <option value={0}>Select</option>
                  {[...Array(10).keys()].map((index) => (
                    <option value={index+1}>{index+1}</option>
                  ))}
                </select>
                 
              </div>
            </div>
          </div>
        </div> */}
                                      {
                                        //quiz question component that will be iteraties based on number of quiz questions
                                      }
                                      <div className=" rounded-2xl  ">
                                        <label className="block text-sm font-medium text-white">
                                          Question
                                        </label>
                                        <div>
                                          <div className="mt-1 relative rounded-md     shadow-sm">
                                            <input
                                              type="text"
                                              name="title"
                                              className="input input-ghost text-white w-full"
                                              placeholder="eg. What does P2P stand for?"
                                              value={
                                                question.attributes.question
                                              }
                                            />
                                          </div>
                                        </div>
                                        {question.attributes.options.map(
                                          (option, index) => (
                                            <div>
                                              <label className="block text-sm font-medium mt-2 text-white">
                                                {"Option" + " " + (index + 1)}
                                              </label>
                                              <div className="  relative rounded-md  mt-1  shadow-sm">
                                                <input
                                                  type="text"
                                                  name="title"
                                                  className="input input-ghost text-white w-full"
                                                  placeholder="Peer to Peer"
                                                  value={option}
                                                />
                                              </div>
                                            </div>
                                          )
                                        )}
                                        <label className="block mt-2 text-sm font-medium text-white">
                                          Answer
                                        </label>
                                        <div>
                                          <div className="mt-1 relative rounded-md   shadow-sm">
                                            <input
                                              type="text"
                                              name="title"
                                              className="input input-ghost text-white w-full"
                                              placeholder="Peer to Peer"
                                              value={question.attributes.answer}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </form>

                                    <div class="modal-action">
                                      <label
                                        for={"my-modal4" + index}
                                        class=" cursor-pointer p-3 px-10 rounded-2xl bg-transparent border-2 border-teal-500 hover:bg-gradient-to-r from-teal-500 to-teal-400"
                                      >
                                        Done
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <button
                                  onClick={() =>
                                    rejectUpdatedQuizQuestion(question)
                                  }
                                  className="text-xl cursor-pointer modal-button   bg-transparent border-2 border-red-500  rounded-2xl p-3 hover:bg-gradient-to-r from-red-500 to-rose-400 font-semibold mx-5 "
                                >
                                  Reject
                                </button>

                                <button
                                  onClick={() =>
                                    approveUpdatedQuizQuestion(question)
                                  }
                                  className="text-xl   bg-transparent border-2 border-emerald-500  rounded-2xl p-3 hover:bg-gradient-to-r from-emerald-500 to-teal-400 font-semibold mr-2.5 "
                                >
                                  Approve
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default courseupdate;
