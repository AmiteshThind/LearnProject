import { UploadIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import ReactPlayer from "react-player";
import { ToastContainer } from "react-toastify";
import QuizQuestion from "./QuizQuestion";
function AddQuizForm({ sections, questionDetails,setQuestionDetails }) {

     

 

  return (
    <div className="pr-2">
      <form>
        <label className="block text-sm font-medium mt-3 text-zinc-700 dark:text-white">
          Section
        </label> 
        <div className="flex">
          <div className="flex flex-col  ">
            <div class="flex justify-center ">
              <div class="  w-full">
                <select value={questionDetails.section} onChange={(e)=>  setQuestionDetails(prevState => ({...prevState,["section"]: e.target.value}))}  class="text-center select select-ghost w-full dark:text-white dark:bg-zinc-700 text-zinc-700 border dark:border-zinc-700  border-zinc-300 mt-2 truncate ">
                  <option value={""}>Select</option>
                  {sections.map((section, index) => (
                    <option value={section}>{section}</option>
                  ))}
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
        {//quiz question component that will be iteraties based on number of quiz questions
        }
        <div>
        <div className="mt-3">
        <QuizQuestion questionDetails={questionDetails} setQuestionDetails={setQuestionDetails}/>
        </div>
        
        {/* <Toaster 
         
        /> */}
         
        </div>
      </form>
    </div>
  );
}

export default AddQuizForm;
