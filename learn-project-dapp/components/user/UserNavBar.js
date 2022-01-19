import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import {useMoralis} from 'react-moralis'
import Router, {useRouter} from "next/router";
import { Link } from "react-scroll";
import ActiveLink from "../ActiveLink";
import Tilt from 'react-parallax-tilt';

function UserNavbar() {
	const [isOpen, setIsOpen] = useState(false);
    const {user,isAuthenticated,authenticate,logout} = useMoralis();

	

	return (
		<div>
			<nav className=" shadow-md  bg-white dark:bg-zinc-700 w-full  z-50">
				<div  >
					<div className="flex items-center h-20 w-full">
						<div className="flex items-center  mx-20  justify-between w-full">
						<Tilt>
							<div  onClick={() => Router.push('/')} className="flex justify-center items-center flex-shrink-0 ">
								 
								<h1 className=" font-bold text-3xl cursor-pointer text-emerald-500">
									$L<span className="text-gray-800 dark:text-white">EARN</span>
								</h1>
								 
                               
							</div>
							</Tilt>
							<div className="hidden md:block">
								<div className="ml-10 flex items-baseline space-x-4">
								<button
                                    onClick={() => Router.push('/marketplace')}
										activeClass="about"
										to="about"
										smooth={true}
										offset={50}
										duration={500}
										className="cursor-pointer hover:text-emerald-500 text-black dark:text-white dark:hover:text-emerald-500  px-3 py-2 rounded-md text-md font-medium"
									>
										 <ActiveLink href="/marketplace">Marketplace</ActiveLink>
									</button>
									<button
                                        onClick={() => Router.push('/dashboard')}
										activeClass="text-green"
										to="about"
										smooth={true}
										offset={50}
										duration={500}
										className="cursor-pointer text-black dark:text-white hover:text-emerald-500 dark:hover:text-emerald-500 font-semibold px-3 py-2 text-md  "
									>
                                        <ActiveLink href="/user/dashboard">Dashboard</ActiveLink>
										 
									</button>
 
									<button
										activeClass="work"
										to="work"
										smooth={true}
										offset={50}
										duration={500}
										className="cursor-pointer   text-black dark:text-white hover:text-emerald-500 dark:hover:text-emerald-500 px-3 py-2 rounded-md text-md font-medium"
									>
										<ActiveLink href="/staking">Staking</ActiveLink>
									</button>

									<button
										activeClass="Services"
										to="work"
										smooth={true}
										offset={50}
										duration={500}
										className="cursor-pointer text-black dark:text-white hover:text-emerald-500 dark:hover:text-gemerald-500 px-3 py-2 rounded-md text-md font-medium"
									>
										<ActiveLink href="/myprofile">Profile</ActiveLink>
									</button>

                                    <button
                                        
                                        onClick={() => Router.push('/user/becomeinstructor')}
										activeClass="active"
										to="about"
										smooth={true}
										offset={50}
										duration={500}
										className=" mx-10 cursor-pointer max-w-[12rem]  border-2  border-emerald-500 text-emerald-500 dark:text-white px-5 truncate py-3 rounded-md text-md font-medium hover:text-white hover:bg-emerald-500"
									>
										 Become Instructor 
									</button>

									<button
										activeClass="contact"
										to="contact"
										smooth={true}
                                        onClick={!isAuthenticated? authenticate : logout}
										offset={50}
										duration={500}
										className="cursor-pointer max-w-[12rem]  border-2  border-emerald-500 text-emerald-500 dark:text-white px-5 truncate py-3 rounded-md text-md font-medium hover:text-white hover:bg-emerald-500"
									>
									    {isAuthenticated ? user.attributes.ethAddress : 'Connect Wallet'} 
									</button>
								</div>
							</div>
						</div>
						<div className="mr-10 flex md:hidden ">
							<button
								onClick={() => setIsOpen(!isOpen)}
								type="button"
								className="bg-emerald-500 inline-flex items-center justify-center p-2 rounded-md text-white  hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-500 focus:ring-white"
								aria-controls="mobile-menu"
								aria-expanded="false"
							>
								<span className="sr-only">Open main menu</span>
								{!isOpen ? (
									<svg
										className="block h-6 w-6"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								) : (
									<svg
										className="block h-6 w-6"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>

				<Transition
					show={isOpen}
					enter="transition ease-out duration-100 transform"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="transition ease-in duration-75 transform"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					{(ref) => (
						<div className="md:hidden" id="mobile-menu">
							<div
								ref={ref}
								className="bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3"
							>
								<button
									href="/home"
									activeClass="home"
									to="home"
									smooth={true}
									offset={50}
									duration={500}
									className="cursor-pointer hover:bg-emerald-500 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium"
								>
									  <ActiveLink href="/user/dashboard">Dashboard</ActiveLink>
								</button>
								<button
									href="/about"
									activeClass="about"
									to="about"
									smooth={true}
									offset={50}
									duration={500}
									className="cursor-pointer hover:bg-emerald-500 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium"
								>
								 <ActiveLink href="/login">My Courses</ActiveLink>
								</button>

								<button
									href="/work"
									activeClass="work"
									to="work"
									smooth={true}
									offset={50}
									duration={500}
									className="cursor-pointer hover:bg-emerald-500 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium"
								>
									<ActiveLink href="/staking">Staking</ActiveLink>
								</button>
								<button
									href="/services"
									activeClass="services"
									to="services"
									smooth={true}
									offset={50}
									duration={500}
									className="cursor-pointer hover:bg-emerald-500 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium"
								>
									<ActiveLink href="/myprofile">Profile</ActiveLink>
								</button>
                                <button
                                        
                                        onClick={() => Router.push('/user/dashboard')}
										activeClass="active"
										to="about"
										smooth={true}
										offset={50}
										duration={500}
										className="cursor-pointer hover:bg-emerald-500 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium"
									>
										<ActiveLink href="/instructor">Become Instructor</ActiveLink>
									</button>

								<button
									href="/contact"
									activeClass="work"
									to="work"
                                    onClick={!isAuthenticated? authenticate : logout}
									smooth={true}
									offset={50}
									duration={500}
									className="cursor-pointer hover:bg-emerald-500 text-black truncate hover:text-white block px-4 py-2 rounded-md text-base font-large"
								>
								 {isAuthenticated ? user.attributes.ethAddress : 'Connect Wallet'} 
								</button>
							</div>
						</div>
					)}
				</Transition>
			</nav>
		</div>
	);
}

export default UserNavbar;