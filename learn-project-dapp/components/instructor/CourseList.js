 
  
  import { PencilAltIcon } from '@heroicons/react/solid'
  import { ArrowCircleUpIcon } from '@heroicons/react/solid'
import Link from 'next/link'

  export default function CourseList({courses}) {
 
    /* This example requires Tailwind CSS v2.0+ */


    return (
      <div className="flex flex-col">
        <div className=''>
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow-2xl overflow-hidden border-b border-gray-200  rounded-lg">
              <table className="min-w-full divide-y  divide-gray-200 ">
                <thead className="bg-gray-200  " >
                  <tr >
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-lg font-bold text-gray-800   tracking-wider"
                    >
                      Course
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-lg font-bold text-gray-800   tracking-wider"
                    >
                      Lessons
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-lg font-bold text-gray-800   tracking-wider"
                    >
                      Paid or Free
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-lg font-bold text-gray-800   tracking-wider"
                    >
                      Students
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-lg font-bold text-gray-800   tracking-wider"
                    >
                      Status
                    </th>
                    
    
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                      
                    <tr className = "hover:bg-gray-50" key={course.attributes.slug}>
                      <td className="px-6 py-4 whitespace-nowrap ">
                      <Link href={`/instructor/course/view/${course.attributes.slug}`}>
                          
                                  <a>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-20 w-20">
                            <img className="h-20 w-20 rounded-full" src={course.attributes.image_preview._url} alt="" />
                          </div>
                          <div className="ml-4">
                               
                            <div className="text-lg font-medium text-gray-800">{course.attributes.name}</div>
                            
                            <div className="text-sm mt-2 text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-green-800">{course.attributes.category}
                            </span></div>
                            
                          </div>
                        </div>
                        </a>
                            </Link>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm   text-gray-800">{course.attributes.lessons.length}</div>
                        {course.attributes.lessons.length<5 && 
                        <div className="text-sm mt-3 text-gray-400">At least 8 lessons are required to publish a course</div>
                    }
                      </td>


                      
                      <td className="px-6 py-4 whitespace-nowrap">
                         {course.attributes.paid && <div>Paid</div>}
                         {!course.attributes.paid && <div>Free</div>}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{course.attributes.usersEnrolled.length }</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {course.attributes.published && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Published
                        </span>
                        }
                        {!course.attributes.published && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-green-800">
                            Draft
                        </span>
                        }
                      </td>
                     
  
                    </tr>
                    
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
  