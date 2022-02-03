import Image from 'next/image'
import {useState,useEffect} from 'react'
 


function CourseCreateForm({handleSubmit,handleImage,handleChange,values, setValues, preview}) {


    //for price of course
    const children = []
    for (let i = 5; i<=50;i+=1){
        children.push(<option key={i}>{i}</option>)
    }

    return (
        <form onSubmit={handleSubmit} className='m-5'>
        <div class="flex items-center  ">
            <div class="w-full flex flex-col   ">
                <label class="font-semibold leading-none ">Course Name</label>
                <input name='name' value={values.name} onChange={handleChange} required placeholder="eg. Beginners  Guide to Investing in Crypto " type="text" class="leading-none text-gray-900 p-3 focus:outline-none focus:border-emerald-500 mt-4 bg-gray-50 border rounded border-gray-200" />
            </div>
        </div>

        <div>
            <div className="w-full flex flex-col mt-5  ">
                <label class="font-semibold leading-none">Description</label>
                <textarea name='description' value={values.description} onChange={handleChange} required placeholder="Give a breif overfiew of what students can expect to learn from this course" type="text" className="h-40 w-prose text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-emerald-500 mt-4 bg-gray-50 border rounded border-gray-200"></textarea>
            </div>
        </div>
        <div className="mt-5 mb-4 w-full flex-col  flex-stretch justify-start">
            <div className="flex  ">
                <div className="flex">
                    <div className="flex flex-col mr-5 ">
                        <label className=" font-semibold leading-none mb-3 ">Paid</label>
                        <div class="flex justify-center ">
                            <div class="mb-3 w-full">
                                <select   onChange={v => setValues({...values,paid:!values.paid})} class=" appearance-none inline-flex justify-center w-full mt-2 mb-3  rounded-md border border-gray-300 shadow-sm px-8 py-2 bg-white text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-emerald-500">
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {values.paid && <div className="flex">
                    <div className="flex flex-col mr-5 ">
                        <label className=" font-semibold leading-none mb-3 ">Price (BUSD)</label>
                        <div class="flex justify-center text ">
                            <div class="mb-3 w-full">
                                <select  defaultValue={5} onChange={v => setValues({...values,price: Number(v.target.value)})} value ={values.price} class="text-center appearance-none inline-flex justify-center w-full mt-2 mb-3  rounded-md border border-gray-300 shadow-sm px-8 py-2 bg-white text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-emerald-500">
                                    {children}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>

            <div className="flex">
                <div className="flex flex-col mr-5 ">
                    <label className=" font-semibold leading-none mb-3 ">Category</label>
                    <div class="flex justify-center ">
                        <div class="mb-3 w-full">
                            <select  onChange={v => setValues({...values,category:v.target.value})} value={values.category} class="appearance-none text-center inline-flex justify-center w-full mt-2 mb-3  rounded-md border border-gray-300 shadow-sm px-8 py-2 bg-white text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-emerald-500">
                                 <option defaultValue={"blockchain"}>Blockchain</option>
                                <option value={"education"}>Education</option>
                                <option value={"defi"}>Defi</option>
                                <option value={"finance"}>Finance</option>
                                <option value={"development"}>Development</option>
                                <option value={"other"}>Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>


        </div>
        <label class="inline-block  font-semibold">Course Image Preview</label>
        <div class="flex justify-start  mt-3 px-3">

            <div class="w-3/12 rounded-lg shadow-xl bg-gray-50 ">
                <div class="m-2">

                    <div class="flex items-center justify-center w-full">
                        <label
                            class="flex flex-col w-full h-full border-4 border-gray-300 border-dashed hover:bg-gray-100 hover:border-emerald-500">
                           {!preview && <div class="flex flex-col items-center justify-center pt-7">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                    Attach a file</p>
                            </div>}
                            {preview &&
                            <Image src={preview} width={300} height={200}/>}
                            <input type="file" name="image" onChange={handleImage} accept="image/*" hidden />
                        </label>
                    </div>
                </div>
               
            </div>
        </div>
        <div class="flex items-center justify-center w-full">
            <button loading={values.loading} onClick={handleSubmit} disabled={values.loading || values.uploading} class=" mt-12 font-semibold leading-none text-emerald-500 py-4 px-10 border border-2 border-emerald-500 hover:text-white rounded hover:bg-emerald-500 focus:ring-2 focus:ring-offset-2  focus:outline-none">
                {values.loading ? "Saving...": "Create & Continue"}
            </button>
        </div>
          
    </form>

    )
}

export default CourseCreateForm
