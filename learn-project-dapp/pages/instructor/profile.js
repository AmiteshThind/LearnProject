import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import UserNavbar from "../../components/user/UserNavBar";
import Router, { useRouter } from "next/router";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/outline";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import defaultImage from "../../public/images/defaultImage.png";
import InstructorNavbar from "../../components/instructor/InstructorNavBar";
import useStore from "../../store/store";
import AdminNavBar from "../../components/admin/AdminNavBar";

function Profile() {
  //list of courses that the user is enrolled in
  const { user, isAuthenticated } = useMoralis();
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState();
  const [username, setUsername] = useState();
  const [description, setDescription] = useState();
  let profilePicDetails = useStore((state) => state.profilePicDetails);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(user);
      if (user.attributes.role == "student") {
        router.push("/user/profile");
      } else {
        loadInstructorDetails();
      }
    }
  }, [isAuthenticated, user, isLoading]);

  const loadInstructorDetails = async () => {
    const Instructors = Moralis.Object.extend("instructorSubmissions");
    const query = new Moralis.Query(Instructors);
    query.equalTo("user", user);
    const result = await query.find();
    if (result[0]) {
      setUsername(result[0].attributes.name);
      setDescription(result[0].attributes.question1);
      if (result[0].attributes.profilePicture != undefined) {
        setPreview(result[0].attributes.profilePicture._url);
        console.log("yes");
      } else {
        setPreview(defaultImage);
      }
      setIsLoading(false);
    }
  };

  const handleImage = async (e) => {
    if (e.target.files[0]) {
      setPreview(window.URL.createObjectURL(e.target.files[0]));
    }
    const profileImage = new Moralis.File("profileImage", e.target.files[0]);
    setImageFile(profileImage);
  };

  const saveDetails = async (e) => {
    const Instructors = Moralis.Object.extend("instructorSubmissions");
    const query = new Moralis.Query(Instructors);
    query.equalTo("user", user);
    const instructorToUpdate = await query.first();
    instructorToUpdate.set("name", username);
    instructorToUpdate.set("profilePicture", imageFile);
    instructorToUpdate.set("question1", description);
    user.set("profilePicture", imageFile);
    user.set("description", description);
    let obj = await instructorToUpdate.save();
    toast.success("Saved Successfully");
    useStore.setState({ profilePicDetails: obj.attributes.profilePicture });
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
      {!isLoading && isAuthenticated ? (
        <div>
          <div className="flex justify-center ">
            {/* {JSON.stringify(
            userEnrolledCourses[0].attributes.course.attributes,
            0,
            null
          )} */}
            <div className="w-full md:w-1/2 mx-3 mb-3 bg-zinc-800 rounded-3xl flex justify-center flex-col items-center  mt-10">
              <div className="w-full justify-center flex flex-col items-center">
                <div className="text-4xl font-extrabold py-8  px-8   text-center ">
                  My Profile
                </div>

                <div class=" avatar">
                  <div class="w-48 h-48 rounded-full ">
                    <label className="cursor-pointer ">
                      {preview && (
                        <Image
                          src={preview}
                          className="hover:opacity-50 w-2 h-2"
                          height={250}
                          width={250}
                        />
                      )}
                      <input
                        type="file"
                        name="image"
                        onChange={handleImage}
                        accept="image/*"
                        hidden
                      />
                    </label>
                  </div>
                </div>

                <div className="    mt-5  font-semibold">
                  <label className="text-md">Username</label>
                  <input
                    onChange={(v) => setUsername(v.target.value)}
                    type="text"
                    value={username}
                    class="input hid input-ghost  w-full mt-1 max-w-xs truncate"
                  />
                </div>
                <div className="  w-full mx-5 px-5 lg:w-1/2  mt-5  font-semibold">
                  <label className="text-md">About You</label>
                  <textarea
                    onChange={(v) => setDescription(v.target.value)}
                    value={description}
                    class=" mt-2 textarea textarea-bordered h-[10rem] input-ghost w-full"
                    placeholder="Brief description about yourself, expereince and what you teach. Make it fun and concise as students will be able to see this information."
                  ></textarea>
                </div>
              </div>

              <div className=" my-10 text-md font-extrabold">
                <button
                  onClick={saveDetails}
                  class=" rounded-2xl font-semibold leading-none text-emerald-500 py-6 px-10  border-2 border-emerald-500 hover:text-white  hover:bg-gradient-to-b from-teal-500 to-emerald-500 focus:ring-2 focus:ring-offset-2  focus:outline-none"
                >
                  Save
                </button>
              </div>
              <div></div>
            </div>
          </div>
          <Toaster />
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

export default Profile;
