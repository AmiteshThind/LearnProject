import React, { useEffect, useState, useLayoutEffect } from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { useMoralis } from 'react-moralis'
import Router, { useRouter } from "next/router";
import { Link } from "react-scroll";
import ActiveLink from "../ActiveLink";
import axios from 'axios'
import Moralis from "moralis";
import useStore from "../../store/store"


function InstructorNavbar() {

	let jwtRecieved = useStore(state => state.jwtRecieved)

	const [isOpen, setIsOpen] = useState(false);
	const { user, isAuthenticated, authenticate, logout } = useMoralis();

	useLayoutEffect(() => {

		async function verify() {
			console.log(jwtRecieved)
			if (isAuthenticated && !jwtRecieved) {
				const { data } = await axios.post("http://localhost:8000/authenticate", {
					user: user
				}, { withCredentials: true })
				if (data) {
					useStore.setState({ jwtRecieved: true })

				}
			}
		}
		verify();
	}, [isAuthenticated])

	const logOutUser = () => {
		useStore.setState({ jwtRecieved: false })
		logout();

	}

	return (
		<div>

			<nav className="   dark:bg-zinc-700 w-full  z-50">
				<div  >
					<div className="flex justify-center   items-center pt-5 pb-5  w-full ">

					<div className="ml-10 mr-5 flex lg:hidden ">
							<button
								onClick={() => setIsOpen(!isOpen)}
								type="button"
								className="bg-emerald-500 inline-flex     p-2 rounded-md text-white  hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerald-500 focus:ring-white"
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

						<div className="flex items-center justify-center  sm:justify-between md:justify-between lg:justify-between xl:justify-between  w-full">
							<div onClick={() => Router.push('/marketplace')} className=" hidden  sm:flex  md:flex lg:flex justify-center items-center   ">
								<h1 className=" ml-5 font-bold text-3xl     cursor-pointer text-green-500  drop-shadow-sm  ">
									$LEARN
								</h1>
							</div>
							<div className="hidden lg:block shadow-lg shadow-green-500/50 rounded-lg  ">
								<div className=" border-4 border-green-500 rounded-lg p-3 flex-wrap space-x-4">
									<button
										onClick={() => Router.push('/marketplace')}
										activeClass="about"
										to="about"
										smooth={true}
										offset={50}
										duration={500}
										className={" shadow-emerald-500/100 cursor-pointer hover:text-emerald-500 text-black dark:text-white dark:hover:text-emerald-500  px-3 py-2  rounded-md text-md font-medium" }
										
									>
										<ActiveLink href="/marketplace">Marketplace</ActiveLink>
									</button>
									<button
										onClick={() => Router.push('/instructor/dashboard')}
										activeClass="text-green"
										to="about"
										smooth={true}
										offset={50}
										duration={500}
										className="cursor-pointer text-black dark:text-white hover:text-emerald-500 dark:hover:text-emerald-500 font-semibold px-3 py-2 text-md  "
									>
										<ActiveLink href="/instructor/dashboard">Dashboard</ActiveLink>

									</button>
									<button
										onClick={() => Router.push('/mycourses')}
										activeClass="about"
										to="about"
										smooth={true}
										offset={50}
										duration={500}
										className="cursor-pointer hover:text-emerald-500 text-black dark:text-white dark:hover:text-emerald-500  px-3 py-2 rounded-md text-md font-medium"
									>
										<ActiveLink href="/login">Revenue</ActiveLink>
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

										onClick={() => Router.push('/instructor/course/create')}
										activeClass="active"
										to="about"
										smooth={true}
										offset={50}
										duration={500}
										className="cursor-pointer text-black dark:text-white hover:text-emerald-500 dark:hover:text-gemerald-500 px-3 py-2 rounded-md text-md font-medium"
									>

										Create Course
									</button>
									</div>
									</div>
									<div>
									<button
										activeClass="contact"
										to="contact"
										smooth={true}
										onClick={!isAuthenticated ? authenticate : logOutUser}
										offset={50}
										duration={500}
										className="mr-5 shadow-lg shadow-green-500/50 cursor-pointer max-w-[10rem] sm:max-w-[10rem] md:max-w-[10rem] lg:max-w-[10rem] xl:max-w-[10rem]  border-4  border-green-500 text-green-500 dark:text-white px-3 truncate py-3 rounded-md text-md font-medium hover:text-white hover:bg-emerald-500"
									>
										{isAuthenticated ? user.attributes.ethAddress : 'Connect Wallet'}
									</button>
								</div>
						 
							
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
						<div className="" id="mobile-menu">
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

							</div>
						</div>
					)}
				</Transition>
			</nav>
		</div>
	);
}

export default InstructorNavbar;