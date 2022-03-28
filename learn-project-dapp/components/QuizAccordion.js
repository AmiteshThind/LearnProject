import { ArrowCircleDownIcon, ArrowCircleUpIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';

function QuizAccordion({ children, section }) {

    const [isOpen, setIsOpen] = useState(false)

    return <div>
        <div onClick={() => setIsOpen(!isOpen)} className="flex group transition transform hover:scale-105 duration-150 justify-between hover:bg-gradient-to-br from-teal-500 to-emerald-500   border-2 border-emerald-500 mx-2 my-3  py-5 font-bold cursor-pointer  rounded-2xl">
            <div className='ml-5 text-md text-zinc-700 dark:text-white'>
            <span className='text-zinc-700 dark:text-white dark:group-hover:text-zinc-700 group-hover:text-white'>{section +' '+ "Quiz"}</span>
            </div>
            <div>
            {!isOpen && <ArrowCircleDownIcon className='h-6 text-emerald-500 group-hover:text-white dark:group-hover:text-zinc-700 w-6 mr-5 ' />
            }
            {isOpen && <ArrowCircleUpIcon className='text-emerald-500 group-hover:text-white dark:group-hover:text-zinc-700  h-6 w-6 mr-5 ' />
            }
            </div>
        </div>
        <div className={` text-zinc-700 dark:text-white  mt-2 rounded-3xl  ${isOpen ? 'd-block' : 'hidden'}`}>
            {children}
        </div>
    </div>

}

export default QuizAccordion;
