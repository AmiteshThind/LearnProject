import { UploadIcon } from "@heroicons/react/solid";
import ReactPlayer from "react-player";
import { Toaster } from "react-hot-toast";
function AddLessonForm({
  values,
  setValues,
  handleAddLesson,
  uploadBtnText,
  handleVideo,
  uploading,
  progress,
  sections,
}) {
  return (
    <div className="pr-2 bg-zinc-800">
      <form onSubmit={handleAddLesson}>
        <label className="block text-sm font-medium text-white">Title</label>
        {/* <Toaster 
         
         /> */}
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            name="title"
            className="focus:ring-emerald-500 text-white focus:border-emerald-500 block w-full text-sm py-2 border-2 bg-zinc-800 border-zinc-700 hover:border-emerald-500  px-2    rounded-md"
            placeholder="eg. Setup Server"
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
        </div>
        <label className="block text-sm font-medium mt-3 text-white">
          Section
        </label>

        <div className="flex">
          <div className="flex flex-col  ">
            <div class="flex justify-center ">
              <div class="  w-full">
                <select
                  onChange={(v) =>
                    setValues({ ...values, section: v.target.value })
                  }
                  value={values.section}
                  class="text-center w-full mt-2 bg-gradient-to-b from-teal-500   to-emerald-500  rounded-md   shadow-sm py-2  text-sm font-medium text-white"
                >
                  <option value={""}>Select</option>
                  {sections.map((section, index) => (
                    <option value={section}>{section}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <label className="block text-sm mt-2 font-medium text-white">
          Content
        </label>

        <div>
          <textarea
            onChange={(e) => setValues({ ...values, content: e.target.value })}
            name="content"
            required
            placeholder="eg. Setting up a server"
            type="text"
            className=" text-sm  rounded  bg-zinc-800  border-zinc-700 hover:border-emerald-500 mt-1 px-2 w-full h-20    border-2 text-white"
          ></textarea>
        </div>
        <div class="flex justify-center">
          <div class="w-full ">
            <div class="flex   flex-col   w-full">
              <label className="block text-sm font-medium text-white">
                Video
              </label>
              <label class="flex flex-col  mt-1 w-full h-full border-2  border-zinc-700 hover:border-emerald-500 rounded-md    ">
                {progress > 0 && (
                  <div class="w-full bg-gray-200 h-1">
                    <div
                      class="bg-green-400 h-1"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
                <div class="flex flex-col items-center truncate justify-center py-3">
                  {!uploading && (
                    <div className="flex truncate text-sm text-gray-400">
                      <UploadIcon className="w-6 h-6" />
                      {uploadBtnText}
                    </div>
                  )}
                  {uploading && (
                    <div class="flex justify-start items-start mx-2" disabled>
                      <div class="spinner-border border-t-transparent border-green-400 animate-spin inline-block w-5 h-5 border-2 rounded-full"></div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  name="video"
                  onChange={handleVideo}
                  accept="video/*"
                  hidden
                />
              </label>
              {values.video.Location &&
              <div className=" flex justify-center p-2 ">
                        <ReactPlayer 
                        url={values.video.Location}
                        width={"410px"}
                        height = {"240px"}
                        controls
                        config={{ file: { 
                            attributes: {
                            controlsList: 'nodownload'
                            }
                        }}}
                        onContextMenu={e => e.preventDefault()}
                        />
                    </div>
}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddLessonForm;
