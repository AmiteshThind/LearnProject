import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import UserNavbar from "../../components/user/UserNavBar";
import Router, { useRouter } from "next/router";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/outline";
import InstructorNavbar from "../../components/instructor/InstructorNavBar";

function Revenue() {
  const [courses, setCourses] = useState([]);
  //list of courses that the user is enrolled in
  const { user, isAuthenticated } = useMoralis();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [totalAmountEarned, setTotalAmountEarned] = useState(0);
  const [totalStudentsEnrolled, setTotalStudentsEnrolled] = useState(0);
  const [totalClaimed, setTotalClaimed] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadCourses();
      loadRevenueClaimedData();
    }
  }, [isLoading, isAuthenticated, user]);

  const loadCourses = async () => {
    const Courses = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Courses);
    query.equalTo("instructor", Moralis.User.current());
    query.descending("amountEarned")
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
}

 const loadRevenueClaimedData = async()=>{
    const Instructor = Moralis.Object.extend("instructorSubmissions");
    const query = new Moralis.Query(Instructor);
    query.equalTo("user", user);
    const result = await query.find();
    if(result[0] && result[0].attributes.amountClaimed){
    setTotalClaimed(result[0].attributes.amountClaimed);
    }
    
 }

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
        <InstructorNavbar />
      </div>

      { isAuthenticated && (
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
                        {course.attributes.paid?
                        "$"+course.attributes.amountEarned
                            : "Free" }
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
  );
}

export default Revenue;
