import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import AdminNavBar from "../../components/admin/AdminNavBar";
import defaultImage from "../../public/images/defaultImage.png";
import Moralis from "moralis";
import Link from "next/link";
import { useRouter } from "next/router";

function coursesubmissions() {
  const [coursesToApprove, setCoursesToApprove] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useMoralis();
  const [courseFeedback,setCourseFeedback] = useState("")
  const router = useRouter();

  useEffect(() => {
      
    if (isAuthenticated && user) {
        if(user.attributes.role !='admin'){
            router.push('/error/access')
        }else{
      loadCoursesToApprove();
    }
}
  }, [isLoading, isAuthenticated, user]);

  const loadCoursesToApprove = async () => {
    const Courses = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Courses);
    query.equalTo("state", "pendingApproval");
    const result = await query.find();

    if (result[0]) {
      setCoursesToApprove(result);
      setIsLoading(false);
    }
  };

  const approveCourse = async (course) => {
    const Course = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Course);
    console.log(course);
    query.equalTo("objectId", course.id);
    const result = await query.first();
    result.set("state", "published");
    result.set("feedback","")
    await result.save();

    setCoursesToApprove(
      coursesToApprove.filter(
        (approvalRequiredCourse) => approvalRequiredCourse.id != course.id
      )
    );
  };

  const rejectCourse = async (course) => {
    const Course = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Course);
    console.log(course);
    query.equalTo("objectId", course.id);
    const result = await query.first();
    result.set("state", "draft");
    result.set("feedback",courseFeedback)
    await result.save();
    setCourseFeedback("");

    setCoursesToApprove(
      coursesToApprove.filter(
        (approvalRequiredCourse) => approvalRequiredCourse.id != course.id
      )
    );
  };

  return (
      <div className="bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white">
    
      <div>
        <AdminNavBar />
      </div>
      {!isLoading && 
    <div>
      <div>
        <div className="flex justify-center ">
          {/* {JSON.stringify(
            userEnrolledCourses[0].attributes.course.attributes,
            0,
            null
          )} */}
          <div className="w-3/4 bg-zinc-800 rounded-3xl mb-5  flex-col mt-10">
            <div className="text-5xl font-extrabold pt-8 pb-4 px-8 w-full text-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 ">
              Courses Pending Approval
            </div>

            <div className="mx-5 flex flex-wrap  justify-center my-8 ">
              {coursesToApprove.map((course) => (
                <div className="w-full mx-5 my-3 border border-zinc-600 rounded-2xl p-3 ">
                  <div className="flex flex-wrap  md:flex-none  justify-between text-center w-full items-center">
                    <div className="flex-shrink-0   h-20 w-20">
                      <img
                        className="h-20 w-20 rounded-full"
                        src={course.attributes.image_preview._url}
                        alt=""
                      />
                    </div>
                    <div className="text-xl font-semibold my-3 w-full md:w-2/4    text-center ">
                      {course.attributes.name} By{" "}
                      {course.attributes.instructorName}
                    </div>

                    <div>
                      <button className="text-xl  bg-transparent border-2 border-teal-500 rounded-2xl p-3 hover:bg-gradient-to-r from-teal-500 to-teal-400 font-semibold  ">
                        <Link href={`/user/course/${course.attributes.slug}`}>
                          Go To Course
                        </Link>
                      </button>

                      <button className="text-xl cursor-pointer modal-button   bg-transparent border-2 border-red-500  rounded-2xl p-3 hover:bg-gradient-to-r from-red-500 to-rose-400 font-semibold mx-5 ">
                        <label
                          for="my-modal"
                          class=" cursor-pointer  modal-button"
                        >
                          Reject Course
                        </label>
                      </button>

                      <input
                        type="checkbox"
                        id="my-modal"
                        class="modal-toggle"
                      />
                      <div class="modal text-white">
                        <div class="modal-box bg-zinc-800">
                          <label className="  flex justify-center text-3xl font-extrabold mb-5">
                            Feedback
                          </label>
                          <textarea
                            onChange={(e) => setCourseFeedback(e.target.value)}
                            required
                            placeholder="eg. Some sections are left blank. Please delete or add to those sections."
                            type="text"
                            className=" input input-ghost text-white  w-full h-[8rem]"
                          ></textarea>

                          <div class="modal-action">
                            <label onClick={()=>rejectCourse(course)} for="my-modal" class=" cursor-pointer p-3 rounded-2xl bg-transparent border-2 border-red-500 hover:bg-gradient-to-r from-red-500 to-rose-400">
                              Reject Course
                            </label>
                            <label onClick={()=>setCourseFeedback("")} for="my-modal" class=" cursor-pointer p-3 rounded-2xl bg-transparent border-2 border-teal-500 hover:bg-gradient-to-r from-teal-500 to-teal-400">
                              Cancel
                            </label>
                          </div>
                          
                        </div>
                      </div>
                      <button
                        onClick={() => approveCourse(course)}
                        className="text-xl   bg-transparent border-2 border-emerald-500  rounded-2xl p-3 hover:bg-gradient-to-r from-emerald-500 to-teal-400 font-semibold mr-2.5 "
                      >
                        Approve Course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
}</div>);
}

export default coursesubmissions;
