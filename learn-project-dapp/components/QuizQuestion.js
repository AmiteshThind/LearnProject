import React, { useState } from "react";

function QuizQuestion({questionDetails,setQuestionDetails}) {

 
    const handleAnswerChange = (e)=>{
       
      setQuestionDetails(prevState => ({
          ...prevState,
          ["answer"]: e.target.value
      }));
    }

    const handleQuestionTextChange= (e)=>{
      setQuestionDetails(prevState => ({
        ...prevState,
        ["question"]: e.target.value
    }));
  
  }
    
  const handleOptionChange= (e,index)=>{

  let optionsNew = [...questionDetails.options]
  console.log(index)
  optionsNew[index]= e.target.value;
  console.log(e.target.value)
      setQuestionDetails(prevState => ({
      ...prevState,
      ["options"]: optionsNew
  }));

  console.log(optionsNew)

}


  return(
  <div className=" rounded-2xl  ">
    <label className="block text-sm font-medium text-gray-700">Question</label>
    <div>
    <div className="mt-1 relative rounded-md border    shadow-sm">
        <input
        onChange = {handleQuestionTextChange}
          type="text"
          name="title"
          className="focus:ring-emerald-500      focus:border-emerald-500 block w-full text-sm py-2  border  focus:outline-none   border-gray-200   px-2    rounded-md"
          placeholder="eg. What does P2P stand for?"
          value={questionDetails.question}
         />
      </div>
    </div>
    <div>
    <label className="block text-sm font-medium mt-2 text-gray-700">Option 1</label>
    <div className="  relative rounded-md border mt-1  shadow-sm">
        <input
        onChange = {(e)=> handleOptionChange(e,0)}
          type="text"
          name="title"
          className="focus:ring-emerald-500      focus:border-emerald-500 block w-full text-sm py-2  border  focus:outline-none   border-gray-200   px-2    rounded-md"
          placeholder="Peer to Peer"
          value={questionDetails.options[0]}
         />
      </div>
    </div>
    <label className="block text-sm mt-2 font-medium text-gray-700">Option 2</label>
    <div>
    <div className="mt-1 relative rounded-md border  shadow-sm">
        <input
        onChange = {(e)=>handleOptionChange(e,1)}
          type="text"
          name="title"
          className="focus:ring-emerald-500      focus:border-emerald-500 block w-full text-sm py-2  border  focus:outline-none   border-gray-200   px-2    rounded-md"
          placeholder="Product to Product"
          value={questionDetails.options[1]}
         />
      </div>
    </div>
    <label className="block mt-2 text-sm font-medium text-gray-700">Option 3</label>
    <div>
    <div className="mt-1 relative rounded-md border   shadow-sm">
        <input
        onChange = {(e)=>handleOptionChange(e,2)}
          type="text"
          name="title"
          className="focus:ring-emerald-500      focus:border-emerald-500 block w-full text-sm py-2  border  focus:outline-none   border-gray-200   px-2    rounded-md"
          placeholder="Processing to Pay "
          value={questionDetails.options[2]}
         />
      </div>
    </div>
    <label className="block mt-2 text-sm font-medium text-gray-700">Option 4</label>
    <div>
      <div className="mt-1 relative rounded-md border  shadow-sm">
        <input
        onChange = {(e)=>handleOptionChange(e,3)}
        
          type="text"
          name="title"
          className="focus:ring-emerald-500      focus:border-emerald-500 block w-full text-sm py-2  border  focus:outline-none   border-gray-200   px-2    rounded-md"
          placeholder="Password to Password"
          value={questionDetails.options[3]}
         />
      </div>
    </div>
    <label className="block mt-2 text-sm font-medium text-gray-700">Answer</label>
    <div>
      <div className="mt-1 relative rounded-md border  shadow-sm">
        <input
        onChange = {handleAnswerChange}
        
          type="text"
          name="title"
          className="focus:ring-emerald-500      focus:border-emerald-500 block w-full text-sm py-2  border focus:outline-none       px-2    rounded-md"
          placeholder="Peer to Peer"
          value={questionDetails.answer}
         />
      </div>
      
    </div>
   
  </div>
  );
}

export default QuizQuestion;
