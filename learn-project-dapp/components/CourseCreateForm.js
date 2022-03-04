import Image from 'next/image'
import { useState, useEffect } from 'react'

function CourseCreateForm({ handleSubmit, handleImage, handleChange, values, setValues, preview, handleSections, editing }) {


    //for price of course
    const children = []
    for (let i = 5; i <= 50; i += 1) {
        children.push(<option key={i}>{i}</option>)
    }

    return (
        <form onSubmit={handleSubmit} className='m-5'>
            <div className='flex justify-center mb-5 text-4xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-400 font-extrabold'>Create Course</div>
            <div class="flex items-center  ">
                <div class="w-full flex flex-col   ">
                    <label class="font-semibold leading-none text-white">Course Name</label>
                    <input name='name' value={values.name} onChange={handleChange} required placeholder="eg. Beginners  Guide to Investing in Crypto " type="text" class="  input input-ghost text-white  mt-3  " />
                </div>
            </div>

            <div>
                <div className="w-full flex flex-col mt-5  ">
                    <label class="font-semibold leading-none text-white">Description</label>
                    <textarea name='description' value={values.description} onChange={handleChange} required placeholder="Give a breif overfiew of what students can expect to learn from this course" type="text" className="h-40 w-prose input input-ghost text-white  mt-3  "></textarea>
                </div>
            </div>

            <div class="flex items-center mt-5  ">
                <div class="w-full flex flex-col   ">
                    <label class="font-semibold leading-none text-white ">Sections <span className='text-gray-400'>(Seperate by comma and include all sections in order)</span></label>
                    <input name='sections' value={values.sections} onChange={handleSections} required placeholder="eg. Setup, Config, Defi ... " type="text" class="input input-ghost text-white  mt-3 " />
                </div>
            </div>

            <div className="mt-5 mb-4 w-full flex-col  flex-stretch justify-start">
                <div className="flex  ">
                    <div className="flex">
                        <div className="flex flex-col  sm:mr-5 md:mr-5 lg:mr-5 xl:mr-5 ">
                            <label className=" font-semibold leading-none mb-3 text-white ">Paid</label>
                            <div class="flex justify-center ">
                                <div class="mb-3 w-full">
                                    {values.paid &&
                                        <select onChange={v => setValues({ ...values, paid: !values.paid })} class=" select select-ghost text-white text-center ">


                                            <option selected value={true}>Yes</option>
                                            <option value={false}>No</option>

                                        </select>
                                    }
                                    {!values.paid &&
                                        <select onChange={v => setValues({ ...values, paid: !values.paid })} class=" select select-ghost text-white text-center ">


                                            <option value={true}>Yes</option>
                                            <option selected value={false}>No</option>

                                        </select>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {values.paid && <div className="flex">
                        <div className="flex flex-col mr-5 ">
                            <label className=" font-semibold leading-none mb-3 text-white ">Price(BUSD)</label>
                            <div class="flex justify-center text ">
                                <div class="mb-3 w-full">
                                    <select defaultValue={5} onChange={v => setValues({ ...values, price: Number(v.target.value) })} value={values.price} class="text-center select select-ghost text-white  ">
                                        {children}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>

                <div className="flex">
                    <div className="flex flex-col mr-5 ">
                        <label className=" font-semibold leading-none mb-3 text-white">Category</label>
                        <div class="flex justify-center ">
                            <div class="mb-3 w-full">
                                <select onChange={v => setValues({ ...values, category: v.target.value })} value={values.category} class="  select select-ghost text-white text-center ">
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
            <label class="inline-block  font-semibold text-white">Course Image Preview</label>
            <div class="flex justify-start  mt-3 ">

                <div class="w-full sm:w-4/12 md:w-8/12 lg:w-8/12 xl:w-3/12 rounded-lg shadow-xl ">
                    <div class=" ">

                        <div class="flex items-center justify-center w-full">
                            <label
                                class="flex flex-col w-full h-full border-4 border-zinc-600 border-dashed rounded-2xl   hover:border-emerald-500">
                                {!preview && <div class="flex flex-col items-center justify-center pt-7">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-500 group-hover:text-gray-600"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p class="pt-1 text-sm  items-center mb-5 text-emerald-500 group-hover:text-gray-600">
                                        Attach a file</p>
                                </div>}
                                {preview &&
                                    <Image src={preview} width={300} height={200} className='rounded-2xl' />}
                                <input type="file" name="image" onChange={handleImage} accept="image/*" hidden />
                            </label>
                        </div>
                    </div>

                </div>
            </div>
            <div class="flex items-center justify-center w-full">
                <button loading={values.loading} onClick={handleSubmit} disabled={values.loading || values.uploading} class=" mt-12 rounded-2xl font-semibold leading-none text-emerald-500 py-6 px-10  border-2 border-emerald-500 hover:text-white  hover:bg-gradient-to-b from-teal-500 to-emerald-500 focus:ring-2 focus:ring-offset-2  focus:outline-none">
                    {values.loading ? "Saving..." : !editing ? "Create & Continue" : "Update Course"}
                </button>
            </div>

        </form>

    )
}

export default CourseCreateForm
