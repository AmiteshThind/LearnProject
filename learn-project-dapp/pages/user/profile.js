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
import { route } from "next/dist/server/router";

function Profile() {
  //list of courses that the user is enrolled in
  const { user, isAuthenticated } = useMoralis();
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState();
  const [username, setUsername] = useState();
  const [showUserInLeaderboard, setShowUserInLeaderboard] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(user);
      if (user.attributes.role != "student") {
        router.push("/instructor/profile");
      } else {
        loadLeaderboardDetails();
      }
    }
  }, [isAuthenticated, user, isLoading]);

  const loadLeaderboardDetails = async () => {
    const Leaderboard = Moralis.Object.extend("Leaderboard");
    const query = new Moralis.Query(Leaderboard);
    query.equalTo("user", user);
    const result = await query.find();
    console.log(user);
    if (result[0]) {
      setShowUserInLeaderboard(result[0].attributes.displayOnLeaderboard);
      setUsername(result[0].attributes.username);
      if (result[0].attributes.profilePicture != undefined) {
        setPreview(result[0].attributes.profilePicture._url);
      } else {
        setPreview(defaultImage);
      }
      setIsLoading(false);
    } else {
      setPreview(defaultImage);
      setUsername(user.attributes.username);
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
    //need to update the name in the leaderboard for this particular address

    user.set("username", username);
    user.set("profilePicture", imageFile);
    const Leaderboard = Moralis.Object.extend("Leaderboard");
    const query = new Moralis.Query(Leaderboard);
    query.equalTo("user", user);
    let result = await query.first();
    if (result == undefined) {
      result = new Leaderboard();
    }
    result.set("username", username);
    result.set("profilePicture", imageFile);
    result.set("user", user);
    result.set("displayOnLeaderboard", showUserInLeaderboard);
    await user.save();
    let obj = await result.save();
    console.log(obj);
    //need to update profile pic ddetail
    if (obj.attributes.profilePicture) {
      useStore.setState({
        profilePicDetails: obj.attributes.profilePicture._url,
      });
    }

    toast.success("Saved Successfully");
  };

  return (
    <div>
      {!isLoading && (
        <div className="bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white ">
          <div>
            <UserNavbar />
          </div>

          <div className="flex justify-center ">
            {/* {JSON.stringify(
            userEnrolledCourses[0].attributes.course.attributes,
            0,
            null
          )} */}
            <div className="w-full md:w-1/2 bg-zinc-800 rounded-3xl flex justify-center flex-col items-center  mt-10">
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
                  class="input hid input-ghost w-full mt-1 max-w-xs truncate"
                />
              </div>
              <div className=" flex flex-col   mt-5  font-semibold">
                <label className="text-md mr-28">Show In Leaderboard</label>
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <input
                      onChange={(v) => {
                        setShowUserInLeaderboard(v.target.checked);
                        console.log(v.target.checked);
                      }}
                      type="checkbox"
                      checked={showUserInLeaderboard}
                      class="toggle toggle-accent"
                    />
                  </label>
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
      )}
    </div>
  );
}

export default Profile;
