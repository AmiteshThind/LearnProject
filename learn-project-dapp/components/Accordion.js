import { ArrowCircleDownIcon, ArrowCircleUpIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';

function Accordion({ children, title, number }) {

    const [isOpen, setIsOpen] = useState(false)

    return <div>
        <div onClick={() => setIsOpen(!isOpen)} className="flex transition transform hover:-translate-y-1 justify-between   bg-gray-100 mx-10  py-6 font-bold mt-5 rounded-2xl">
            <div className='ml-5 text-lg'>
            <span className='mr-2'>{number}.</span>
            <span>{title}</span>
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

export default Accordion;
