import { useState } from "react"
import Banner from "../../../components/Banner"
import CourseCreateForm from "../../../components/CourseCreateForm"
import DropDownInput from "../../../components/DropDownInput"
import InstructorNavbar from "../../../components/instructor/InstructorNavBar"
import  { Moralis } from 'moralis'
import { useMoralis } from "react-moralis"
import slugify from 'slugify'
import Router, { useRouter } from "next/router"

function CourseCreate() {

    //state
    const router = useRouter();

    const {user} = useMoralis();
    
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: 5,
        uploading: false,
        paid: true,
        loading: false,
        category:'',
        sections:[]
         
    })

    const [preview,setPreview] = useState('')
    const [imageFile,setImageFile] = useState();
    

    const handleChange = (e) => {
        console.log(e)
        console.log(e.target.name)
        console.log(e.target.value)
        setValues({ ...values, [e.target.name]: e.target.value });
        console.log(values)
    }

    const handleSections = (e) => {

       let arr = e.target.value.split(',');

       console.log(e.target.name)
        setValues({ ...values, [e.target.name]: arr });
        console.log(values)
    }

    const handleImage = (e) => {
        setImageFile(e.target.files[0]);
        if(e.target.files[0]){
        setPreview(window.URL.createObjectURL(e.target.files[0]));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // we will create a new database instance for the course and take all data from the form and upload to the database including the image
        
        createNewCourse();
        router.push(`/instructor/dashboard`)

        console.log(values) //request to backend will be made here to create a course
    }

    const createNewCourse = async () =>{
        const Course = Moralis.Object.extend("Course");
        const newCourse = new Course();
        newCourse.set('name',values.name);
        newCourse.set('description',values.description);
        if(!values.paid){
            newCourse.set('price',0);
        }else{
            newCourse.set('price',values.price);
        }
        newCourse.set('paid',values.paid);
        newCourse.set('category',values.category);
        newCourse.set('instructor',user)
        newCourse.set('slug',slugify(values.name.toLowerCase()));
        newCourse.set('sections',values.sections);

        uploadFile(newCourse);

    }

    const uploadFile = async (newCourse) =>{
        if(imageFile){
            const imagePreview = new Moralis.File("image",imageFile);
            newCourse.set('image_preview', imagePreview);
            await newCourse.save();
        }
    }
 



    return (
        <div className=" min-h-min bg-gradient-to-b from-cyan-100 via-white to-red-100">
            <InstructorNavbar />
            <div className="flex justify-center">
                <div class="w-3/4 justify-center    min-h-screen ">
                    <div class="w-fullmx-auto px-6  flex justify-center items-center  ">
                        <div class="bg-white w-full shadow-2xl  rounded-3xl  sm:p-12 mt-5 mb-5 ">
                            <p class="text-3xl font-bold leading-7 text-center text-emerald-500"> </p>
                            <CourseCreateForm handleSubmit={handleSubmit} handleImage={handleImage} handleChange={handleChange} handleSections={handleSections} values = {values} setValues ={setValues} preview={preview} editing={false} />
                        </div>
                    </div>
                </div>
                 
            </div>
        </div>
    )
}

export default CourseCreate
