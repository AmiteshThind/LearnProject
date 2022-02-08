import React, { useEffect, useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid'
import { Moralis } from 'moralis'

function LessonList({course}) {

    const [lessons,setLessons] = useState([]);
    const [isLoading,setIsLoading] = useState(true); 
    
    useEffect(() => {
        //load course from moralis based on slug 
        //console.log(course)

        loadLessons();


        //console.log(course)


    },[isLoading])

    const loadLessons = async(e)=>{
        const Lesson = Moralis.Object.extend("Lesson");
        const query2 = new Moralis.Query(Lesson);
        console.log("5")
        console.log(course)
        const result2 = await query2.find("course",course[0]);
        setLessons([] )
        for(let lesson of result2){
            console.log(lesson)
            setLessons((oldArray)=>[...oldArray,lesson] )
        }

      
        setIsLoading(false)
    }
    return <div>
        
        <ul class="bg-white rounded-lg border border-gray-200 m-10 text-gray-900 text-sm  font-medium">
        {lessons.map((lesson,index) => (
            <li key={index} class="px-4 py-5 border-b border-gray-200 w-full justify-between flex rounded-t-lg">
                <div>
                <span className='rounded-full bg-gray-200 px-3 py-1'>{index+1}</span>
                <span className=' px-3 py-1'>{lesson.attributes.title}</span>
                </div>
                <span className=' px-3 py-1 flex'>
                <PencilIcon className="h-5 w-5  mr-2  text-cyan-400" />
                <TrashIcon className="h-5 w-5    text-red-400" />
                </span>
            </li>
        ))}
 
        </ul>

    </div>;
}

export default LessonList;
