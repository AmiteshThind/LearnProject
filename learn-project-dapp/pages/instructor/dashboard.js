import { useEffect } from "react"
import Banner from "../../components/Banner"
import InstructorNavbar from "../../components/instructor/InstructorNavBar"
import { useState } from 'react'
import { useMoralis } from "react-moralis"
import { Moralis } from 'moralis'
import CourseList from "../../components/instructor/CourseList"


function dashboard() {
    //use zustand to store auth state and course data for isnturcotrs and users alieks
    const { user } = useMoralis();
    const [courses,setCourses] = useState([])
    const [isLoading,setIsLoading] = useState(true);
 

    useEffect(()=>{
    
        loadCourses();
    
    },
    [isLoading]
)


const loadCourses = async ()=>{

    const Course = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Course);
    query.equalTo("instructor", user);
    const result = await query.find();
    setCourses(result)   
    setIsLoading(false);     //once u get the value from the endpoint then u set to false as it will keep re running until the response is reached
    console.log('wow')

}

    

    return (
        <div>
            <InstructorNavbar />
            <Banner title={"Instructor Dashboard"} />
            <div className="m-12">
            <CourseList courses={courses}/>
            {/* <pre>{JSON.stringify(courses,null,3)}</pre> */}
            </div>
        </div>
    )
}

export default dashboard