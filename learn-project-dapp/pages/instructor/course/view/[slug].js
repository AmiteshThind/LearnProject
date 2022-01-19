import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import InstructorNavbar from '../../../../components/instructor/InstructorNavBar'
import { useMoralis } from "react-moralis"
import { Moralis } from 'moralis'
import ReactMarkdown from 'react-markdown'
import { ArrowCircleLeftIcon, ArrowLeftIcon, PencilIcon, CheckIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import Tooltip from '../../../../components/Tooltip'
import Image from 'next/image'
import remarkGfm from 'remark-gfm'

function CourseView() {
    const [course, setCourse] = useState([])
    const router = useRouter();
    const { slug } = router.query;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        //load course from moralis based on slug 
        //console.log(course)

        loadCourse();
        //console.log(course)


    }, [isLoading])

    const loadCourse = async () => {

        const Course = Moralis.Object.extend("Course");
        const query = new Moralis.Query(Course);
        query.equalTo("slug", slug);
        console.log("1")
        const result = await query.find();
        console.log("2")
        console.log(result)
        setCourse(result)
        console.log("3")

        setIsLoading(false)





    }

    return (
        <div className=''>
            <InstructorNavbar />

  
                {course.length == 1 && 
                     <div className='flex  flex-wrap  '>
                        <div className='flex flex-wrap  w-1/12 '>
                            <Link href={"/instructor/dashboard"}><a>
                                <ArrowCircleLeftIcon className="h-10 w-10 mt-6 ml-6  text-green-500" />
                            </a>
                            </Link>
                        </div>
                         
                        
                        <div className='flex  lg:w-6/12 md:w-6/12 sm:w-full  items-start flex-col m-10   flex-stretch justify-center   '>
                            <div className='flex   w-full  '>
                                <div className=" px-1 flex flex-wrap text-4xl   text-green-500 ">
                                    <h1>{course[0].attributes.name} </h1>
                                </div>
                                <div className='flex flex-grow      mr-10'>   
                                <PencilIcon className="h-8 w-8 mx-3   text-green-200 hover:text-green-400" />
                                <CheckIcon className="h-8 w-8   text-gray-200 hover:text-gray-400" />
                                </div>
                            </div>
                            <div className="text-md mt-1 px-1 text-gray-700 ">
                            {course[0].attributes.lessons.length} Lessons
                            
                            </div>
                            <div className="text-sm  mt-2 text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-green-800">{course[0].attributes.category}
                            </span>
                            </div> 
                             
                         
                           <div className="flex-shrink-0 mr-5 mt-4  ">
                               <div className='mb-3 font-semibold'>Image Preview</div>
                                <Image src={course[0].attributes.image_preview._url} className='rounded-lg' width="400rem"height="200rem" />
                            </div>
                            <div className='mt-3 w-full relative flex flex-col flex-wrap'>
                            <div className='mb-3    font-semibold'>Description</div>
                        <div className='prose flex    '>
                                <ReactMarkdown className='w-12/12 flex-grow '  remarkPlugins={[remarkGfm]} children={course[0].attributes.description} />
                                </div>
                                
                            </div>
                             
                        </div>

                        <div className='flex bg-gray-200 lg:w-3/12 md:w-3/12 sm:w-full   m-10'>
                        <div className="   flex flex-wrap text-4xl   text-green-500 ">
                                    <h1>Manage Lessons </h1>
                                    
                                </div>
                        </div>
                         
                    

                </div>}
            

        </div>
    )
}

export default CourseView;