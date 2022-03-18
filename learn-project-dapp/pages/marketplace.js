import UserNavbar from "../components/user/UserNavBar";
import { useMoralis } from "react-moralis";
import InstructorNavbar from "../components/instructor/InstructorNavBar";
import Banner from "../components/Banner";
import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { FilterIcon, SearchIcon } from "@heroicons/react/outline";
import Moralis from 'moralis'
import AdminNavBar from "../components/admin/AdminNavBar";
 

function marketplace() {
  // apart from nav the list of courses avaible and screens will be same for isntructors
  const { user, isAuthenticated } = useMoralis();
  const [isLoading,setIsLoading] = useState(true);
  const [filteredCategory,setFilteredCategory] = useState("")
  const [filteredSearch,setFilteredSearch] = useState("")
  //load all the courses with and store into courses

  const [courses,setCourses] = useState();

  useEffect(() => {
    
      loadCourses();
  }, [isLoading]);

  const loadCourses = async () => {
    const Course = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Course);
    query.equalTo("state","published");
    const result = await query.find();
    setCourses(result);
    console.log(result)
    //check to see if instructor is the one who should access the course
    setIsLoading(false);
  };

  return (
    <div className="  bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 ">
      <div>
      {isAuthenticated && user.attributes.role == "instructor" ? (
          <InstructorNavbar />
        ) : isAuthenticated && user.attributes.role =="admin" ? <AdminNavBar/> :
         (
          <UserNavbar />
        )}
        {/* <Banner title={"Marketplace"}/> */}
      </div>
      <div className="flex flex-col items-center  mx-2 ">
        <div className="  justify-between w-full  md:w-3/4 lg:w-3/4 xl:w-2/3  py-5 mx-2 my-2 flex flex-wrap  rounded-2xl ">
          <div className="bg-gradient-to-b from-teal-500    to-emerald-500  py-5  my-2 flex-col  flex-wrap w-full hover:scale-105 duration-300  pl-3 sm:w-3/5 md:w-3/5 lg:w-3/5 xl:w-3/5 shadow-md rounded-2xl  ">
            <div className="flex flex-wrap text-5xl font-extrabold text-white mx-3     ">
              <h1>Learn and Earn! </h1>
            </div>
            <div className="flex flex-wrap text-2xl text-gray-50   mx-3 my-3  ">
              <h1> Browse for courses that interest you</h1>
            </div>
          </div>
          <div className=" flex flex-col w-full sm:w-1/3 md:w-1/3 lg:w-1/3 xl:w-1/3 flex-wrap justify-center my-2 ml-8">
            <div className="flex flex-col">
              <div class="form-control">
                <div class="input-group">
                  <select class="select w-4/6 truncate  " onChange={v => setFilteredCategory(v.target.value )} >
                    <option value={""} selected >
                      Pick Category
                    </option>
                    <option value={"blockchain"}>Blockchain</option>
                    <option value={"education"}>Education</option>
                    <option value={"defi"}>Defi</option>
                    <option value={"finance"}>Finance</option>
                    <option value={"development"}>Development</option>
                    <option value={"other"}>Other</option>
                     
                  </select>
                  <button class="btn bg-gradient-to-b from-teal-500    to-emerald-500  border-none hover:brightness-95">
                   <FilterIcon className="h-4 w-4"/>   
                  </button>
                </div>
              </div>
              <div className="my-3">
                <div class="form-control ">
                  <div class="input-group ">
                    <input
                      type="text"
                      placeholder="Search…"
                      class="input truncate w-4/6"
                      onChange={v => setFilteredSearch(v.target.value)} 
                      value={filteredSearch}
                    />
                    <button class="btn bg-gradient-to-b from-teal-500    to-emerald-500 hover:brightness-95   border-none  ">
                     <SearchIcon className="h-4 w-4"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/4 lg:w-3/4 xl:w-3/4    ">
          {!isLoading ?
          <div className="grid   grid-col-1 sm:grid-cols-2  p-4  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10    ">
            
              {courses && filteredCategory ? courses.filter((course)=>course.attributes.category == filteredCategory).filter((course)=>course.attributes.name.toLowerCase().includes(filteredSearch.toLowerCase())).map((course) =>(
                              <div className=" my-2">
                              <CourseCard course={course} />
                            </div>
              ))
              
              :

              courses && filteredSearch && courses.filter((course)=>course.attributes.name.toLowerCase().includes(filteredSearch.toLowerCase())).map((course) =>(
                                            <div className=" my-2">
                                            <CourseCard course={course} />
                                          </div>
                            ))}

                  

              {courses && !filteredCategory && !filteredSearch && courses.map((course) =>(
                                            <div className=" my-2">
                                            <CourseCard course={course} />
                                          </div>
                            ))}
 
          </div>
:
<div className="w-full justify-center items-center h-[25rem]   flex">
<svg role="status" class="mr-2 w-30 h-36 text-gray-200 animate-spin dark:text-gray-600 fill-emerald-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
</svg>
</div>
}
        </div>
      </div>
    </div>
  );
}

export default marketplace;
