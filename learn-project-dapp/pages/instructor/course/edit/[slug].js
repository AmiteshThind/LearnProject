import { useEffect, useState } from "react"
import CourseCreateForm from "../../../../components/CourseCreateForm"
import DropDownInput from "../../../../components/DropDownInput"
import InstructorNavbar from "../../../../components/instructor/InstructorNavBar"
import  { Moralis } from 'moralis'
import { useMoralis } from "react-moralis"
import slugify from 'slugify'
import { useRouter } from 'next/router'

function CourseEdit() {



    //state

    const {user,isAuthenticated} = useMoralis();
    const router = useRouter();
    const { slug } = router.query;
    const [isLoading,setIsLoading] = useState(true);
    
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
    
    useEffect(()=>{
        if(isAuthenticated && user){
            router.push('/marketplace')
        }
        loadCourse();
    },[isLoading,isAuthenticated,user])

    const loadCourse = async()=>{
        const Course = Moralis.Object.extend("Course");
        const query = new Moralis.Query(Course);
        query.equalTo("slug", slug);
        const result = await query.find();
        if(result[0]){
        setValues(result[0].attributes)
        console.log(result[0].attributes)
        setPreview(result[0].attributes.image_preview._url);
        } 
        setIsLoading(false);     //once u get the value from the endpoint then u set to false as it will keep re running until the response is reached
        console.log('wow')
    
    }

    const handleChange = (e) => {
        console.log(e)
        console.log(e.target.name)
        console.log(e.target.value)
        setValues({ ...values, [e.target.name]: e.target.value });
        console.log(values)
    }

    const handleSections = (e) => {

       let arr = e.target.value.split(',');

       console.log(arr)
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
        
        updateCourse();
        
        console.log(values) //request to backend will be made here to create a course
    }

    const updateCourse = async () =>{
        const Course = Moralis.Object.extend("Course");
        const query = new Moralis.Query(Course);
        query.equalTo("slug", slug);
        const courseToUpdate = await query.first();
        courseToUpdate.set('name',values.name);
        courseToUpdate.set('description',values.description);
        if(!values.paid){
            courseToUpdate.set('price',0);
        }else{
            courseToUpdate.set('price',values.price);
        }
        courseToUpdate.set('paid',values.paid);
        courseToUpdate.set('category',values.category);
        courseToUpdate.set('instructor',user)
        courseToUpdate.set('slug',slugify(values.name.toLowerCase()));
        courseToUpdate.set('sections',values.sections);

        uploadFile(courseToUpdate);
        await courseToUpdate.save();
        router.push(`/instructor/course/view/${slugify(values.name.toLowerCase())}`)
        console.log('wow')
        console.log(values.sections)

    }

    const uploadFile = async (courseToUpdate) =>{
        if(imageFile){
            const imagePreview = new Moralis.File("image",imageFile);
            courseToUpdate.set('image_preview', imagePreview);
        }
         
    }
 

    return (
        <div className=" bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500">
            <InstructorNavbar />
            <div className="flex justify-center">
                <div class="w-3/4 justify-center    min-h-screen ">
                    <div class="w-fullmx-auto px-6  flex justify-center items-center  ">
                        <div class="bg-zinc-800 w-full shadow-2xl  rounded-3xl  sm:p-12 mt-5 mb-5 ">
                            <p class="text-3xl font-bold leading-7 text-center text-emerald-500"> </p>
                            <CourseCreateForm handleSubmit={handleSubmit} handleImage={handleImage} handleChange={handleChange} handleSections={handleSections} values = {values} setValues ={setValues} preview={preview} editing={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseEdit
