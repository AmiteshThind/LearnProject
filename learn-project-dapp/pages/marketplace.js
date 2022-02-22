import UserNavbar from "../components/user/UserNavBar";
import { useMoralis } from "react-moralis";
import InstructorNavbar from "../components/instructor/InstructorNavBar";
import Banner from "../components/Banner";
import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { FilterIcon, SearchIcon } from "@heroicons/react/outline";
import Moralis from 'moralis'


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
    query.equalTo("published",true);
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
        ) : (
          <UserNavbar />
        )}
        {/* <Banner title={"Marketplace"}/> */}
      </div>
      <div className="flex flex-col items-center  mx-2 ">
        <div className="  justify-between w-full  md:w-3/4 lg:w-3/4 xl:w-2/3  py-5 mx-2 my-2 flex flex-wrap  rounded-2xl">
          <div className="bg-gradient-to-b from-teal-500    to-emerald-500  py-5  my-2 flex-col  flex-wrap w-full   pl-3 sm:w-3/5 md:w-3/5 lg:w-3/5 xl:w-3/5 shadow-md rounded-2xl  ">
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
        </div>
      </div>
    </div>
  );
}

export default marketplace;
