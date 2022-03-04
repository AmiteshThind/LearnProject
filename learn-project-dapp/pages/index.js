import Head from 'next/head'
import { useMoralis } from "react-moralis";

import logo from '../public/images/icon.svg'
import backgroundImage from '../public/images/backgroundHome.png'
import mainPage from '../public/images/mainpage.png'
import Tilt from 'react-parallax-tilt';
import Image from "next/image"
import Router from "next/router"
import Resizer from "react-image-file-resizer";

export default function Home() {



  return (
    <div className=' min-h-screen flex flex-col   '>
      <Image src={backgroundImage}   layout='fill' objectFit='cover' />
      <div className='flex items-center   '>
        <h1 className="animate-pulse  text-3xl z-50  m-1 font-bold text-emerald-500">$L<span className='text-white'>EARN</span></h1>
      </div>
      <div className='flex items-center justify-center     flex-grow py-5  - '>
        <h1 className="text-6xl text-white z-50 font-extrabold ">Bringing Education To Defi</h1>
      </div>

      <div className='flex justify-center items-center  ' >
        <Tilt>
          <Image src={mainPage} height={500} width={900}
            className='rounded-lg z-50 ' />
        </Tilt>
      </div>
      <div className='flex flex-grow  items-center justify-center  '>
        <button onClick={() => Router.push('/marketplace')} className="text-2xl  z-50 m-5 py-6 lg:w-2/12 md:3/12 sm:w-full text-white bg-gradient-to-b from-teal-500 via-emerald-500 to-emerald-600 hover:scale-105 duration-150 focus:ring-4 focus:ring-green-300  dark:focus:ring-green-800 shadow-lg   font-bold rounded-lg  px-5 text-center mr-2 mb-2">
          Start Learning
        </button>
        <button onClick={() => Router.push('/marketplace')} className=" text-2xl z-50 m-5 py-6 lg:w-2/12 md:3/12 sm:w-full text-white bg-gradient-to-b from-teal-500 via-emerald-500 to-emerald-600 hover:scale-105 duration-150 focus:ring-4 focus:ring-green-300  dark:focus:ring-green-800 shadow-lg   font-bold rounded-lg  px-5 text-center mr-2 mb-2">
          Become An Instructor</button>
      </div>
    </div>

  )
}
