import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import UserNavbar from "../../components/user/UserNavBar";
import Router, { useRouter } from "next/router";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/outline";
import InstructorNavbar from "../../components/instructor/InstructorNavBar";
import AdminNavBar from "../../components/admin/AdminNavBar";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  //list of courses that the user is enrolled in
  const { user, isAuthenticated } = useMoralis();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [totalAmountEarned, setTotalAmountEarned] = useState(0);
  const [totalStudentsEnrolled, setTotalStudentsEnrolled] = useState(0);
  const [totalClaimed, setTotalClaimed] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.attributes.role == "student") {
        router.push("/error/access");
      }
      loadCourses();
      loadRevenueClaimedData();
      if (user.attributes.role == "admin") {
        setIsLoading(false);
      }
    }
  }, [isLoading, isAuthenticated, user]);

  const loadCourses = async () => {
    const Courses = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Courses);
    query.equalTo("instructor", Moralis.User.current());
    query.descending("amountEarned");
    const result = await query.find();

    if (result[0] != undefined) {
      setCourses(result);
      let totalAmount = 0;
      let totalStudents = 0;

      for (let course of result) {
        totalAmount += course.attributes.amountEarned;
        totalStudents += course.attributes.studentsEnrolled;
      }

      setTotalAmountEarned(totalAmount);
      setTotalStudentsEnrolled(totalStudents);

      setIsLoading(false);
    }
  };

  const loadRevenueClaimedData = async () => {
    const Instructor = Moralis.Object.extend("instructorSubmissions");
    const query = new Moralis.Query(Instructor);
    query.equalTo("user", user);
    const result = await query.find();
    if (result[0] && result[0].attributes.amountClaimed) {
      setTotalClaimed(result[0].attributes.amountClaimed);
    }
  };

  // we know which courses now we need to make reuqest to moralis to grab all those courses from Course Database

  const claim = async () => {
    console.log("Claim");
    const Instructor = Moralis.Object.extend("instructorSubmissions");
    const query = new Moralis.Query(Instructor);
    query.equalTo("user", user);
    const object = await query.first();
    object.set("amountClaimed", totalAmountEarned);
    setTotalClaimed(totalAmountEarned);
    await object.save();
  };

  return (
    <div className="  bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white ">
      <div>
        {isAuthenticated && user.attributes.role == "admin" ? (
          <AdminNavBar />
        ) : (
          <InstructorNavbar />
        )}
      </div>
      {!isLoading ? (
        <div>
          {isAuthenticated && (
            <div className="flex justify-center ">
              {/* {JSON.stringify(
            userEnrolledCourses[0].attributes.course.attributes,
            0,
            null
          )} */}
              <div className="w-3/4 bg-zinc-800 rounded-3xl mb-5  flex-col mt-10">
                <div className="text-5xl font-extrabold pt-8 pb-4 px-8 w-full text-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 ">
                  My Revenue
                </div>
                <div className=" w-full justify-center flex-wrap flex md:mt-10">
                  <div class="   md:mx-10 w-full lg:w-1/6 text-center my-3 mx-5">
                    <div class="stat bg-gradient-to-b from-emerald-500 to-teal-400    rounded-3xl py-10   ">
                      <div class="stat-title">Total Students</div>
                      <div class="stat-value text-3xl text-zinc-800">
                        {totalStudentsEnrolled}
                      </div>
                    </div>
                  </div>
                  <div class=" md:mx-10 text-center w-full lg:w-1/6 my-3 mx-5 ">
                    <div class="  stat bg-gradient-to-b from-emerald-500 to-teal-400    rounded-3xl py-10 ">
                      <div class="stat-title">Amount Earned</div>
                      <div class="stat-value text-3xl text-zinc-800">
                        ${totalAmountEarned}
                      </div>
                    </div>
                  </div>
                  <div class=" md:mx-10 text-center w-full lg:w-1/6 my-3 mx-5 ">
                    <div class="  stat bg-gradient-to-b from-emerald-500 to-teal-400    rounded-3xl py-10 ">
                      <div class="stat-title">Amount Claimed</div>
                      <div class="stat-value text-3xl text-zinc-800">
                        ${totalClaimed}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={claim}
                    class=" hover:scale-95 duration-150  md:mx-10   text-center w-full lg:w-1/6 my-3 mx-5 "
                  >
                    <div class="stat border border-teal-500 hover:border-emerald-500 hover:bg-teal-500 bg-transparent text-white    rounded-3xl py-10 ">
                      <div class="stat-title text-white">Claim</div>
                      <div class="stat-value text-white text-3xl  ">
                        ${totalAmountEarned - totalClaimed}
                      </div>
                    </div>
                  </button>
                </div>
                <div className="mx-5 flex flex-wrap  justify-center my-8 ">
                  {courses.map((course) => (
                    <div className="w-full mx-5 my-3 border border-zinc-600 rounded-2xl p-3 ">
                      <div className="flex flex-wrap  md:flex-none  justify-center text-center w-full items-center">
                        <div className="flex-shrink-0   h-20 w-20">
                          <img
                            className="h-20 w-20 rounded-full"
                            src={course.attributes.image_preview._url}
                            alt=""
                          />
                        </div>
                        <div className="text-xl font-semibold my-3 w-full md:w-2/4   text-center ">
                          {course.attributes.name}
                        </div>

                        <div className="text-xl font-semibold justify-center flex w-full md:w-1/4 text-center">
                          <span className="text-transparent  bg-clip-text bg-gradient-to-br flex items-center from-teal-500 to-emerald-500 brightness-110 ">
                            {course.attributes.studentsEnrolled} Students
                          </span>
                        </div>
                        <div className="text-xl font-semibold  ">
                          <span className="text-transparent  bg-clip-text text-center bg-gradient-to-br flex items-center from-teal-500 to-emerald-500 brightness-110 ">
                            {course.attributes.paid
                              ? "$" + course.attributes.amountEarned
                              : "Free"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full justify-center items-center h-[25rem]   flex">
          <svg
            role="status"
            class="mr-2 w-30 h-36 text-gray-200 animate-spin dark:text-gray-600 fill-emerald-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
