import React, { useEffect, useState } from "react";
import { Moralis } from "moralis";
import toast, { Toaster } from "react-hot-toast";

function UserQuiz({
  availableQuizSections,
  claimLearn,
  setRewardsEarned,
  rewardsEarned,
  setRewardsClaimed,
  section,
  quizQuestions,
  user,
  course,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rewardRate, setRewardRate] = useState(1);
  const [optionSelected, setOptionSelected] = useState("");

  useEffect(() => {
    checkIsQuizCompleted();
    if (course[0].attributes.paid) {
      setRewardRate(2);
    }
  }, [isLoading]);

  const checkIsQuizCompleted = async () => {
    const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
    const query = new Moralis.Query(EnrolledUserCourses);
    query.equalTo("user", user);
    query.equalTo("course", course[0]);
    const result = await query.find();
    if (result[0]) {
      setCompletedQuizzes(result[0].attributes.completedQuizzes);
      setScore(result[0].attributes.quizScore);
      //console.log(result[0].attributes.completedQuizzes);
      setIsLoading(false);
    }
  };

  const handleAnswerOptionClick = (optionSelected) => {
    //check if question is correct nad update score
    console.log("here");
    setOptionSelected(optionSelected);
    const newScore = Object.assign({}, score); // pass this object to compelte quiz to get updated state()
    if (optionSelected == quizQuestions[currentQuestion].attributes.answer) {
      console.log("CORRECTANSWER");

      newScore[section] = score[section] + 1;
      setScore(newScore);
      console.log("NEWSCORE: " + newScore[section]);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizQuestions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
        completedQuiz(newScore);
      }

      setOptionSelected("");
    }, 3000);
    // incrment current question to next question
  };

  const completedQuiz = async (newScore) => {
    const EnrolledUserCourses = Moralis.Object.extend("EnrolledUsersCourses");
    const query = new Moralis.Query(EnrolledUserCourses);
    query.equalTo("user", user);
    query.equalTo("course", course[0]);
    const objectToUpdate = await query.first();
    //console.log(objectToUpdate);
    let arr = completedQuizzes;
    arr.push(section);
    objectToUpdate.set("completedQuizzes", arr);
    objectToUpdate.set("quizScore", newScore);
    objectToUpdate.set(
      "rewardsEarned",
      rewardsEarned + newScore[section] * rewardRate
    );
    //await objectToUpdate.save();
    setCompletedQuizzes((oldArray) => [...oldArray, section]);
    setRewardsEarned(rewardsEarned + newScore[section] * rewardRate);

    //check course completed and give rewards based on that
    if (completedQuizzes.length == availableQuizSections.length) {
      //course completed
      objectToUpdate.set(
        "rewardsEarned",
        rewardsEarned + 25 * rewardRate + newScore[section] * rewardRate
      ); //25+ learn token or 50 plus learn token if paid course on completion of course (value subject to change based on tokenomics)
      toast.success(
        "Course Completed. Earned Extra " + 25 * rewardRate + "$LEARN"
      );
      setRewardsEarned(
        rewardsEarned + newScore[section] * rewardRate + 25 * rewardRate
      );
    }
    await objectToUpdate.save();

    const Leaderboard = Moralis.Object.extend("Leaderboard");
    const leaderboardQuery = new Moralis.Query(Leaderboard);
    leaderboardQuery.equalTo("address", user.attributes.ethAddress);
    const leaderboardObject = await leaderboardQuery.first();

    
    const queryEnrolledUserCourses = new Moralis.Query(EnrolledUserCourses);
    queryEnrolledUserCourses.equalTo("user", user);
    const enrolledUserCourses = await queryEnrolledUserCourses.find();

    if (leaderboardObject!=undefined) {
      //update total
        console.log('update')
      let totalRewards = 0; // start of with score from the section user just completed (which will be there first course quiz)

      for (let enrolledCourse of enrolledUserCourses) {
          console.log(enrolledCourse)
        totalRewards += enrolledCourse.attributes.rewardsEarned;
      }

      leaderboardObject.set("totalRewards", totalRewards);
      await leaderboardObject.save();
    } else {
        console.log('new')
      //create new object and it to list
      const newLeaderBoardObject = new Leaderboard();
      newLeaderBoardObject.set("username", user.attributes.username);
      newLeaderBoardObject.set("address", user.attributes.ethAddress);
      newLeaderBoardObject.set("totalRewards", newScore[section] * rewardRate);
      newLeaderBoardObject.set("user",user)
      await newLeaderBoardObject.save();
    }
  };

  return (
    <div className=" w-4/5   rounded-3xl  text-white ">
      <div class="card lg:card-side bg-zinc-800 sm:h-[44rem] md:h-[38rem lg:h-[40rem] shadow-xl flex flex-col ">
        {quizStarted && !showScore && !completedQuizzes.includes(section) ? (
          <div className="w-full ">
            <div className=" flex items-center  flex-col flex-wrap w-3/8   p-5">
              <div className="border  w-full  mb-5 rounded-3xl p-3 border-emerald-500 text-white">
                <span className="text-emerald-500 font-extrabold">NOTE: </span>
                Must anwser all questions to claim $LEARN rewards.
              </div>

              <div className="text-4xl text-emerald-500 font-extrabold">
                {section} Quiz
              </div>
              <div className="text-xl font-extrabold text-zinc-500 flex-wrap my-3   ">
                Question {currentQuestion + 1}/{quizQuestions.length}
              </div>
              <div className="text-xl font-extrabold">
                {quizQuestions[currentQuestion].attributes.question}
              </div>
            </div>
            <div class="card-body">
              {quizQuestions[currentQuestion].attributes.options.map(
                (option) => (
                  <div
                    onClick={() => {
                      handleAnswerOptionClick(option);
                    }}
                    className={`btn my-2 border hover:scale-100 border-zinc-600 bg-zinc-800 ${
                      optionSelected &&
                      option == quizQuestions[currentQuestion].attributes.answer
                        ? `bg-emerald-500 hover:bg-emerald-500`
                        : optionSelected == option
                        ? `bg-red-400 hover:bg-red-400`
                        : ""
                    }`}
                  >
                    {option}
                  </div>
                )
              )}
            </div>
          </div>
        ) : !completedQuizzes.includes(section) &&
          !quizStarted &&
          !showScore ? (
          <div className="w-full ">
            <div className=" flex items-center  flex-col flex-wrap w-3/8   p-5">
              <div className="mt-10 text-5xl text-emerald-500 font-extrabold">
                {section} Quiz
              </div>

              <div className=" my-5  w-full  mb-5 rounded-3xl p-3 border-emerald-500 text-white">
                <span className="text-emerald-500 font-extrabold">NOTE: </span>
                Earn $LEARN by answering quiz questions correctly. At the end of
                the quiz you will be rewarded based on the number of correct
                answers.Quiz must be completed in one session else you will have
                to restart.
              </div>

              <div class="shadow stats  border-emerald-500 border stats-vertical">
                <div class="stat bg-zinc-800 text-white">
                  <div class="stat-title">Questions</div>
                  <div class="stat-value">{quizQuestions.length}</div>
                </div>

                <div class="stat bg-zinc-800 text-white">
                  <div class="stat-title">$LEARN/Question</div>
                  <div class="stat-value">{rewardRate}</div>
                </div>

                <div class="stat bg-zinc-800 text-white">
                  <div class="stat-title">Time Rec/Question</div>
                  <div class="stat-value">30 sec</div>
                </div>
              </div>

              <div
                onClick={() => setQuizStarted(true)}
                className="p-5 rounded-xl uppercase font-extrabold hover:scale-95 text-2xl  bg-emerald-500 my-10 cursor-pointer"
              >
                Begin Quiz
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full  justify-center flex flex-col items-center">
            <div className=" flex items-center  flex-col flex-wrap w-3/8   p-5">
              <div className="text-5xl text-emerald-500 mt-5 font-extrabold">
                {section} Quiz Summary
              </div>
            </div>
            <div class="card-body w-3/4">
              <div class="shadow stats  border-emerald-500 border stats-vertical">
                <div class="stat bg-zinc-800 text-white">
                  <div class="stat-title">Rewards Earned</div>
                  <div class="stat-value">{score[section] * rewardRate}</div>
                  <div class=" stat-desc">$LEARN</div>
                </div>

                <div class="stat bg-zinc-800 text-white">
                  <div class="stat-title">Score</div>
                  <div class="stat-value">
                    {score[section]}/{quizQuestions.length}
                  </div>
                </div>

                <div class="stat bg-zinc-800 text-white">
                  <div class="stat-title">Percentage</div>
                  <div class="stat-value">
                    {Math.round((score[section] / quizQuestions.length) * 100)}%
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => claimLearn()}
              className="p-6 text-xl bg-emerald-500 my-10 rounded-xl font-extrabold hover:scale-95 cursor-pointer duration-150 "
            >
              CLAIM $LEARN
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default UserQuiz;
