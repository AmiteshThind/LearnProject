import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import UserNavbar from "../../components/user/UserNavBar";
import Router, { useRouter } from "next/router";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/outline";

function Leaderboard() {
  
  //list of courses that the user is enrolled in
  const { user, isAuthenticated } = useMoralis();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
   

  useEffect(() => {
    if (isAuthenticated && user) {
        loadUserData();
    }
  }, [isLoading, isAuthenticated, user]);

  const loadUserData = async()=>{
    const Users = Moralis.Object.extend("User");
    const query = new Moralis.Query(Users); 
    const result = await query.find();
    if(result[0]){
        console.log(result[1])
        
    }

  }

  return (
    <div className="  bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white ">
    <div>
        {isAuthenticated && user.attributes.role == "instructor" ? (
          <InstructorNavbar />
        ) : (
          <UserNavbar />
        )}
      </div>

      
        <div className="flex justify-center ">
          {/* {JSON.stringify(
            userEnrolledCourses[0].attributes.course.attributes,
            0,
            null
          )} */}
          <div className="w-3/4 bg-zinc-800 rounded-3xl  flex-col mt-10">
            <div className="text-4xl font-extrabold pt-8 pb-4 px-8 justify-center ">
              Learning Leaderboard
            </div>
            <div className="mx-5 flex flex-wrap  justify-center my-8 ">
              
                <div className="w-full mx-5 my-3  ">
                  <div className="flex flex-wrap  justify-between items-center">
                    <div className="flex-shrink-0   h-20 w-20">
                      <img
                        className="h-20 w-20 rounded-full"
                         
                        alt=""
                      />
                    </div>
                    <div className="text-xl font-semibold my-3 w-2/4 truncate  ">
                    ff
                    </div>
                    <div className="text-xl font-semibold w-1/4 ">
                      <span className="text-transparent  bg-clip-text bg-gradient-to-br flex items-center from-teal-500 to-emerald-500 brightness-110 ">
                        <PlusCircleIcon className="w-5 h-5 mx-1 my-3 sm:my-0 text-emerald-500" />
                         $LEARN
                      </span>
                    </div>
                    <div
                       
                      className="btn bg-gradient-to-br  from-teal-500 to-emerald-500  hover:scale-95 my-3 sm:my-0  "
                    >
                      Go To Course
                    </div>
                  </div>
                </div>
          
            </div>
            
          </div>
        </div>
      
    </div>
  );
}

export default Leaderboard;
