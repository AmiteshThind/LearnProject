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
    <div className="pr-2 bg-white dark:bg-zinc-800">
      <form onSubmit={handleAddLesson}>
        <label className="block text-sm font-medium  tezt-zinc-700 dark:text-white">Title</label>
        {/* <Toaster 
         
         /> */}
        <div className="  relative rounded-md shadow-sm">
          <input
            type="text"
            name="title"
            className="border border-zinc-300 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 bg-transparent p-3 rounded-lg   mt-2 w-full"
            placeholder="eg. Setup Server"
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
        </div>
        <label className="block text-sm font-medium mt-3 text-zinc-700 dark:text-white">
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
                  class="text-center select select-ghost w-full  border dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-white truncate "
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
            className=" border border-zinc-300 dark:bg-zinc-700 p-2 dark:text-white dark:border-zinc-600 rounded-lg  w-full h-[8rem]"
          ></textarea>
        </div>
        <div class="flex justify-center">
          <div class="w-full ">
            <div class="flex   flex-col   w-full">
              <label className="block text-sm font-medium text-white">
                Video
              </label>
              <label class="flex flex-col  mt-1 w-full h-full border  border-zinc-300 hover:border-emerald-500 rounded-md    ">
                {progress > 0 && (
                  <div class="w-full bg-gray-200 h-1">
                    <div
                      class="bg-green-400 h-1"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
                <div class="flex flex-col items-center truncate justify-center cursor-pointer py-3">
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
              {/* {values.video.Location &&
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
} */}
              <div>
                <div className="flex justify-between ">
                  <label className="block text-sm font-medium text-white mt-3">
                    Preview
                  </label>
                  <div class=" card">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text"></span>
                        <input
                          onChange={(v) =>
                            setValues({
                              ...values,
                              free_preview: v.target.checked,
                            })
                          }
                          defaultChecked={values.free_preview}
                          type="checkbox"
                          disabled={uploading}
                          class="toggle toggle-accent "
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {values.free_preview && values.video.Location && (
                  <div className=" flex justify-center">
                    <ReactPlayer
                      url={values.video.Location}
                      width={"410px"}
                      height={"240px"}
                      controls
                      config={{
                        file: {
                          attributes: {
                            controlsList: "nodownload",
                          },
                        },
                      }}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddLessonForm;
