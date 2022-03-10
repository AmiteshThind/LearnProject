import Navbar from "../../components/user/UserNavBar";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import { useEffect, useState } from "react";
import Banner from "../../components/Banner";
import AuthErrorMsg from "../../components/AuthErrorMsg";

function becomeinstructor() {
  const { user, isAuthenticated } = useMoralis();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [twitter, setTwitter] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");

  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // const assignInstructorRole = async () =>{
  //     user.set("role","instructor");
  //     await user.save();
  // }
  useEffect(() => {
    if (isAuthenticated) {
      checkApplicationSubmitted();
    }
  }, [isAuthenticated]);

  const checkApplicationSubmitted = async () => {
    console.log("e");
    const instructorSubmission = Moralis.Object.extend("instructorSubmissions");
    const query = new Moralis.Query(instructorSubmission);
    query.equalTo("user", user);
    const result = await query.find();

    if (result[0] != undefined) {
      setApplicationSubmitted(true);
      console.log("here");
    }
  };

  const submitForm = async () => {
    //also want to add who submitted this
    const instructorSubmission = Moralis.Object.extend("instructorSubmissions");
    const formSubmission = new instructorSubmission();
    if (name != "" && email != "" && q1 != "" && q2 != "") {
      formSubmission.set("name", name);
      formSubmission.set("email", email);
      formSubmission.set("website", website);
      formSubmission.set("linkedin", linkedin);
      formSubmission.set("telegramId", telegramId);
      formSubmission.set("twitter", twitter);
      formSubmission.set("question1", q1);
      formSubmission.set("question2", q2);
      formSubmission.set("user", user);
      formSubmission.set("instructorAddress", user.attributes.ethAddress);
      formSubmission.set("approvalStatus", "pending");
      formSubmission.set("profilePicture",user.attributes.profilePicture)
      user.set("description", q1);
      await formSubmission.save();
      setApplicationSubmitted(true);
    } else {
    }

    // assignInstructorRole();
    console.log("done");
  };

  return (
    <div className=" bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 ">
      <div>
        <Navbar />
      </div>
      {isAuthenticated && !applicationSubmitted ? (
        <div className="  min-h-screen ">
          <div class="w-full">
            <div class=" "></div>
            <div class="max-w-4xl mx-auto px-6 sm:px-6 flex justify-center items-center  ">
              <div class="bg-zinc-800 w-full shadow-2xl rounded-3xl p-8 sm:p-12 mt-5 mb-5 text-white ">
                <form onClick={(e) => e.preventDefault()}>
                  <div className="flex justify-center mb-10 text-4xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-400 font-extrabold">
                    Instructor Application
                  </div>
                  <div class="md:flex items-center  ">
                    <div class="w-full md:w-1/2 flex flex-col">
                      <label class="font-semibold leading-none text-white">
                        Name*
                      </label>
                      <input
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="eg. Satoshi Nakamoto"
                        type="text"
                        class="input input-ghost mt-2"
                      />
                    </div>
                    <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                      <label class="font-semibold leading-none text-white">
                        Email*
                      </label>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        type="email"
                        class="input input-ghost mt-2"
                      />
                    </div>
                  </div>
                  <div class="md:flex items-center mt-8">
                    <div
                      placeholder="@SensaiEuphoria247"
                      class="w-full md:w-1/2 flex flex-col"
                    >
                      <label class="font-semibold leading-none text-white">
                        Telegram Id
                      </label>
                      <input
                        onChange={(e) => setTelegramId(e.target.value)}
                        placeholder="@satoshinakamoto"
                        type="text"
                        class="input input-ghost mt-2"
                      />
                    </div>
                    <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                      <label class="font-semibold leading-none text-white">
                        LinkedIn
                      </label>
                      <input
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder="linkedin.com/in/satoshinakamoto"
                        type="text"
                        class="input input-ghost mt-2"
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
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="www.twitter.come/satoshi"
                        type="text"
                        class="input input-ghost mt-2"
                      />
                    </div>
                    <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                      <label class="font-semibold leading-none text-white">
                        Portfolio
                      </label>
                      <input
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="eg. www.satoshi.com"
                        type="text"
                        class="input input-ghost mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <div class="w-full flex flex-col mt-8">
                      <label class="font-semibold leading-none text-white">
                        Expereince*
                      </label>
                      <textarea
                        onChange={(e) => setQ1(e.target.value)}
                        required
                        placeholder="Tell us about your background and previous experience in teaching and creating courses :)"
                        type="text"
                        class="h-40 input input-ghost mt-2"
                      ></textarea>
                    </div>
                  </div>
                  <div>
                    <div class="w-full flex flex-col mt-8">
                      <label class="font-semibold leading-none text-white">
                        What do you hope to accomplish by using the LEARN
                        Platform?*
                      </label>
                      <textarea
                        onChange={(e) => setQ2(e.target.value)}
                        required
                        placeholder="We would love to hear from you how we can help support you and provide the best user expereince. If you have no expereince in the crypto or need some help navigating the space don't worry we got your back."
                        type="text"
                        class="h-40 input input-ghost mt-2"
                      ></textarea>
                    </div>
                  </div>
                  <div class="flex items-center justify-center w-full">
                    <button
                      onClick={submitForm}
                      class="mt-9 rounded-2xl font-semibold leading-none text-emerald-500 py-6 px-10  border-2 border-emerald-500 hover:text-white  hover:bg-gradient-to-b from-teal-500 to-emerald-500 focus:ring-2 focus:ring-offset-2  focus:outline-none"
                    >
                      Send Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : isAuthenticated && applicationSubmitted ? (
        <div>
          <AuthErrorMsg
            authErrorMsg={
              "Application Submitted. Someone from the team will reach out to you via Email or Telegram."
            }
          />
        </div>
      ) : (
        <div>
          <AuthErrorMsg
            authErrorMsg={"Connect Wallet to Access Instructor Application"}
          />
        </div>
      )}
    </div>
  );
}

export default becomeinstructor;
