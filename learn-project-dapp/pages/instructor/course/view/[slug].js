import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import InstructorNavbar from '../../../../components/instructor/InstructorNavBar'
import { useMoralis } from "react-moralis"
import { Moralis } from 'moralis'
import ReactMarkdown from 'react-markdown'
import { ArrowCircleLeftIcon, ArrowLeftIcon, PencilIcon, CheckIcon, UploadIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import Tooltip from '../../../../components/Tooltip'
import Image from 'next/image'
import remarkGfm from 'remark-gfm'
import Modal from '../../../../components/Modal'
import { toast, ToastContainer } from 'react-toastify'
import Router from 'next/router'
import axios from 'axios'


function CourseView() {
    const [course, setCourse] = useState([])
    const router = useRouter();
    const { slug } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const { user, isAuthenticated } = useMoralis();

    //for lessons

    const [values, setValues] = useState({
        title: "",
        content: "",
        video: {}
    })

    const [uploading, setUploading] = useState(false)
    const [uploadBtnText, setUploadBtnText] = useState("Upload Video")
    const [progress, setProgress] = useState(0);
 
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
        console.log(result[0])
        setCourse(result)
        console.log("3")
 
        setIsLoading(false)
    }

    //functions for add Lessons

    const handleAddLesson = async (e) => {
        //add lesson to course array
        e.preventDefault();

        try {
             
            if(values.title!='' && values.content!='' && values.video!={}){
                //create Lesson in Lessons Class in Moralis while referecing course to which this Lesson belongs to
                const Lesson = Moralis.Object.extend("Lesson");
                const newLesson = new Lesson();
                newLesson.set('title',values.title);
                newLesson.set('content',values.content);
                newLesson.set('video',values.video);
                newLesson.set('course',course[0]);
                const addedLesson = await newLesson.save();
               
                // add this lesson object to the lessons array under the course to which it belongs 
                course[0].addUnique("lessons",addedLesson.id);
                await course[0].save()    
                setVisible(false);
                setUploadBtnText("Upload Video")
                setValues({...values,
                    title:'',
                    content:'',
                    video:{}
            })

            } else{
                toast("Please Input All Fields")
                console.log('here i am')
            }


        } catch{

        }
        console.log(values)
        // creates a lesson in the database which includes the video hash and url, title, course object id, , content 
    }

    const handleVideo = async (e) => {
        //uploads file to the IPFS and returns a hash which we will store in db to later retreive the content. 
        console.log('wow')
        try {
            const instructorId = course[0].attributes.instructor.id;
            console.log("im here")
            const file = e.target.files[0];
            if (file) {
                console.log(file)
                const videoData = new FormData();
                videoData.append('video', file);
                setUploading(true);
                // get current user objectId

                //sendData.append("userId",userObjectId)


                await axios.post(`http://localhost:8000/api/course/video-upload/${instructorId}`, videoData, {
                    onUploadProgress: (e) => {
                        setProgress(Math.round((100 * e.loaded) / e.total))
                        console.log(e)
                    },
                    withCredentials: true
                }
                ).then(function (response) {

                    setProgress(0);
                    setUploading(false);
                    setUploadBtnText(file.name);
                    // console.log(data)



                    //once response is received 

                    setValues({ ...values, video: response.data })
                    console.log(values)
                }

                )
            }




            // work on progress bar

        } catch (error) {
            console.log(error)
            setUploading(false);
            toast("Video Upload Failed")


        }

    }

    const handleVideoRemove = async (e) => {
        try {
            setUploading(true);
            const instructorId = course[0].attributes.instructor.id;
            const { data } = await axios.post(`http://localhost:8000/api/course/video-remove/${instructorId}`, values.video, {
                withCredentials: true
            });
            setValues({ ...values, video: {} })
            setProgress(0)
            setUploading(false);
            setUploadBtnText("Upload Another Video")
        } catch (error) {
            console.log(error)
        }
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
                            <Image src={course[0].attributes.image_preview._url} className='rounded-lg' width="400rem" height="200rem" />
                        </div>
                        <div className='mt-3 w-full relative flex flex-col flex-wrap'>
                            <div className='mb-3    font-semibold'>Description</div>
                            <div className='prose flex    '>
                                <ReactMarkdown className='w-12/12 flex-grow ' remarkPlugins={[remarkGfm]} children={course[0].attributes.description} />
                            </div>

                        </div>

                    </div>

                    <div className='flex bg-gray-200 lg:w-3/12 md:w-3/12 sm:w-full flex-col  m-10'>
                        <div className="   flex flex-wrap text-4xl justify-center  text-green-500 ">
                            <h1>Manage Lessons </h1>
                        </div>
                        <div className='flex items-center justify-center mt-10'>
                            <button onClick={() => { setVisible(true) }} class="bg-green-500 shadow-lg shadow-green-500/50 rounded-2xl justify-center text-md   w-full px-3 mx-10 py-3 flex"><UploadIcon className='h-6 w-6  ' /> Add Lesson</button>
                            <Modal uploadBtnText={uploadBtnText} setUploadBtnText={setUploadBtnText} values={values} setValues={setValues} handleAddLesson={handleAddLesson} visible={visible} setVisible={setVisible} uploading={uploading} handleVideo={handleVideo} progress={progress} handleVideoRemove={handleVideoRemove}>

                            </Modal>
                        </div>

                    </div>



                </div>}


        </div>
    )
}

export default CourseView;
