import React, { useEffect, useState, useLayoutEffect } from "react";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import Router, { useRouter } from "next/router";
import ActiveLink from "../ActiveLink";
import axios from "axios";
import Moralis from "moralis";
import useStore from "../../store/store";
import Link from "next/link";

function UserNavbar() {
  let jwtRecieved = useStore((state) => state.jwtRecieved);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, authenticate, logout } = useMoralis();

  useLayoutEffect(() => {
    async function verify() {
      console.log(jwtRecieved);
      if (isAuthenticated && !jwtRecieved) {
        const { data } = await axios.post(
          "http://localhost:8000/authenticate",
          {
            user: user,
          },
          { withCredentials: true }
        );
        if (data) {
          useStore.setState({ jwtRecieved: true });
        }
      }
    }
    verify();
  }, [isAuthenticated]);

  const logOutUser = () => {
    useStore.setState({ jwtRecieved: false });
    logout();
  };

  return (
    <div>
      <nav className="      w-full  z-50">
        <div>
          <div className="flex justify-center   items-center pt-7 pb-5  w-full ">
            <div className="ml-10 mr-5  flex lg:hidden ">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gradient-to-l from-teal-500    to-emerald-500 inline-flex p-2 rounded-xl text-white  hover:bg-emerald-500 focus:outline-none    "
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
              <div
                onClick={() => Router.push("/marketplace")}
                className=" hidden   sm:flex  md:flex lg:flex justify-center items-center   "
              >
                <div className=" sm:ml-2 md:ml-10 lg:ml-2 xl:ml-10 ml-10 font-bold text-3xl  text-shadow-sm   cursor-pointer text-emerald-400   ">
                  $<span className="text-white text-shadow-md">LEARN</span>
                </div>
              </div>
              <div className="hidden  rounded-3xl lg:block shadow-xl   ">
                <div className=" border-2 border-emerald-500  p-3 flex-wrap rounded-3xl  justify-between flex shadow-2xl  sm:space-x-2 md:space-x-2 lg:space-x-2 ">
                  <button
                    onClick={() => Router.push("/marketplace")}
                    activeClass="about"
                    to="about"
                    smooth={true}
                    offset={50}
                    duration={500}
                    className={
                      "cursor-pointer text-white dark:text-white hover:scale-105 hover:duration-150   dark:hover:text-gemerald-500 px-3 py-2 rounded-md text-md lg:text-lg  font-medium"
                    }
                  >
                    <div
                      className={
                        router.pathname == "/marketplace"
                          ? " text-emerald-300  font-extrabold"
                          : "scale-110"
                      }
                    >
                      <Link href="/marketplace">Marketplace</Link>
                    </div>
                  </button>
                  <button
                    onClick={() => Router.push("/user/dashboard")}
                    activeClass="text-green"
                    to="about"
                    smooth={true}
                    offset={50}
                    duration={500}
                    className="cursor-pointer text-white dark:text-white hover:scale-105 hover:duration-150   dark:hover:text-gemerald-500 px-3 py-2 rounded-md text-md lg:text-lg  font-medium  "
                  >
                    <div
                      className={
                        router.pathname == "/user/dashboard"
                          ? "text-emerald-300  font-extrabold : scale-110"
                          : ""
                      }
                    >
                      <Link href="/user/dashboard">Dashboard</Link>
                    </div>
                  </button>

                  <button
                    activeClass="work"
                    to="work"
                    smooth={true}
                    offset={50}
                    duration={500}
                    className="cursor-pointer text-white dark:text-white hover:scale-105 hover:duration-150   dark:hover:text-gemerald-500 px-3 py-2 rounded-md text-md lg:text-lg  font-medium"
                  >
                    <div
                      className={
                        router.pathname == "/user/staking"
                          ? " text-emerald-300  font-extrabold : scale-110"
                          : ""
                      }
                    >
                      <Link href="/user/staking">Staking</Link>
                    </div>
                  </button>

                  <button
                    activeClass="Services"
                    to="work"
                    smooth={true}
                    offset={50}
                    duration={500}
                    className="cursor-pointer text-white dark:text-white hover:scale-105 hover:duration-150   dark:hover:text-gemerald-500 px-3 py-2 rounded-md text-md lg:text-lg  font-medium"
                  >
                    <div
                      className={
                        router.pathname == "/user/profile"
                          ? " text-emerald-300  font-extrabold : scale-110"
                          : ""
                      }
                    >
                      <Link href="/user/profile">Profile</Link>
                    </div>
                  </button>

                  <button
                    activeClass="Services"
                    to="work"
                    smooth={true}
                    offset={50}
                    duration={500}
                    className="cursor-pointer text-white dark:text-white hover:scale-105 hover:duration-150   dark:hover:text-gemerald-500 px-3 py-2 rounded-md text-md lg:text-lg  font-medium"
                  >
                    <div
                      className={
                        router.pathname == "/user/leaderboard"
                          ? " text-emerald-300  font-extrabold : scale-110"
                          : ""
                      }
                    >
                      <Link href="/user/leaderboard">Leaderboard</Link>
                    </div>
                  </button>

                  <button
                    onClick={() => Router.push("/user/becomeinstructor")}
                    activeClass="Services"
                    to="work"
                    smooth={true}
                    offset={50}
                    duration={500}
                    className="cursor-pointer text-white dark:text-white hover:scale-105 hover:duration-150   dark:hover:text-gemerald-500 px-3 py-2 rounded-md text-md lg:text-lg  font-medium"
                  >
                    <div
                      className={
                        router.pathname == "/user/becomeinstructor"
                          ? " text-emerald-300  font-extrabold : scale-110"
                          : ""
                      }
                    >
                      <Link href="/user/leaderboard">Become Instructor</Link>
                    </div>
                  </button>
                </div>
              </div>
              <div className="">
                <button
                  activeClass="contact"
                  to="contact"
                  smooth={true}
                  onClick={!isAuthenticated ? authenticate : logOutUser}
                  offset={50}
                  duration={500}
                  className="sm:mr-2 md:mr-2 lg:mr-2 xl:mr-10 mr-10  shadow-md  hover:bg-emerald-500 hover:text-white border border-emerald-500  hover:scale-105  text-emerald-500   transition duration-400 ease-in-out  cursor-pointer max-w-[10rem] sm:max-w-[10rem] md:max-w-[10rem] lg:max-w-[10rem] xl:max-w-[10rem]  rounded-2xl   dark:text-white px-3 truncate py-3 text-md font-medium "
                >
                  {isAuthenticated
                    ? user.attributes.ethAddress
                    : "Connect Wallet"}
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
            <div className="p-2" id="mobile-menu">
              <div
                ref={ref}
                className="  bg-gradient-to-b from-zinc-900 to-slate-800 rounded-2xl  px-2 pt-2 pb-3 space-y-1 sm:px-3"
              >
                <button
                  href="/marketplace"
                  activeClass="home"
                  to="home"
                  smooth={true}
                  offset={50}
                  duration={500}
                  className="cursor-pointer hover:bg-emerald-500 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  <div
                    className={
                      router.pathname == "/marketplace"
                        ? " text-emerald-300  font-extrabold"
                        : "scale-110"
                    }
                  >
                    <Link href="/marketplace">Marketplace</Link>
                  </div>
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
                  onClick={() => Router.push("/user/dashboard")}
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

export default UserNavbar;
