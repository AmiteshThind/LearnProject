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
        ) : isAuthenticated && user.attributes.role =="admin" ? <AdminNavBar/> :
         (
          <UserNavbar />
        )}
      </div>

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
  );
}

export default Leaderboard;
