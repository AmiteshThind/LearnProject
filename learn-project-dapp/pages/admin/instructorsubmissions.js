import Moralis from "moralis";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import AdminNavBar from "../../components/admin/AdminNavBar";

function instructorsubmissions() {
  const { user, isAuthenticated } = useMoralis();
  const [instructorSubmissions, setInstructorSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.attributes.role != "admin") {
        router.push("/error/access");
      } else {
        loadInstructorSubmissions();
      }
    }
  }, [isAuthenticated, isLoading, user]);

  const loadInstructorSubmissions = async () => {
    const InstructorSubmissions = Moralis.Object.extend(
      "instructorSubmissions"
    );
    const query = new Moralis.Query(InstructorSubmissions);
    query.equalTo("approvalStatus", "pending");
    const result = await query.find();
    if (result[0] != undefined) {
      setInstructorSubmissions(result);
    }
  };

  const approveInstructor = async (instructor) => {
    const instructorApplications = Moralis.Object.extend(
      "instructorSubmissions"
    );
    const query = new Moralis.Query(instructorApplications);
    query.equalTo("objectId", instructor.id);
    const newInstructor = await query.first();

    newInstructor.set("approvalStatus", "approved");

    await newInstructor.save();

    let updatedInstructorSubmissions = instructorSubmissions.filter(
      (submission) => submission.attributes.id != instructor.attributes.id
    );

    //this logic will be replaced with ACL's
    const Users = Moralis.Object.extend("_User");
    const queryUsers = new Moralis.Query(Users);
    queryUsers.equalTo("objectId", instructor.attributes.user.id);
    console.log(instructor.attributes.user.id);
    const userToUpdate = await queryUsers.first();
    userToUpdate.set("role", "instructor");
    await userToUpdate.save();

    const Leaderboard = Moralis.Object.extend("Leaderboard");
    const leaderboardQuery = new Moralis.Query(Leaderboard);
    console.log(instructor.attributes.instructorAddress);
    leaderboardQuery.equalTo(
      "address",
      instructor.attributes.instructorAddress
    );
    const instructorInLeaderboard = await leaderboardQuery.first();
    instructorInLeaderboard.set("displayOnLeaderboard", false);
    await instructorInLeaderboard.save();
    setInstructorSubmissions(updatedInstructorSubmissions);
  };

  const rejectInstructor = async (instructor) => {
    const instructorApplications = Moralis.Object.extend(
      "instructorSubmissions"
    );
    const query = new Moralis.Query(instructorApplications);
    query.equalTo("objectId", instructor.id);
    const instructorApplication = await query.first();
    await instructorApplication.destroy();

    let updatedInstructorSubmissions = instructorSubmissions.filter(
      (submission) => submission.attributes.id != instructor.attributes.id
    );

    setInstructorSubmissions(updatedInstructorSubmissions);
  };

  return (
    <div>
      {!isLoading && (
        <div className="  bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white ">
          <div>
            <AdminNavBar />
          </div>

          <div>
            <div className="flex justify-center ">
              {/* {JSON.stringify(
            userEnrolledCourses[0].attributes.course.attributes,
            0,
            null
          )} */}
              <div className="w-3/4 bg-zinc-800 rounded-3xl mb-5  flex-col mt-10">
                <div className="text-5xl font-extrabold pt-8 pb-4 px-8 w-full text-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 ">
                  Instructor Applications
                </div>

                <div className="mx-5 flex flex-wrap  justify-center my-8 ">
                  {instructorSubmissions.map((instructor) => (
                    <div className="w-full mx-5 my-3 border border-zinc-600 rounded-2xl p-3 ">
                      <div className="flex flex-wrap  md:flex-none  justify-between  w-full items-center">
                        <div className="text-xl font-semibold my-3 w-full md:w-1/4    ">
                          {instructor.attributes.name}
                        </div>

                        <div>
                          <button className="text-xl  bg-transparent border-2 border-teal-500 rounded-2xl p-3 hover:bg-gradient-to-r from-teal-500 to-teal-400 font-semibold  ">
                            <label
                              for="my-modal2"
                              class=" cursor-pointer  modal-button"
                            >
                              View Submission
                            </label>
                          </button>

                          <input
                            type="checkbox"
                            id="my-modal2"
                            class="modal-toggle"
                          />
                          <div class="modal text-white">
                            <div class="modal-box bg-zinc-800">
                              <label className="  flex justify-center text-3xl font-extrabold mb-5">
                                {instructor.attributes.name}'s Submission
                              </label>

                              <form onClick={(e) => e.preventDefault()}>
                                <div class="md:flex items-center   ">
                                  <div class="w-full md:w-1/2 flex flex-col  ">
                                    <label class="font-semibold leading-none text-white">
                                      Name*
                                    </label>
                                    <input
                                      value={instructor.attributes.name}
                                      disabled
                                      required
                                      type="text"
                                      class="border border-zinc-600 bg-transparent p-3 rounded-xl  mt-2  "
                                    />
                                  </div>
                                  <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                                    <label class="font-semibold leading-none text-white">
                                      Email*
                                    </label>
                                    <input
                                      value={instructor.attributes.email}
                                      disabled
                                      required
                                      type="email"
                                      class="border border-zinc-600 bg-transparent p-3 rounded-xl   mt-2"
                                    />
                                  </div>
                                </div>
                                <div class="md:flex items-center mt-8">
                                  <div class="w-full md:w-1/2 flex flex-col">
                                    <label class="font-semibold leading-none text-white">
                                      Telegram Id
                                    </label>
                                    <input
                                      disabled
                                      value={instructor.attributes.telegramId}
                                      type="text"
                                      class="border border-zinc-600 bg-transparent p-3 rounded-xl    mt-2"
                                    />
                                  </div>
                                  <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                                    <label class="font-semibold leading-none text-white">
                                      LinkedIn
                                    </label>
                                    <input
                                      disabled
                                      value={instructor.attributes.linkedIn}
                                      type="text"
                                      class="border border-zinc-600 bg-transparent p-3 rounded-xl   mt-2"
                                    />
                                  </div>
                                </div>
                                <div class="md:flex items-center mt-8">
                                  <div
                                    placeholder="www.satoshi.com"
                                    class="w-full md:w-1/2 flex flex-col"
                                  >
                                    <label class="font-semibold leading-none text-white">
                                      Twitter
                                    </label>
                                    <input
                                      disabled
                                      value={instructor.attributes.twitter}
                                      type="text"
                                      class="border border-zinc-600 bg-transparent p-3 rounded-xl  mt-2 "
                                    />
                                  </div>
                                  <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                                    <label class="font-semibold leading-none text-white">
                                      Portfolio
                                    </label>
                                    <input
                                      disabled
                                      value={instructor.attributes.website}
                                      type="text"
                                      class="border border-zinc-600 bg-transparent p-3 rounded-xl  mt-2"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div class="w-full flex flex-col mt-8">
                                    <label class="font-semibold leading-none text-white">
                                      Expereince*
                                    </label>
                                    <textarea
                                      value={instructor.attributes.question1}
                                      disabled
                                      required
                                      type="text"
                                      class="h-40 border border-zinc-600 bg-transparent p-3 rounded-xl   mt-2"
                                    ></textarea>
                                  </div>
                                </div>
                                <div>
                                  <div class="w-full flex flex-col mt-8">
                                    <label class="font-semibold leading-none text-white">
                                      What do you hope to accomplish by using
                                      the LEARN Platform?*
                                    </label>
                                    <textarea
                                      value={instructor.attributes.question2}
                                      disabled
                                      required
                                      type="text"
                                      class="h-40 border border-zinc-600 bg-transparent p-3 rounded-xl  mt-2"
                                    ></textarea>
                                  </div>
                                </div>
                              </form>

                              <div class="modal-action">
                                <label
                                  for="my-modal2"
                                  class=" cursor-pointer p-3 px-10 rounded-2xl bg-transparent border-2 border-teal-500 hover:bg-gradient-to-r from-teal-500 to-teal-400"
                                >
                                  Done
                                </label>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => rejectInstructor(instructor)}
                            className="text-xl cursor-pointer modal-button   bg-transparent border-2 border-red-500  rounded-2xl p-3 hover:bg-gradient-to-r from-red-500 to-rose-400 font-semibold mx-5 "
                          >
                            <label
                              for="my-modal"
                              class=" cursor-pointer  modal-button"
                            >
                              Reject
                            </label>
                          </button>

                          <button
                            onClick={() => approveInstructor(instructor)}
                            className="text-xl   bg-transparent border-2 border-emerald-500  rounded-2xl p-3 hover:bg-gradient-to-r from-emerald-500 to-teal-400 font-semibold mr-2.5 "
                          >
                            Approve
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
      )}
    </div>
  );
}

export default instructorsubmissions;
