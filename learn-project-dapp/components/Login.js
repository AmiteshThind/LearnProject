import logo from '../public/images/icon.svg'
import backdrop from '../public/images/splashbackground.png'
import Image from "next/image"
function Login() {
    return (
        <div className='flex-col flex h-screen'>
        <div className="flex  justify-between p-3 items-center">
            <div className='flex  items-center'  >
                <Image  src={logo} width={40} height={30} />
                <h1 className="text-2xl font-bold">LEARN</h1>
            </div>

            <div>
            <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Become An Instructor
            </button>
            </div>
        </div>
        <div>
        <div className="flex justify-center mb-10">
                <h1 className="text-4xl text-gray-500 font-semibold"> Bringing Education to Defi</h1>
            </div>
        <div className=' flex flex-col items-center '>
            <div className='text-6xl mb-2'>Paying Students for</div>
            <div className='text-6xl'>Self-Learning</div>
        </div>
        </div>

       <div className=' flex-1 flex  mt-6 justify-center items-center bg-gradient-to-b from-white to-green-700 '>
       <button class="bg-white  hover:bg-gray-200 text-black text-lg font-bold py-4 px-5 rounded">START <span class='text-green-600'>L</span>EARNING</button>

       </div>
         
        <div/>
        </div>
    )
}

export default Login
