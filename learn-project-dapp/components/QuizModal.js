/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import AddLessonForm from "./AddLessonForm";
import UpdateLessonForm from "./UpdateLessonForm";
import AddQuizForm from "./AddQuizForm";
import toast, { Toaster } from "react-hot-toast";
import Moralis from "moralis";
export default function QuizModal({
  course,
  quizVisible,
  setQuizVisible,
  setValues,
  values,
  quizEditing,
  uploading,
  sections,
  setAvailableQuizSections,
  availableQuizSections,
  questionDetails,
  setQuestionDetails,
  setQuizEditing,
  handleUpdateQuizQuestion,
  quizQuestions,
  setQuizQuestions,
}) {
  useEffect(() => {
    //load all questions for this course
  });

  const resetForm = (e) => {
    setQuestionDetails({
      question: "",
      answer: "",
      options: Array(4).fill(""),
      section: "",
    });

    setQuizVisible(false);
    setQuizVisible(false);
    if (quizEditing) {
      setQuizEditing(false);
    }
  };

  //create an array of size numberofquestions which gets updated every time number os updated

  const DoneAddingQuizQuestions = () => {
    setQuestionDetails({
      question: "",
      answer: "",
      options: Array(4).fill(""),
      section: "",
    });

    setQuizVisible(false);
  };

  const handleAddQuestion = async (e) => {
    //console.log(questionDetails)

    const options = questionDetails.options.map((element) => {
      return element.trim();
    });
    setQuestionDetails({
      question: "",
      answer: "",
      options: Array(4).fill(""),
      section: "",
    });
    console.log(questionDetails);
    const validOptions = options.filter((option) => option != "");

    if (
      validOptions.length >= 2 &&
      questionDetails.question.trim() != "" &&
      questionDetails.answer.trim() != "" &&
      questionDetails.section.trim() != ""
    ) {
      //add to database c
      console.log(questionDetails.answer.trim());
      console.log(validOptions);
      if (validOptions.includes(questionDetails.answer.trim())) {
        console.log("mej");
        const QuizQuestion = Moralis.Object.extend("QuizQuestion");
        const newQuizQuestion = new QuizQuestion();
        newQuizQuestion.set("course", course[0]);
        newQuizQuestion.set("question", questionDetails.question);
        newQuizQuestion.set("answer", questionDetails.answer);
        newQuizQuestion.set("options", validOptions);
        newQuizQuestion.set("section", questionDetails.section);
        const addedQuestion = await newQuizQuestion.save();
        if (!availableQuizSections.includes(questionDetails.section)) {
          setAvailableQuizSections((oldArray) => [
            ...oldArray,
            questionDetails.section,
          ]);
        }
        setQuestionDetails({
          question: "",
          answer: "",
          options: Array(4).fill(""),
          section: "",
        });
        toast.success("Question Added!", { duration: 2000 });
        setQuizQuestions((oldArray) => [...oldArray, addedQuestion]);
      }
    }
  };


 

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={quizVisible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setQuizVisible}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start ">
                  <div className="mt-3 divide-y w-full text-center item sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl leading-6 font-medium text-emerald-500"
                    >
                      Quiz
                    </Dialog.Title>

                    <div className="mt-2">
                      <div className="mt-3">
                        <AddQuizForm
                          sections={sections}
                          questionDetails={questionDetails}
                          setQuestionDetails={setQuestionDetails}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="  px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full btn hover:border-gray-300 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={resetForm}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="w-full btn inline-flex hover:border-0 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-500 text-base font-medium text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={
                    !quizEditing ? handleAddQuestion : handleUpdateQuizQuestion
                  }
                  disabled={uploading}
                >
                  {!quizEditing && <>Add</>}
                  {quizEditing && <>Update</>}
                </button>

                <button
                  type="button"
                  className="w-full btn hover:border-0 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-500 text-base font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={uploading}
                  onClick={DoneAddingQuizQuestions}
                >
                  Done
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
