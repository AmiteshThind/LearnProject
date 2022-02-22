import { PencilAltIcon } from "@heroicons/react/solid";
import { ArrowCircleUpIcon } from "@heroicons/react/solid";
import Link from "next/link";

export default function CourseList({ courses }) {
  /* This example requires Tailwind CSS v2.0+ */

  return (
    <div className="flex flex-col mt-5  hidden;  ">
      <div className="">
        <div className="py-2  falign-middle table-auto  min-w-full sm:px-6 lg:px-8">
          <div className="shadow-2xl mb-10 m-12   overflow-auto   bg-zinc-800 rounded-xl">
            <table className=" min-w-full divide-y-2 divide-gray-200        ">
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
                          Minimum 8 lessons required to publish this course
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
                      {course.attributes.usersEnrolled.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.attributes.published && (
                        <span className="px-4 inline-flex text-md leading-5 font-semibold rounded-full shadow-md shadow-green-500/50 bg-emerald-500 text-white py-2 ">
                          Published
                        </span>
                      )}
                      {!course.attributes.published && (
                        <span className="px-4 inline-flex text-md leading-5 font-semibold rounded-full shadow-md shadow-yellow-500/50 bg-amber-100 text-green-800 py-2">
                          Draft
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
