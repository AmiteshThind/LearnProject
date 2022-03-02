import { ArrowCircleDownIcon, ArrowCircleUpIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';

function Accordion({ children, title, number }) {

    const [isOpen, setIsOpen] = useState(false)

    return <div>
        <div onClick={() => setIsOpen(!isOpen)} className="flex transition transform hover:-translate-y-1 justify-between  bg-transparent border-2 border-teal-500 cursor-pointer hover:bg-teal-500  mx-10  py-6 font-bold mt-5 rounded-2xl">
            <div className='ml-5 text-lg text-white'>
            <span className='mr-2 text-emerald'>{number}.</span>
            <span>{title}</span>
            </div>
            <div>
            {!isOpen && <ArrowCircleDownIcon className='h-6 text-teal-500 w-6 mr-5' />
            }
            {isOpen && <ArrowCircleUpIcon className='text-teal-500 h-6 w-6 mr-5 ' />
            }
            </div>
        </div>
        <div className={`   mt-2 rounded-3xl  ${isOpen ? 'd-block' : 'hidden'}`}>
            {children}
        </div>
    </div>

}

export default Accordion;
