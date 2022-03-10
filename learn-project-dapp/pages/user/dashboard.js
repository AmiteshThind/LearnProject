import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import UserNavbar from "../../components/user/UserNavBar";
import Router, { useRouter } from "next/router";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/outline";
import AuthErrorMsg from "../../components/AuthErrorMsg";

function Dashboard() {
  const [userEnrolledCourses, setUserEnrolledCourses] = useState([]);
  //list of courses that the user is enrolled in
  const { user, isAuthenticated } = useMoralis();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
   

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserEnrolledCourses();
      if(user.attributes.role == "instructor"){
        router.push("/instructor/dashboard")
      }
    }
  }, [isLoading, isAuthenticated, user]);

   const loadUserEnrolledCourses = async () => {
    const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
    const query = new Moralis.Query(EnrolledUserCourses);
//can store in useStore and then on leaving of route reset value so it loads new value on load and stores 
    query.equalTo("user", user);
    const result = await query.find();

    if (result[0] != undefined) {
      console.log(result);
      setUserEnrolledCourses(result);
      setIsLoading(false);
    }

    // we know which courses now we need to make reuqest to moralis to grab all those courses from Course Database
  };

  return (
    <div className="  bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white ">
    <div>
        
          <UserNavbar />
    
      </div>
     
    
        <div className="flex justify-center ">
          {/* {JSON.stringify(
            userEnrolledCourses[0].attributes.course.attributes,
            0,
            null
          )} */}
          <div className="w-3/4 bg-zinc-800 rounded-3xl  flex-col mt-10">
            <div className="text-4xl font-extrabold pt-8 pb-4 px-8 mb-2 justify-center text-center ">
              My Courses
            </div>
            {isAuthenticated ? (
            <div className="mx-5 flex flex-wrap  justify-center my-8 ">
              {userEnrolledCourses.map((course) => (
                <div className="w-full mx-5 my-3  ">
                  <div className="flex flex-wrap  justify-between items-center">
                    <div className="flex-shrink-0   h-20 w-20">
                      <img
                        className="h-20 w-20 rounded-full"
                        src={
                          course.attributes.course.attributes.image_preview._url
                        }
                        alt=""
                      />
                      
                    </div>
                    <div className="text-xl font-semibold my-3 w-2/4 truncate  ">
                      {course.attributes.course.attributes.name}
                    </div>
                    <div className="text-xl font-semibold w-1/4 ">
                      <span className="text-transparent  bg-clip-text bg-gradient-to-br flex items-center from-teal-500 to-emerald-500 brightness-110 ">
                        <PlusCircleIcon className="w-5 h-5 mx-1 my-3 sm:my-0 text-emerald-500" />
                        {course.attributes.rewardsEarned} $LEARN
                      </span>
                    </div>
                    <div
                      onClick={() => {
                        Router.push(
                          `/user/course/${course.attributes.course.attributes.slug}`
                        );
                      }}
                      className="btn bg-gradient-to-br  from-teal-500 to-emerald-500  hover:scale-95 my-3 sm:my-0  "
                    >
                      Go To Course
                    </div>
                  </div>
                </div>
              ))}
            </div>
              ):
                 <div className="mb-10">
                <AuthErrorMsg authErrorMsg="Connect Wallet to see your Courses"/>
              </div>
              }
          </div>
        </div>
     
    </div>
  );
}

export default Dashboard;
