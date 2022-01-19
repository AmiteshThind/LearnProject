import Navbar from "../../components/user/UserNavBar"
import {useMoralis} from 'react-moralis'
import  { Moralis } from 'moralis'
import { useState } from "react";
import Banner from "../../components/Banner";

function becomeinstructor() {

    const { user } = useMoralis();
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [website,setWebsite] = useState('');
    const [linkedin,setLinkedin] = useState('');
    const [q1,setQ1] = useState('');
    const [q2,setQ2] = useState('');


    const assignInstructorRole = async () =>{
        user.set("role","instructor");
        await user.save();
    }

    const submitForm = async ()=>{ //also want to add who submitted this 
        const instructorSubmission = Moralis.Object.extend("instructorSubmissions");
        const formSubmission = new instructorSubmission();
        if(name!='' && email != '' && q1!='' && q2!=''){
        formSubmission.set('name',name);
        formSubmission.set('email',email);
        formSubmission.set('website',website);
        formSubmission.set('linkedin',linkedin);
        formSubmission.set('question1',q1);
        formSubmission.set('question2',q2);
        formSubmission.set('user',user)
        await formSubmission.save();
        } else{

        }

        assignInstructorRole();
        console.log('done')

    }

    return (
        <div>
        <div >
              <Navbar />
        </div>
        <div className="  min-h-screen">
            <Banner title={"Become Instructor"}/>
            <div class="w-full">
                <div class=" "></div>
                <div class="max-w-4xl mx-auto px-6 sm:px-6 flex justify-center items-center  ">
                    <div class="bg-white w-full shadow-2xl rounded p-8 sm:p-12 mt-5 mb-5 ">
                        
                        <form onClick={(e)=>e.preventDefault()} >
                            <div class="md:flex items-center  ">
                                <div class="w-full md:w-1/2 flex flex-col">
                                    <label class="font-semibold leading-none">Name</label>
                                    <input onChange={(e) => setName(e.target.value)} required placeholder="eg. Satoshi Nakamoto" type="text" class="leading-none text-gray-900 p-3 focus:outline-none focus:border-emerald-500 mt-4 bg-gray-100 border rounded border-gray-200" />
                                </div>
                                <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                                    <label class="font-semibold leading-none">Email</label>
                                    <input onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" type="email" class="leading-none text-gray-900 p-3 focus:outline-none focus:border-emerald-500 mt-4 bg-gray-100 border rounded border-gray-200" />
                                </div>
                            </div>
                            <div class="md:flex items-center mt-8">
                            <div placeholder="www.satoshi.com" class="w-full md:w-1/2 flex flex-col">
                                    <label class="font-semibold leading-none">Website</label>
                                    <input onChange={(e) => setWebsite(e.target.value)}   placeholder="www.satoshi.com" type="text" class="leading-none text-gray-900 p-3 focus:outline-none focus:border-emerald-500 mt-4 bg-gray-100 border rounded border-gray-200" />
                                </div>
                                <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                                    <label class="font-semibold leading-none">LinkedIn</label>
                                    <input onChange={(e) => setLinkedin(e.target.value)}   placeholder="linkedin.com/in/satoshinakamoto" type="text" class="leading-none text-gray-900 p-3 focus:outline-none focus:border-emerald-500 mt-4 bg-gray-100 border rounded border-gray-200" />
                                </div>

                            </div>
                            <div>
                                <div class="w-full flex flex-col mt-8">
                                    <label class="font-semibold leading-none">Expereince</label>
                                    <textarea onChange={(e) => setQ1(e.target.value)} required placeholder="Tell us about your background and previous experience in teaching and creating courses :)" type="text" class="h-40 text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-emerald-500 mt-4 bg-gray-100 border rounded border-gray-200"></textarea>
                                </div>
                            </div>
                            <div>
                                <div class="w-full flex flex-col mt-8">
                                    <label class="font-semibold leading-none">What do you hope to accomplish by using the LEARN Platform?</label>
                                    <textarea onChange={(e) => setQ2(e.target.value)} required placeholder="We would love to hear from you how we can help support you and provide the best user expereince" type="text" class="h-40 text-base leading-none text-gray-900 p-3 focus:oultine-none focus:border-emerald-500 mt-4 bg-gray-100 border rounded border-gray-200"></textarea>
                                </div>
                            </div>
                            <div class="flex items-center justify-center w-full">
                                <button onClick={submitForm} class="mt-9 font-semibold leading-none text-emerald-500 py-4 px-10 border border-2 border-emerald-500 rounded hover:bg-emerald-500 focus:ring-2 focus:ring-offset-2 hover:text-white focus:outline-none">
                                    Send Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>

        </div>



    )
}

export default becomeinstructor
