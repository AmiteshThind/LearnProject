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
  XIcon,
  XCircleIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import Tooltip from "../../../../components/Tooltip";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import Modal from "../../../../components/Modal";
import toast, { Toaster } from "react-hot-toast";
import Router from "next/router";
import axios from "axios";
import Accordion from "../../../../components/Accordion";
import {
  DocumentTextIcon,
  ExclamationIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import QuizModal from "../../../../components/QuizModal";
import QuizAccordion from "../../../../components/QuizAccordion";
import { route } from "next/dist/server/router";
import AuthErrorMsg from "../../../../components/AuthErrorMsg";

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
  const [selectedLesson, setSelectedLesson] = useState();
  const [selectedQuizQuestion, setSelectedQuizQuestion] = useState();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showCancelLessonModal, setShowCancelLessonModal] = useState(false);
  const [showDeleteQuizQuestionModal, setShowDeleteQuizQuestionModal] =
    useState(false);
  //for lessons
  const [lessonUpdatedSubmitted, setLessonUpdatedSubmitted] = useState(false);
  const [isValidInstructor, setIsValidInstructor] = useState(false);

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
  const [originalQuizQuestionDetails, setOriginalQuizQuestionDetails] =
    useState();

  useEffect(() => {
    //load course from moralis based on slug
    //console.log(course)
    if (isAuthenticated && user) {
      if (user.attributes.role == "student") {
        router.push("/marketplace");
      }
      loadCourseandLessons();
      loadQuizQuestions();
    }

    //console.log(course)
  }, [isLoading, isAuthenticated, user]);

  const loadCourseandLessons = async () => {
    const Course = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Course);
    query.equalTo("slug", slug);
    const result = await query.find();
    //console.log(user.id);

    //check to see if instructor is the one who should access the course
    let isValidInstructor;

    if (result[0] != undefined) {
      console.log(user.id);
      console.log(result[0].attributes.instructor.id);
      if (
        result[0].attributes.instructor.id != user.id &&
        (user.attributes.role != "admin" ||
          user.attributes.role != "instructor")
      ) {
        router.push("/marketplace");

        isValidInstructor = false;
      } else {
        isValidInstructor = true;
      }
    }
    setIsValidInstructor(isValidInstructor);

    console.log(isAuthenticated);

    if (result[0] && isValidInstructor) {
      setCourse(result);
      setSections(result[0].attributes.sections);
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
    setIsLoading(false);

    checkIfLessonOrQuizUpdateSubmitted();
  };

  const checkIfLessonOrQuizUpdateSubmitted = async () => {
    const UpdatedLesson = Moralis.Object.extend("UpdatedLesson");
    const queryUpdatedLesson = new Moralis.Query(UpdatedLesson);
    queryUpdatedLesson.equalTo("state", "pending");
    const result = await queryUpdatedLesson.find();
    if (result[0] != undefined) {
      setLessonUpdatedSubmitted(true);
    }
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

    setAvailableQuizSections(arr);
  };

  //functions for add Lessons

  const handleEditLesson = async (lesson) => {
    setSelectedLesson(lesson);
    setVisible(true);
    setEditing(true);
    setValues(lesson.attributes);
    setOrginalLessonValues(lesson.attributes);

    // console.log(lesson);
  };

  const handleEditQuizQuestion = async (question) => {
    setSelectedQuizQuestion(question);
    setQuizVisible(true);
    setQuizEditing(true);
    setQuestionDetails(question.attributes);
    setOriginalQuizQuestionDetails(question.attributes);
  };

  const handleAddLesson = async (e) => {
    //add lesson to course array
    e.preventDefault();
    console.log(lessons.length);
    try {
      if (
        values.title != "" &&
        values.content != "" &&
        values.video.Location &&
        values.section != ""
      ) {
        console.log(values);
        //create Lesson in Lessons Class in Moralis while referecing course to which this Lesson belongs to
        const Lesson = Moralis.Object.extend("Lesson");
        console.log(values.video);
        const query = new Moralis.Query(Lesson);
        query.equalTo("course", course[0]);
        const lessons = await query.find();

        // add this lesson object to the lessons array under the course to which it belongs
        // console.log(lessons);
        // console.log(lessons.length);
        course[0].set("lessonCount", lessons.length + 1);

        // let acl = new Moralis.ACL();
        // acl.setPublicReadAccess(true);
        // acl.setWriteAccess(Moralis.User.current().id, true);
        // course[0].set("ACL",acl);

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
        let acl = new Moralis.ACL();
        acl.setPublicReadAccess(true);
        acl.setWriteAccess(Moralis.User.current().id, true);
        newLesson.setACL(acl);
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
        toast.success("Lesson Added", {
          duration: 2000,
          iconTheme: {
            primary: "#10b981",
          },
        });
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
        toast.error("Please Input All Fields", { duration: 2000 });
        // console.log("here i am");
      }
    } catch {}
    // console.log(values);
    // creates a lesson in the database which includes the video hash and url, title, course object id, , content
  };

  const handleUpdateLesson = async (e) => {
    try {
      if (values.video.Location == undefined) {
        toast.error("video cannot be blank.Please upload a video.");
      } else {
        const Lesson = Moralis.Object.extend("UpdatedLesson");
        const query = new Moralis.Query(Lesson);
        query.equalTo("lessonToUpdate", selectedLesson.id);
        query.equalTo("state", "pending");
        const result = await query.find();
        if (result[0]) {
          await result[0].destroy();
        }
        const updatedLesson = new Lesson();
        let acl = new Moralis.ACL();
        acl.setReadAccess(Moralis.User.current().id, true);
        acl.setRoleReadAccess("admin", true);
        acl.setWriteAccess(Moralis.User.current().id, true);
        updatedLesson.setACL(acl);
        updatedLesson.set("title", values.title);
        updatedLesson.set("content", values.content);
        updatedLesson.set("video", values.video);
        updatedLesson.set("section", values.section);
        updatedLesson.set("free_preview", values.free_preview);
        updatedLesson.set("state", "pending");
        updatedLesson.set("lessonToUpdate", selectedLesson.id);
        updatedLesson.set("courseName", course[0].attributes.name);
        updatedLesson.set(
          "originalLessonName",
          selectedLesson.attributes.title
        );
        updatedLesson.set("originalSection", selectedLesson.attributes.section);
        await updatedLesson.save();

        toast.success("Lesson Update Submitted", {
          duration: 2000,
          iconTheme: {
            primary: "#10b981",
          },
        });

        setLessonUpdatedSubmitted(true);

        setVisible(false);
        setUploadBtnText("Upload Video");
        setValues({
          ...values,
          title: "",
          content: "",
          section: "",
          video: {},
          free_preview: false,
        });

        // const Lesson = Moralis.Object.extend("Lesson");
        // const query = new Moralis.Query(Lesson);
        // query.equalTo("course", course[0]);
        // query.equalTo("title", orginalLessonValues.title);
        // const lessonToUpdate = await query.first();
        // //   console.log(lessonToUpdate);
        // lessonToUpdate.set("title", values.title);
        // lessonToUpdate.set("content", values.content);
        // lessonToUpdate.set("video", values.video);
        // lessonToUpdate.set("section", values.section);
        // lessonToUpdate.set("free_preview", values.free_preview);
        // await lessonToUpdate.save();
        // toast.success("Lesson Updated", {
        //   duration: 2000,
        //   iconTheme: {
        //     primary: "#10b981",
        //   },
        // });
        // setVisible(false);
        // setUploadBtnText("Upload Video");
        // setValues({
        //   ...values,
        //   title: "",
        //   content: "",
        //   section: "",
        //   video: {},
        //   free_preview: false,
        // });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleUpdateQuizQuestion = async (e) => {
    try {
      const QuizQuestionToUpdate = Moralis.Object.extend("UpdatedQuizQuestion");
      //first check if this quiz question is already being updated, if it is then destroy it and resubmit

      const query = new Moralis.Query(QuizQuestionToUpdate);
      query.equalTo("quizQuestionToUpdate", selectedQuizQuestion.id);
      query.equalTo("state", "pending");
      const result = await query.find();
      if (result[0]) {
        await result[0].destroy();
      }
      console.log("wo");

      const quizQuestionToUpdate = new QuizQuestionToUpdate();
      let acl = new Moralis.ACL();
      acl.setReadAccess(Moralis.User.current().id, true);
      acl.setRoleReadAccess("admin", true);
      acl.setWriteAccess(Moralis.User.current().id, true);
      quizQuestionToUpdate.set(acl);
      quizQuestionToUpdate.set("question", questionDetails.question.trim());
      quizQuestionToUpdate.set("answer", questionDetails.answer.trim());
      quizQuestionToUpdate.set(
        "options",
        questionDetails.options.filter((option) => option != "")
      );
      quizQuestionToUpdate.set("section", questionDetails.section.trim());
      quizQuestionToUpdate.set("quizQuestionToUpdate", selectedQuizQuestion.id);
      quizQuestionToUpdate.set("state", "pending");
      quizQuestionToUpdate.set(
        "originalQuizQuestion",
        selectedQuizQuestion.attributes.question
      );
      quizQuestionToUpdate.set("courseName", course[0].attributes.name);
      await quizQuestionToUpdate.save();
      setOriginalQuizQuestionDetails(questionDetails);
      toast.success("Quiz Question Update Submitted", {
        duration: 2000,
        iconTheme: {
          primary: "#10b981",
        },
      });
    } catch (error) {}
  };

  const handleDeleteLesson = async (lessonRemove) => {
    //check if users are enrolled in course. if so cant delete only update
    const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
    const query = new Moralis.Query(EnrolledUserCourses);
    console.log(course[0]);
    query.equalTo("course", course[0]);
    const result = await query.find();

    if (result.length > 0) {
      toast.error(
        "Cannot delete. Users are enrolled in this course. You can only update."
      );
    } else {
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
        setShowCancelLessonModal(false);
        toast.success("Lesson Deleted", {
          duration: 2000,
          iconTheme: {
            primary: "#10b981",
          },
        });
      }
    }
  };

  const handleDeleteQuizQuestion = async (quizQuestionToRemove) => {
    try {
      const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
      const query = new Moralis.Query(EnrolledUserCourses);
      console.log(course[0]);
      query.equalTo("course", course[0]);
      const result = await query.find();
      if (result.length > 0) {
        toast.error(
          "Cannot delete. Users are enrolled in this course. You can only update."
        );
      } else {
        const QuizQuestion = Moralis.Object.extend("QuizQuestion");
        const query = new Moralis.Query(QuizQuestion);
        console.log(quizQuestionToRemove);
        query.equalTo("objectId", quizQuestionToRemove.id);
        const questionToDelete = await query.first();
        await questionToDelete.destroy();
        setQuizQuestions(
          quizQuestions.filter(
            (question) => question.id != quizQuestionToRemove.id
          )
        );
        setShowDeleteQuizQuestionModal(false);
        toast.success("Question Deleted", {
          duration: 2000,
          iconTheme: {
            primary: "#10b981",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const publishCourse = async () => {
    try {
      console.log(lessons.length);
      if (lessons.length < 5) {
        toast.error("Need 5 Lessons to publish a course");
      } else {
        //code here for updating the database with the published status for this course
        course[0].set("published", true);
        course[0].set("state", "pendingApproval");
        await course[0].save();
        setShowPublishModal(false);
        toast.success("Course Submitted.Pending Approval", { duration: 2000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unPublishCourse = async () => {
    //need to check if any users are enrolled in this course. If users are enrolled then cannot unpublish as they wont be able to access, you can only update
    const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
    const query = new Moralis.Query(EnrolledUserCourses);
    console.log(course[0]);
    query.equalTo("course", course[0]);
    const result = await query.find();
    console.log(result);
    console.log(result.length);
    if (result.length > 0) {
      toast.error(
        "Can't Unpublish. Users are enrolled in this course. You can only update.",
        { duration: 2000 }
      );
    } else {
      course[0].set("published", false);
      course[0].set("state", "draft");
      await course[0].save();
      setShowPublishModal(false);
      toast.success("UnPublished Course", { duration: 2000 });
    }
  };

  return (
    <div className=" bg-fixed min-h-screen dark:bg-gradient-to-b dark:from-zinc-800    dark:via-emerald-700  dark:to-teal-500 bg-gradient-to-tr from-rose-200    via-teal-100  to-violet-200 text-zinc-700 dark:text-white ">
      <InstructorNavbar />
      {!isLoading ? (
        <div>
          {isAuthenticated && isValidInstructor ? (
            <div>
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
                <div className="flex  flex-wrap justify-center">
                  <div className="flex  sm:p-5 md:p-10 p-5 lg:p-15 xl:p-15 pt-10 sm:mx-10 bg-white dark:bg-zinc-800 sm:mb-5  h-full sm:w-full md:w-6/12 shadow-teal-800 rounded-3xl lg:w-6/12 xl:6/12       items-start flex-col      flex-stretch   ">
                    {course[0].attributes.feedback && (
                      <div className="text-red-400 mb-2 w-full border border-rose-400 rounded-2xl p-2">
                        <span className="font-extrabold">Note:</span>
                        {course[0].attributes.feedback}
                      </div>
                    )}
                    <div className="flex flex-wrap  w-full justify-between ">
                      <div className=" px-1 w-3/4  flex-wrap text-5xl   font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-400 ">
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
                        <div
                          data-tip={
                            course[0].attributes.state == "draft"
                              ? "publish"
                              : course[0].attributes.state == "published"
                              ? "unpublish"
                              : "Pending Approval"
                          }
                          class="tooltip"
                        >
                          {course[0].attributes.state == "draft" ? (
                            <CheckIcon
                              onClick={() => setShowPublishModal(true)}
                              className="h-9 w-9 cursor-pointer  text-emerald-400  hover:text-emerald-500"
                            />
                          ) : course[0].attributes.state == "published" ? (
                            <XCircleIcon
                              onClick={() => setShowPublishModal(true)}
                              className="h-9 w-9 cursor-pointer  text-emerald-400  hover:text-emerald-500"
                            />
                          ) : (
                            <ExclamationIcon className="h-9 w-9 cursor-pointer  text-yellow-400  hover:text-yellow-500" />
                          )}
                        </div>

                        <div
                          class={
                            showPublishModal ? "modal modal-open" : "modal"
                          }
                        >
                          <div class="modal-box">
                            {course[0].attributes.state == "draft" ? (
                              <p>
                                Once published users will be able to enroll in
                                this course. Are you sure you want to publish
                                this course?
                              </p>
                            ) : course[0].attributes.state == "published" ? (
                              <p>
                                By unpublishing this courses users will no
                                longer be able to enroll in this course. Are you
                                sure you want to unpublish this course?
                              </p>
                            ) : (
                              <p>
                                Course is waiting for approval. Please check
                                back in few hours.
                              </p>
                            )}
                            <div class="modal-action">
                              <label
                                onClick={
                                  course[0].attributes.state == "draft"
                                    ? publishCourse
                                    : course[0].attributes.state == "published"
                                    ? unPublishCourse
                                    : () => toast("Waiting for approval")
                                }
                                for="my-modal-2"
                                class="btn border-0 bg-emerald-500 hover:bg-emerald-600"
                              >
                                {course[0].attributes.state == "draft" ? (
                                  <>Publish</>
                                ) : course[0].attributes.state ==
                                  "published" ? (
                                  <>UnPublish</>
                                ) : (
                                  "Waiting For Approval"
                                )}
                              </label>
                              <label
                                onClick={() => setShowPublishModal(false)}
                                for="my-modal-2"
                                class="btn dark:bg-white  bg-zinc-700 border-gray-300 text-black hover:bg-gray-100 hover:border-gray-300"
                              >
                                Cancel
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
 
                    <div className="text-sm  mt-2 text-zinc-700 dark:text-white">
                      <span className="px-2 inline-flex text-md leading-5 font-semibold rounded-full border-2 badge bg-gradient-to-l from-teal-500    to-emerald-500  border-none py-3">
                        {course[0].attributes.category}
                      </span>
                    </div>
                    <div className="text-md mt-2 px-1 text-lg text-zinc-700 dark:text-white ">
                      {course[0].attributes.lessonCount} Lessons
                    </div>

                    <div className="flex-shrink-0 mr-5  ">
                      <div className="my-5">
                    <label className=" font-extrabold text-4xl mt-8 text-transparent bg-clip-text bg-gradient-to-br pb-2 from-teal-500 to-emerald-500">
                        Image Preview
                      </label>
                      </div>
                      <Image
                        src={course[0].attributes.image_preview._url}
                        className="rounded-lg"
                        width="400rem"
                        height="200rem"
                      />
                    </div>
                    <div className="mt-3 w-full relative flex flex-col flex-wrap">
                      <label className=" font-extrabold text-4xl my-4 text-transparent bg-clip-text bg-gradient-to-br pb-2 from-teal-500 to-emerald-500">
                        Course Description
                      </label>
                      <div className="prose-lg text-lg flex    ">
                        <ReactMarkdown
                          className="w-12/12 flex-grow text-zinc-700 dark:text-white "
                          remarkPlugins={[remarkGfm]}
                          children={course[0].attributes.description}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex h-full bg-white dark:bg-zinc-800 sm:mx-10 shadow-teal-800 rounded-3xl border-none pt-5 pb-10 w-full lg:w-4/12 md:w-3/12 sm:w-full flex-col mt-5 sm:mt-0    mb-10    ">
                    <Toaster />
                    {lessonUpdatedSubmitted && (
                      <div className="border border-yellow-400 rounded-2xl py-2 text-sm px-3  mb-3 text-yellow-400 mx-5 ">
                        Note: Updates have been submitted and are currently
                        being review.
                      </div>
                    )}
                    <div className="   flex flex-wrap text-4xl justify-center  font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-400 ">
                      <h1>Manage Lessons</h1>
                    </div>
                    <div className="flex items-center justify-center mt-10">
                      <button
                        onClick={() => {
                          setVisible(true);
                        }}
                        class="   text-white font-bold  border-b-4 hover:border-b-2 hover:border-t-1 border-emerald-600   bg-gradient-to-b from-teal-500    to-emerald-500  shadow-sm shadow-emerald-500/50 rounded-2xl justify-center text-md   w-full px-3  ml-10 mr-5 py-3 flex"
                      >
                        <PlusCircleIcon className="h-6 w-6 mx-1 " /> Add Lesson
                      </button>
                      <button
                        onClick={() => {
                          setQuizVisible(true);
                        }}
                        class="   text-white font-bold  border-b-4 hover:border-b-2 hover:border-t-1 border-emerald-600   bg-gradient-to-b from-teal-500    to-emerald-500  shadow-sm shadow-emerald-500/50 rounded-2xl justify-center text-md mr-10  w-full px-3 py-3 flex"
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
                          onDrop={(e) =>
                            handleSectionDrop(e, sectionIndex, "section")
                          }
                          key={sectionIndex}
                        >
                          <Accordion
                            title={section}
                            key={sectionIndex}
                            number={sectionIndex + 1}
                          >
                            <ul
                              onDragOver={(e) => e.preventDefault()}
                              class=" rounded-xl  mx-10 text-zinc-700 dark:text-white text-sm  font-medium"
                            >
                              {lessons
                                .filter(
                                  (lesson) =>
                                    lesson.attributes.section == section
                                )
                                .map((lesson, lessonIndex) => (
                                  <li
                                    key={sections.length + lessonIndex}
                                    class="px-4 py-5  w-full justify-between flex "
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
                                    <div className="flex">
                                      <span className="rounded-full h-[1.5rem] flex justify-center items-center flex-col bg-gradient-to-br from-emerald-500 px-2.5 to-teal-400">
                                        {lessonIndex + 1}
                                      </span>
                                      <span className=" px-3 py-1">
                                        {lesson.attributes.title}
                                      </span>
                                    </div>
                                    <span className=" px-3 py-1 flex">
                                      <PencilIcon
                                        onClick={() => handleEditLesson(lesson)}
                                        className="h-5 w-5  mr-2  text-yellow-200 cursor-pointer"
                                      />
                                      <TrashIcon
                                        onClick={() =>
                                          setShowCancelLessonModal(true)
                                        }
                                        className="h-5 w-5    text-red-400 cursor-pointer"
                                      />
                                      <div
                                        class={
                                          showCancelLessonModal
                                            ? "modal modal-open"
                                            : "modal"
                                        }
                                      >
                                        <div class="modal-box text-black">
                                          <p>
                                            Are you sure you want delete this
                                            lesson?
                                          </p>
                                          <div class="modal-action">
                                            <label
                                              onClick={() =>
                                                handleDeleteLesson(lesson)
                                              }
                                              for="my-modal-2"
                                              class="btn border-0 bg-red-500 hover:bg-red-600"
                                            >
                                              <p>Yes</p>
                                            </label>
                                            <label
                                              onClick={() =>
                                                setShowCancelLessonModal(false)
                                              }
                                              for="my-modal-2"
                                              class="btn bg-white border-gray-300 text-black hover:bg-gray-100 hover:border-gray-300"
                                            >
                                              No
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </span>
                                  </li>
                                ))}
                              <div>
                                {availableQuizSections.includes(section) && (
                                  <QuizAccordion section={section}>
                                    <ul className="m-3">
                                      {quizQuestions
                                        .filter(
                                          (question) =>
                                            question.attributes.section ==
                                            section
                                        )
                                        .map((question, questionIndex) => (
                                          <li
                                            key={questionIndex}
                                            class="px-4 py-5  w-full justify-between flex "
                                          >
                                            <div className="flex ">
                                              <span className="rounded-full h-[1.5rem] flex justify-center items-center flex-col bg-gradient-to-br from-emerald-500   to-teal-400 px-2.5 ">
                                                {questionIndex + 1}
                                              </span>
                                              <span className=" px-3   ">
                                                {question.attributes.question}
                                              </span>
                                            </div>
                                            <span className=" px-3 py-1 flex">
                                              <PencilIcon
                                                onClick={() =>
                                                  handleEditQuizQuestion(
                                                    question
                                                  )
                                                }
                                                className="h-5 w-5  mr-2  text-yellow-200 cursor-pointer"
                                              />
                                              <TrashIcon
                                                onClick={() =>
                                                  setShowDeleteQuizQuestionModal(
                                                    true
                                                  )
                                                }
                                                className="h-5 w-5   cursor-pointer text-red-400"
                                              />
                                              <div
                                                class={
                                                  showDeleteQuizQuestionModal
                                                    ? "modal modal-open"
                                                    : "modal"
                                                }
                                              >
                                                <div class="modal-box text-black">
                                                  <p>
                                                    Are you sure you want delete
                                                    this question?
                                                  </p>
                                                  <div class="modal-action">
                                                    <label
                                                      onClick={() =>
                                                        handleDeleteQuizQuestion(
                                                          question
                                                        )
                                                      }
                                                      for="my-modal-2"
                                                      class="btn border-0 bg-red-500 hover:bg-red-600"
                                                    >
                                                      <p>Yes</p>
                                                    </label>
                                                    <label
                                                      onClick={() =>
                                                        setShowDeleteQuizQuestionModal(
                                                          false
                                                        )
                                                      }
                                                      for="my-modal-2"
                                                      class="btn bg-white border-gray-300 text-black hover:bg-gray-100 hover:border-gray-300"
                                                    >
                                                      No
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
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
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="w-full justify-center items-center h-[25rem]   flex">
          <svg
            role="status"
            class="mr-2 w-30 h-36 text-white animate-spin   fill-emerald-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default CourseView;
