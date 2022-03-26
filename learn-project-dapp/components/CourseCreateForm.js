import Image from "next/image";
import { useState, useEffect } from "react";

function CourseCreateForm({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  handleSections,
  editing,
  updateSubmitted
}) {
  //for price of course
  const children = [];
  for (let i = 5; i <= 50; i += 1) {
    children.push(<option key={i}>{i}</option>);
  }

  return (
    <form onSubmit={handleSubmit} className="m-5">
      <div className="flex justify-center mb-5 text-4xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-400 font-extrabold">
        {!editing ? <div>Create Course</div> : <div> Update Course Details</div>}
      </div>
      {updateSubmitted && <div className="text-yellow-200 font-semibold my-5 border rounded-2xl p-4 flex-wrap border-yellow-200">
              Note: Update submited wait for it to be approved before making another update. If you make new request the previous request will be deleted.
              </div>}
      <div class="flex items-center  ">
          
        <div class="w-full flex flex-col   ">
          <label class="font-semibold leading-none dark:text-white text-zinc-700">
            Course Name
          </label>
          <input
            name="name"
            value={values.name}
            onChange={handleChange}
            required
            placeholder="eg. Beginners  Guide to Investing in Crypto "
            type="text"
            class="  input dark:bg-zinc-700 mt-3 border dark:border-none border-zinc-300 dark:text-white text-zinc-700 "
          />
        </div>
      </div>

      <div>
        <div className="w-full flex flex-col mt-5  ">
          <label class="font-semibold leading-none dark:text-white text-zinc-700">
            Description
          </label>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            required
            placeholder="Give a breif overfiew of what students can expect to learn from this course"
            type="text"
            className="h-40 w-prose input dark:bg-zinc-700 mt-3 border dark:border-none border-zinc-300 dark:text-white text-zinc-700  "
          ></textarea>
        </div>
      </div>

      <div class="flex items-center mt-5  ">
        <div class="w-full flex flex-col   ">
          <label class="font-semibold leading-none dark:text-white text-zinc-700 ">
            Sections{" "}
            <span className="text-gray-400">
              (Seperate by comma and include all sections in order)
            </span>
          </label>
          <input
            name="sections"
            value={values.sections}
            onChange={handleSections}
            required
            placeholder="eg. Setup, Config, Defi ... "
            type="text"
            class="input  dark:bg-zinc-700 mt-3 border dark:border-none border-zinc-300 dark:text-white text-zinc-700 "
          />
        </div>
      </div>

      <div className="mt-5 mb-4 w-full flex-col  flex-stretch justify-start">
        <div className="flex  ">
          <div className="flex">
            <div className="flex flex-col  sm:mr-5 md:mr-5 lg:mr-5 xl:mr-5 ">
              <label className=" font-semibold leading-none mb-3 dark:text-white text-zinc-700 ">
                Paid
              </label>
              <div class="flex justify-center ">
                <div class="mb-3 w-full">
                  {values.paid && (
                    <select
                      onChange={(v) =>
                        setValues({ ...values, paid: !values.paid })
                      }
                      class=" select dark:border-none border dark:bg-zinc-700 border-zinc-300 select-ghost dark:text-white text-zinc-700 text-center "
                    >
                      <option selected value={true}>
                        Yes
                      </option>
                      <option value={false}>No</option>
                    </select>
                  )}
                  {!values.paid && (
                    <select
                      onChange={(v) =>
                        setValues({ ...values, paid: !values.paid })
                      }
                      class=" select select-ghost   dark:bg-zinc-700  border dark:border-none border-zinc-300 dark:text-white text-zinc-700 text-center "
                    >
                      <option value={true}>Yes</option>
                      <option selected value={false}>
                        No
                      </option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>

          {values.paid && (
            <div className="flex">
              <div className="flex flex-col mr-5 ">
                <label className=" font-semibold leading-none mb-3 dark:text-white text-zinc-700 ">
                  Price(BUSD)
                </label>
                <div class="flex justify-center text ">
                  <div class="mb-3 w-full">
                    <select
                      defaultValue={5}
                      onChange={(v) =>
                        setValues({ ...values, price: Number(v.target.value) })
                      }
                      value={values.price}
                      class="text-center dark:border-none  dark:bg-zinc-700  select select-ghost border border-zinc-300 dark:text-white text-zinc-700  "
                    >
                      {children}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex">
          <div className="flex flex-col mr-5 ">
            <label className=" font-semibold leading-none mb-3 dark:text-white text-zinc-700">
              Category
            </label>
            <div class="flex justify-center ">
              <div class="mb-3 w-full">
                <select
                  onChange={(v) =>
                    setValues({ ...values, category: v.target.value })
                  }
                  value={values.category}
                  class=" dark:border-none  dark:bg-zinc-700 select border border-zinc-300 select-ghost dark:text-white text-zinc-700 text-center "
                >
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
      <label class="inline-block  font-semibold dark:text-white text-zinc-700">
        Course Image Preview
      </label>
      <div class="flex justify-start  mt-3 ">
        <div class="w-full sm:w-4/12 md:w-8/12 lg:w-8/12 xl:w-3/12 rounded-2xl shadow-xl ">
          <div class=" ">
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col w-full h-full border-4 border-zinc-300 cursor-pointer dark:border-zinc-500 border-dashed rounded-2xl   hover:border-emerald-500">
                {!preview && (
                  <div class="flex flex-col items-center justify-center pt-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-8 h-8 text-emerald-500 group-hover:text-zinc-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p class="pt-1 text-sm  items-center mb-5 text-emerald-500 group-hover:text-gray-600">
                      Attach a file
                    </p>
                  </div>
                )}
                {preview && (
                  <Image
                    src={preview}
                    width={300}
                    height={200}
                    className="rounded-2xl"
                  />
                )}
                <input
                  type="file"
                  name="image"
                  onChange={handleImage}
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center w-full">
        <button
          loading={values.loading}
          onClick={handleSubmit}
          disabled={values.loading || values.uploading}
          class=" mt-12 rounded-2xl font-semibold leading-none text-emerald-500 py-6 px-10  border-2 border-emerald-500 hover:text-white  hover:bg-gradient-to-b from-teal-500 to-emerald-500 focus:ring-2 focus:ring-offset-2  focus:outline-none"
        >
          {values.loading
            ? "Saving..."
            : !editing
            ? "Create & Continue"
            : "Update Course"}
        </button>
      </div>
    </form>
  );
}

export default CourseCreateForm;
