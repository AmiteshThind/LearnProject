import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import UserNavbar from "../../components/user/UserNavBar";
import Router, { useRouter } from "next/router";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/outline";
import Image from "next/image";
import defaultImage from "../../public/images/defaultImage.png";
import AuthErrorMsg from "../../components/AuthErrorMsg";
import InstructorNavbar from "../../components/instructor/InstructorNavBar";
import AdminNavBar from "../../components/admin/AdminNavBar";

function Leaderboard() {
  //list of courses that the user is enrolled in
  const { user, isAuthenticated } = useMoralis();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isLoading, isAuthenticated, user]);

  const loadUserData = async () => {
    const Leaderboard = Moralis.Object.extend("Leaderboard");
    const query = new Moralis.Query(Leaderboard);
    query.equalTo("displayOnLeaderboard", true);
    query.greaterThan("totalRewards", 0);
    query.descending("totalRewards");
    const result = await query.find();
    console.log(result);
    if (result[0]) {
      setStudents(result);
      setIsLoading(false);
    }
  };

  return (
    <div className="  bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white ">
      <div>
        {isAuthenticated && user.attributes.role == "instructor" ? (
          <InstructorNavbar />
        ) : isAuthenticated && user.attributes.role == "admin" ? (
          <AdminNavBar />
        ) : (
          <UserNavbar />
        )}
      </div>
      {!isLoading ? (
        <div>
          <div className="flex mx-4 sm:mx-0 justify-center ">
            {/* {JSON.stringify(
            userEnrolledCourses[0].attributes.course.attributes,
            0,
            null
          )} */}
            <div className="w-full xl:w-6/12 mx-4 bg-zinc-800 rounded-3xl  flex-col mt-10">
              <div className="text-4xl flex-wrap   text-center text-white  font-extrabold pt-8 pb-4 px-8 justify-center ">
                LEARN Leaderboard
              </div>
              {isAuthenticated ? (
                <div className="mx-5 flex flex-wrap   justify-center my-8 ">
                  {students.map((student, index) => (
                    <div className="w-full border border-zinc-600 p-3 rounded-3xl   my-3  ">
                      <div className="flex flex-wrap  justify-between items-center">
                        <div className="flex mx-5 w-full xl:w-1/4 justify-center items-center ">
                          <div className="text-3xl mr-2  xl:mr-5 font-extrabold">
                            {index + 1}.
                          </div>
                          <div class="avatar">
                            <div className=" rounded-full   h-20 w-20">
                              <Image
                                src={
                                  student.attributes.profilePicture != undefined
                                    ? student.attributes.profilePicture._url
                                    : defaultImage
                                }
                                className="hover:opacity-50 w-2 h-2"
                                height={250}
                                width={250}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-semibold my-3 w-full xl:w-2/5 text-center  truncate  ">
                          {student.attributes.username}
                        </div>
                        <div className="text-xl font-semibold justify-center flex w-full xl:w-1/5   ">
                          <span className="text-transparent  bg-clip-text bg-gradient-to-br flex items-center from-teal-500 to-emerald-500 brightness-110 ">
                            {student.attributes.totalRewards} LEARN
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-10">
                  <AuthErrorMsg
                    authErrorMsg={"Connect Wallet to see Leaderboard"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isAuthenticated && (
        <div className="w-full justify-center items-center h-[25rem]   flex">
        <svg role="status" class="mr-2 w-30 h-36 text-gray-200 animate-spin dark:text-gray-600 fill-emerald-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
