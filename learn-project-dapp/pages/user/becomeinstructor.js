import Navbar from "../../components/user/UserNavBar";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";
import { useEffect, useState } from "react";
import Banner from "../../components/Banner";
import AuthErrorMsg from "../../components/AuthErrorMsg";
import { route } from "next/dist/server/router";
import Router, { useRouter } from "next/router";

function becomeinstructor() {
  const { user, isAuthenticated } = useMoralis();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [twitter, setTwitter] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // const assignInstructorRole = async () =>{
  //     user.set("role","instructor");
  //     await user.save();
  // }
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.attributes.role != "student") {
        router.push("/error/access");
      } else {
        checkApplicationSubmitted();
      }
    }
  }, [isAuthenticated, user, isLoading]);

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
    setIsLoading(false);
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
      formSubmission.set("profilePicture", user.attributes.profilePicture);
      user.set("description", q1);
      let acl = new Moralis.ACL();
      acl.setReadAccess(Moralis.User.current().id,true)
      acl.setRoleReadAccess("admin",true)
      acl.setWriteAccess(Moralis.User.current().id,true);
      formSubmission.setACL(acl)
      await formSubmission.save();
      setApplicationSubmitted(true);
    } else {
    }

    // assignInstructorRole();
    console.log("done");
  };

  return (
    <div className="bg-fixed min-h-screen dark:bg-gradient-to-b dark:from-zinc-800    dark:via-emerald-700  dark:to-teal-500 bg-gradient-to-tr from-rose-200    via-teal-100  to-violet-200 ">
      <div>
        <Navbar />
      </div>
      {!isLoading ? (
        <div>
          {isAuthenticated && !applicationSubmitted ? (
            <div className="  min-h-screen ">
              <div class="w-full">
                <div class=" "></div>
                <div class="max-w-4xl mx-auto px-6 sm:px-6 flex justify-center items-center  ">
                  <div class="dark:bg-zinc-800 bg-white w-full shadow-2xl rounded-3xl p-8 sm:p-12 mt-5 mb-5 text-white ">
                    <form onClick={(e) => e.preventDefault()}>
                      <div className="flex justify-center mb-10 text-5xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-400 font-extrabold">
                        Instructor Application
                      </div>
                      <div class="md:flex items-center  ">
                        <div class="w-full md:w-1/2 flex flex-col">
                          <label class="font-semibold leading-none  dark:text-white text-zinc-700">
                            Name*
                          </label>
                          <input
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="eg. Satoshi Nakamoto"
                            type="text"
                            class="input dark:bg-zinc-700 mt-2 border dark:border-none border-zinc-300 dark:text-white text-zinc-700 "
                          />
                        </div>
                        <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                          <label class="font-semibold leading-none dark:text-white text-zinc-700">
                            Email*
                          </label>
                          <input
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            type="email"
                            class="input dark:bg-zinc-700  mt-2 border dark:border-none border-zinc-300 dark:text-white text-zinc-700 "
                          />
                        </div>
                      </div>
                      <div class="md:flex items-center mt-8">
                        <div
                          placeholder="@SensaiEuphoria247"
                          class="w-full md:w-1/2 flex flex-col"
                        >
                          <label class="font-semibold leading-none dark:text-white text-zinc-700">
                            Telegram Id
                          </label>
                          <input
                            onChange={(e) => setTelegramId(e.target.value)}
                            placeholder="@satoshinakamoto"
                            type="text"
                            class="input dark:bg-zinc-700  mt-2 border dark:border-none border-zinc-300 dark:text-white text-zinc-700 "
                          />
                        </div>
                        <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                          <label class="font-semibold leading-none dark:text-white text-zinc-700">
                            LinkedIn
                          </label>
                          <input
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="linkedin.com/in/satoshinakamoto"
                            type="text"
                            class="input dark:bg-zinc-700  border dark:border-none border-zinc-300  dark:text-white text-zinc-700 mt-2"
                          />
                        </div>
                      </div>
                      <div class="md:flex items-center mt-8">
                        <div
                          placeholder="www.satoshi.com"
                          class="w-full md:w-1/2 flex flex-col"
                        >
                          <label class="font-semibold leading-none dark:text-white text-zinc-700">
                            Twitter
                          </label>
                          <input
                            onChange={(e) => setTwitter(e.target.value)}
                            placeholder="www.twitter.come/satoshi"
                            type="text"
                            class="input dark:bg-zinc-700  mt-2 border dark:border-none border-zinc-300 dark:text-white text-zinc-700"
                          />
                        </div>
                        <div class="w-full md:w-1/2 flex flex-col md:ml-6 md:mt-0 mt-4">
                          <label class="font-semibold leading-none dark:text-white text-zinc-700">
                            Portfolio
                          </label>
                          <input
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="eg. www.satoshi.com"
                            type="text"
                            class="input dark:bg-zinc-700  mt-2 border dark:border-none border-zinc-300 dark:text-white text-zinc-700 "
                          />
                        </div>
                      </div>
                      <div>
                        <div class="w-full flex flex-col mt-8">
                          <label class="font-semibold leading-none dark:text-white text-zinc-700">
                            Expereince*
                          </label>
                          <textarea
                            onChange={(e) => setQ1(e.target.value)}
                            required
                            placeholder="Tell us about your background and previous experience in teaching and creating courses :)"
                            type="text"
                            class="h-40 input dark:bg-zinc-700  mt-2 border dark:border-none border-zinc-300 dark:text-white text-zinc-700 "
                          ></textarea>
                        </div>
                      </div>
                      <div>
                        <div class="w-full flex flex-col mt-8">
                          <label class="font-semibold leading-none dark:text-white text-zinc-700">
                            What do you hope to accomplish by using the LEARN
                            Platform?*
                          </label>
                          <textarea
                            onChange={(e) => setQ2(e.target.value)}
                            required
                            placeholder="We would love to hear from you how we can help support you and provide the best user expereince. If you have no expereince in the crypto or need some help navigating the space don't worry we got your back."
                            type="text"
                            class="h-40 input dark:bg-zinc-700  mt-2 border dark:border-none border-zinc-300 dark:text-white text-zinc-700 "
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
      ) : isAuthenticated ? (
        <div className="w-full justify-center items-center h-[25rem]   flex">
<svg role="status" class="mr-2 w-30 h-36 text-white animate-spin  fill-emerald-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
</svg>
</div>
      ):
      <div>
      <AuthErrorMsg
        authErrorMsg={"Connect Wallet to Access Instructor Application"}
      />
    </div>}
    </div>
  );
}

export default becomeinstructor;
