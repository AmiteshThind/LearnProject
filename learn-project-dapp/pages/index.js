import Head from 'next/head'
import { useMoralis } from "react-moralis";

import logo from '../public/images/icon.svg'
import backgroundImage from '../public/images/backgroundHome.png'
import mainPage from '../public/images/student-on-books.svg'
import Tilt from 'react-parallax-tilt';
import Image from "next/image"
import Router from "next/router"
import Resizer from "react-image-file-resizer";

export default function Home() {



  return (
    <div className=' min-h-screen flex flex-col items-center bg-fixed   bg-gradient-to-tr from-rose-200    via-teal-100  to-violet-200 text-zinc-700    '>
      
      <div className=" w-full   font-bold text-3xl mt-2  text-shadow-sm   cursor-pointer text-emerald-400   ">
        <div className='sm:ml-2 md:ml-10 lg:ml-2 xl:ml-10 '>
                  $<span className="text-white text-shadow-md">LEARN</span>
                </div>
                </div>
      <div className='flex items-center text-center justify-center '>
        <div className="text-6xl text-transparent bg-clip-text bg-gradient-to-tl from-emerald-500 to-teal-400 z-50 font-bold mt-10 ">Education Meets Defi</div>
      </div>
      <div className='flex   justify-center   w-full lg:w-1/3 text-center my-10        '>
        <div className="text-2xl text-zinc-800 z-50 ">LEARN is a web3 learning platform that rewards self learning while fairly compensating instructors for their hardwork.</div>
      </div>

      <div className='flex justify-center cursor-pointer items-center my-10   ' >
        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} >
          <Image src={mainPage} height={600} width={800}
            className='rounded-lg z-50 ' />
            </Tilt>
        
      </div>
      <div className='flex   justify-center   w-full text-center my-10       '>
       <div onClick={() => Router.push('/marketplace')} className='rounded-2xl text-xl hover:scale-105 duration-200 font-semibold leading-none  py-6 px-10 cursor-pointer text-white  bg-gradient-to-b from-teal-500 to-emerald-500 focus:ring-2 focus:ring-offset-2  focus:outline-none" '>Go To App</div>
      </div>
 
 
      
    </div>

  )
}
