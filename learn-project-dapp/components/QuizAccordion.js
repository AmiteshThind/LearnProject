import { ArrowCircleDownIcon, ArrowCircleUpIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';

function QuizAccordion({ children, section }) {

    const [isOpen, setIsOpen] = useState(false)

    return <div>
        <div onClick={() => setIsOpen(!isOpen)} className="flex transition transform hover:-translate-y-1 justify-between   bg-gray-100 mx-2 my-3  py-5 font-bold   rounded-2xl">
            <div className='ml-5 text-md'>
            <span>{section +' '+ "Quiz"}</span>
            </div>
            {!isOpen && <ArrowCircleDownIcon className='h-6 text-emerald-500 w-6 mr-5' />
            }
            {isOpen && <ArrowCircleUpIcon className='text-cyan-500  h-6 w-6 mr-5 ' />
            }
        </div>
        <div className={`   mt-2 rounded-3xl  ${isOpen ? 'd-block' : 'hidden'}`}>
            {children}
        </div>
    </div>

}

export default QuizAccordion;
