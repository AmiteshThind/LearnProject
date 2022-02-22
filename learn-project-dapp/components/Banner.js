/* This example requires Tailwind CSS v2.0+ */
export default function Banner({title}) {
    return (
        <div className="bg-emerald-500 w-full shadow-md">
                <div className="flex items-center justify-center flex-wrap text-6xl text-white p-9 text-center ">
                   <h1> {title} </h1>
                </div>
        </div>
    

    )
}