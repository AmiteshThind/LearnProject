import { PencilAltIcon } from "@heroicons/react/solid";
import { ArrowCircleUpIcon } from "@heroicons/react/solid";
import Link from "next/link";

export default function CourseList({ courses }) {
  /* This example requires Tailwind CSS v2.0+ */

  return (
    <div className="flex flex-col mt-5  hidden;  ">
      <div className="">
        <div className="py-2  falign-middle table-auto  min-w-full sm:px-6 lg:px-8">
          <div className="shadow-2xl mb-10 m-12   overflow-auto  bg-white dark:bg-zinc-800 rounded-xl">
          <div className="mx-5 flex flex-wrap  justify-center my-8  dark:text-white text-zinc-700 ">
          <div className="text-5xl font-extrabold pt-4 pb-4  mb-4 w-full text-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 ">
              My Courses
            </div>
              {courses.map((course) => (
                 <Link
                        href={`/instructor/course/view/${course.attributes.slug}`}
                      >
                <div className="w-full mx-5 my-3 border border-zinc-200 dark:border-zinc-600 rounded-2xl p-3 cursor-pointer hover:border-emerald-500 ">
                  <div className="flex flex-wrap  md:flex-none    text-center w-full items-center">
                    <div className="flex-shrink-0 justify-center flex w-full lg:w-1/6">
                      <img
                        className="h-20 w-20 rounded-full"
                        src={course.attributes.image_preview._url}
                        alt=""
                      />
                    </div>
                    <div className="text-xl font-semibold my-3  w-full lg:w-1/6  text-center flex-wrap  ">
                      {course.attributes.name}
                    </div>

                    <div className="text-xl font-semibold justify-center flex  w-full lg:w-1/6  text-center flex-wrap ">
                      <span className="text-zinc-700 dark:text-white ">
                        {course.attributes.lessonCount} Lessons
                      </span>
                    </div>

                    <div className="text-xl font-semibold justify-center flex w-full  lg:w-1/6  flex-wrap    text-center">
                      <span className="text-zinc-700 dark:text-white ">
                        {course.attributes.studentsEnrolled} Students
                      </span>
                    </div>
                    
                    <div className="text-xl font-semibold w-full flex justify-center flex-wrap   lg:w-1/6  ">
                      <span className="text-zinc-700 dark:text-white">
                        {course.attributes.paid?
                        course.attributes.price +"BUSD"
                            : "Free" }
                      </span>
                    </div>
                    <div className="px-6 py-4 whitespace-nowrap w-full flex-wrap  lg:w-1/6  ">
                      {course.attributes.state == "published" ? (
                        <span className="px-4 inline-flex flex-wrap  text-md leading-5 font-semibold rounded-full shadow-md   bg-emerald-500 text-white py-2 ">
                          Published
                        </span>
                      )
                      : course.attributes.state == "draft" ? (
                        <span className="px-4 inline-flex flex-wrap  text-md leading-5 font-semibold rounded-full shadow-md   bg-teal-500 text-white py-2">
                          Draft
                        </span>
                      ):
                      <span className="px-4 inline-flex flex-wrap  text-md leading-5 font-semibold rounded-full shadow-md  bg-yellow-500 text-white py-2">
                          Pending Approval
                        </span>
                      }
                    </div>
                  </div>
                </div>
                </Link>
              ))}
            </div>
            {/* <table className=" min-w-full divide-y-2 divide-gray-200        ">
              <thead className="   ">
                <tr className="transition duration-300 ease-in-out">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-lg font-bold text-emerald-500    tracking-wider"
                  >
                    COURSE
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-lg font-bold text-emerald-500   tracking-wider"
                  >
                    LESSONS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-lg font-bold text-emerald-500   tracking-wider"
                  >
                    PRICE
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-lg font-bold text-emerald-500    tracking-wider"
                  >
                    STUDENTS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-lg font-bold text-emerald-500  tracking-wider"
                  >
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className=" ">
                {courses.map((course) => (
                  <tr
                    className="     transform transition duration-500 hover:-translate-y-2   "
                    key={course.attributes.slug}
                  >
                    <td className="px-6 py-4 whitespace-nowrap  ">
                      <Link
                        href={`/instructor/course/view/${course.attributes.slug}`}
                      >
                        <a>
                          <div className="flex items-center">
                            <div className="flex-shrink-0   h-20 w-20">
                              <img
                                className="h-20 w-20 rounded-full"
                                src={course.attributes.image_preview._url}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-medium text-white">
                                {course.attributes.name}
                              </div>

                              <div className="text-sm mt-2 text-white">
                                <span className="px-2  inline-flex text-xs leading-5 rounded-full  bg-gradient-to-l from-teal-500    to-emerald-500  ">
                                  {course.attributes.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg   text-white">
                        {course.attributes.lessonCount}
                      </div>
                      {course.attributes.lessonCount < 5 && (
                        <div className="text-sm mt-3 text-gray-300">
                          Minimum 5 lessons required to publish this course
                        </div>
                      )}
                      {course.attributes.lessonCount >= 5 && (
                        <div className="text-sm mt-3 text-emerald-500">
                          Course is ready to be published
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-lg text-white">
                      <div>
                        {course.attributes.paid && (
                          <div>{course.attributes.price} BUSD</div>
                        )}
                        {!course.attributes.paid && <div>Free</div>}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-white text-lg">
                      {course.attributes.studentsEnrolled}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.attributes.state == "published" ? (
                        <span className="px-4 inline-flex text-md leading-5 font-semibold rounded-full shadow-md   bg-emerald-500 text-white py-2 ">
                          Published
                        </span>
                      )
                      : course.attributes.state == "draft" ? (
                        <span className="px-4 inline-flex text-md leading-5 font-semibold rounded-full shadow-md   bg-teal-500 text-white py-2">
                          Draft
                        </span>
                      ):
                      <span className="px-4 inline-flex text-md leading-5 font-semibold rounded-full shadow-md  bg-yellow-500 text-white py-2">
                          Pending Approval
                        </span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        </div>
      </div>
    </div>
  );
}
