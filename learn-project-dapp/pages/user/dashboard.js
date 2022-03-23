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
      if (user.attributes.role != "student") {
        router.push("/instructor/dashboard");
      } else {
        loadUserEnrolledCourses();
      }
    }
  }, [isLoading, isAuthenticated, user]);

  const loadUserEnrolledCourses = async () => {
    const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
    const query = new Moralis.Query(EnrolledUserCourses);
    //can store in useStore and then on leaving of route reset value so it loads new value on load
    query.equalTo("user", user);
    const result = await query.find();

    if (result.length > 0) {
      setUserEnrolledCourses(result);
      const Courses = Moralis.Object.extend("Course");
      const queryCourses = new Moralis.Query(Courses);

      for (let course of result) {
        queryCourses.equalTo("objectId", course.attributes.course.id);
        await queryCourses.find();
      }

      setIsLoading(false);
    }

    // we know which courses now we need to make reuqest to moralis to grab all those courses from Course Database
  };

  return (
    <div className="  bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white ">
      <div>
        <UserNavbar />
      </div>
      {!isLoading ? (
        <div>
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
                              course.attributes.course.attributes.image_preview
                                ._url
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
              ) : (
                <div className="mb-10">
                  <AuthErrorMsg authErrorMsg="Connect Wallet to see your Courses" />
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

export default Dashboard;
