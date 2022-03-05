import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Moralis from 'moralis'



function CourseCard({course}) {

  const [instructorUsername,setInstructorUsername] = useState("")
  

  useEffect(()=>{
    loadInstructorDetails();
  })

  const loadInstructorDetails = async()=>{
    const Instructors = Moralis.Object.extend("instructorSubmissions");
    const query = new Moralis.Query(Instructors);
    query.equalTo("user",course.attributes.instructor);
    const result = await query.find();
    console.log(course)
    if(result[0]){
      setInstructorUsername(result[0].attributes.name);
    }

  }

  return (
    <Link href={`/course/${course.attributes.slug}`}>
    <div className=" container transform transition duration-500 hover:scale-105 cursor-pointer  ">
      <div className="card w-70   bg-zinc-800  shadow-2xl">
        <figure>
          <Image
          width={650}
          height={400}
            src={course.attributes.image_preview._url}
            alt="Shoes"
          />
        </figure>
        <div class=" mx-5 my-5 p-2   ">
        <div class="badge bg-gradient-to-l from-teal-500    to-emerald-500  border-none px-4 py-4     truncate  ">{course.attributes.category}</div>
        <h3 className=" mt-4 text-sm text-base-100 truncate">By {instructorUsername}</h3>
          <p class="font-semibold text-2xl mt-4  h-24 text-white  line-clamp-3  ">{course.attributes.name}</p>
          
          
           
             
            <div class=" mt-4 font-semibold brightness-110 text-transparent bg-clip-text bg-gradient-to-l from-teal-500 to-emerald-500 text-3xl ">
              {course.attributes.paid ? course.attributes.price + " BUSD" : "Free"}
              </div>
        </div>
      </div>
    </div>
    </Link>

  );
}

export default CourseCard;
