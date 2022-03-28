import { ArrowCircleDownIcon, ArrowCircleUpIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';

function Accordion({ children, title, number }) {

    const [isOpen, setIsOpen] = useState(false)

    return <div>
        <div onClick={() => setIsOpen(!isOpen)} className="flex group  hover:scale-105 hover:border-white duration-150  transition transform  justify-between   bg-transparent border-2 border-zinc-200 dark:border-zinc-700 cursor-pointer hover:bg-gradient-to-b from-teal-500 to-emerald-500  mx-10  py-6 font-bold mt-5 rounded-2xl">
           
            <div className='ml-5 text-lg    text-zinc-700 dark:text-white'>
            <span className='mr-2 text-emerald group-hover:text-white dark:group-hover:text-zinc-700'>{number}.</span>
            <span className='group-hover:text-white dark:group-hover:text-zinc-700'>{title}</span>
            </div>
            <div>
            {!isOpen && <ArrowCircleDownIcon className='h-6 group-hover:text-white dark:group-hover:text-zinc-700 text-emerald-500 w-6 mr-5' />
            }
            {isOpen && <ArrowCircleUpIcon className='text-emerald-500 dark:group-hover:text-zinc-700 group-hover:text-white h-6 w-6 mr-5 ' />
            }
            </div>
        </div>
        <div className={`   mt-2 rounded-3xl  ${isOpen ? 'd-block' : 'hidden'}`}>
            {children}
        </div>
    </div>

}

export default Accordion;
