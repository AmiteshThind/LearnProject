import Router from "next/router";

export default function AccessErrorPage() {
  return (
    <div className="  bg-fixed min-h-screen bg-gradient-to-b from-zinc-800    via-emerald-700  to-teal-500 text-white ">
      <div className="   min-h-screen justify-center flex items-center">
        <div className="  justify-center items-center flex flex-col">
          <div className="text-3xl font-extrabold text-center flex-wrap">
            Cannot access this page. You do not have the permission.
          </div>
          <div
            onClick={() => Router.push("/marketplace")}
            className="mt-12  text-2xl w-1/2 cursor-pointer text-center rounded-2xl font-semibold leading-none text-emerald-500 py-6   border-2 border-emerald-500 hover:text-white  hover:bg-gradient-to-b from-teal-500 to-emerald-500 focus:ring-2 focus:ring-offset-2  focus:outline-none"
          >
            Go To Home
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
