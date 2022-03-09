import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import UserNavbar from "../components/user/UserNavBar";
import InstructorNavbar from "../components/instructor/InstructorNavBar";

function staking() {
  const { user, isAuthenticated } = useMoralis();

  const [stakeTabActive, setStakeTabActive] = useState(true);
  const [amount, setAmount] = useState(0);

  const stake = () => {
    console.log("Stake");
    console.log(amount);
  };

  const unstake = () => {
    console.log("unstake");
    console.log(amount);
  };

  const claimRewards = () => {
    console.log("claim rewards");
  };

  return (
    <div>
      <div className="  bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white ">
        <div>
          {isAuthenticated && user.attributes.role == "instructor" ? (
            <InstructorNavbar />
          ) : (
            <UserNavbar />
          )}
        </div>

        <div className="flex flex-col mt-10 items-center">
          <div className="text-5xl text-center my-5 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
            Stake LEARN to Earn Passive Income.
          </div>
          <div className="text-lg w-4/5 md:w-3/5  text-center">
            The LEARN IFO (Initial Farm Offering) uses an allocated 5% of the
            total max supply of LEARN. This supply will be distributed to LEARN
            stakers over the course of 12 weeks. After that the rewards for
            staking will come from platform fees and the token tax on buying and
            selling.
          </div>
          <div className="w-full justify-center flex-wrap flex md:mt-10">
            <div class="   md:mx-10 w-full lg:w-1/6 text-center my-3 mx-5">
              <div class="stat bg-gradient-to-b from-emerald-500 to-teal-400    rounded-3xl py-10   ">
                <div class="stat-title">Current APR</div>
                <div class="stat-value text-3xl text-zinc-800">890%</div>
              </div>
            </div>
            <div class=" md:mx-10 text-center w-full lg:w-1/6 my-3 mx-5 ">
              <div class="  stat bg-gradient-to-b from-emerald-500 to-teal-400    rounded-3xl py-10 ">
                <div class="stat-title">Total Value Locked</div>
                <div class="stat-value text-3xl text-zinc-800">$89,400</div>
              </div>
            </div>
            <div class="  md:mx-10 text-center w-full lg:w-1/6 my-3 mx-5 ">
              <div class="stat bg-gradient-to-b from-emerald-500 to-teal-400    rounded-3xl py-10 ">
                <div class="stat-title">Rewards Per Day</div>
                <div class="stat-value text-3xl text-zinc-800">80 LEARN</div>
              </div>
            </div>
          </div>
          <div className="text-3xl flex justify-center flex-wrap mt-5 mb-2 w-full">
            <div className="w-full sm:w-5/12 flex-wrap bg-zinc-800  mx-2 rounded-3xl    ">
              <div class="tabs  justify-evenly bg-zinc-800 p-5 mx-2 rounded-3xl flex my-5 ">
                <button
                  onClick={() => setStakeTabActive(true)}
                  className={`
                  ${
                    stakeTabActive
                      ? `text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 e`
                      : `text-gray-500 `
                  } rounded-2xl w-2/5 mx-2 font-semibold leading-none py-4 px-4 mb-2    focus:outline-none `}
                >
                  Stake
                </button>
                <button
                  onClick={() => setStakeTabActive(false)}
                  className={`
                    ${
                      !stakeTabActive
                        ? `text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 e`
                        : `text-gray-500 `
                    } rounded-2xl w-2/5 mx-2 font-semibold leading-none py-4 px-4 mb-2    focus:outline-none `}
                >
                  UnStake
                </button>
              </div>
              <div className="flex justify-center flex-col items-center">
                <div className="flex flex-col w-3/4 mb-5 mx-5">
                  <input
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    placeholder="Enter Amount"
                    class=" input input-ghost text-white mb-5 mt-3 "
                  />
                  {stakeTabActive ? (
                    <button
                      onClick={stake}
                      disabled={!isAuthenticated}
                      className={
                        `rounded-2xl w-full  btn text-xl leading-none text-white px-4 mb-2   font-semibold duration-150 bg-gradient-to-b from-emerald-500 to-teal-500 focus:ring-2 focus:ring-offset-2  focus:outline-none ${!isAuthenticated ? "brightness-75": "brightness-100"}`
                      }
                    >
                      {isAuthenticated ? (
                        <div>Stake</div>
                      ) : (
                        <div>Connect Wallet</div>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={unstake}
                      disabled={!isAuthenticated}
                      className={
                        `rounded-2xl w-full  btn text-xl leading-none text-white px-4 mb-2   font-semibold duration-150 bg-gradient-to-b from-emerald-500 to-teal-500 focus:ring-2 focus:ring-offset-2  focus:outline-none ${!isAuthenticated ? "brightness-75": "brightness-100"}`
                      }
                    >
                      {isAuthenticated ? (
                        <div>UnStake</div>
                      ) : (
                        <div>Connect Wallet</div>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full sm:w-3/12 flex-wrap bg-zinc-800 rounded-3xl mb-2 mt-2 mx-2 sm:mx-5">
              <div className="flex justify-evenly h-full flex-wrap ml-5 text-xl font-extrabold item   flex-col">
                <div className="mr-5 ">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 brightness-150 mb-2">
                    Earned
                  </div>
                  <div className="flex items-center ">
                    <div className="mr-5">23.3</div>
                    <button disabled={!isAuthenticated} className={`btn w-3/5 bg-gradient-to-r from-emerald-500 to-teal-400 font-semibold rounded-2xl ${!isAuthenticated ? "brightness-75": "brightness-100"}`  }>
                      Claim
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mr-5 ">
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 brightness-150 mb-2">
                      Deposited
                    </div>
                    <div className="flex items-center ">
                      <div className="mr-5">23.43</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mr-5 ">
                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 brightness-150 mb-2">
                      In Wallet
                    </div>
                    <div className="flex items-center ">
                      <div className="mr-5">23.05</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default staking;
