import { UploadIcon } from "@heroicons/react/solid";
import ReactPlayer from "react-player";

function UpdateLessonForm({
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
    <div className="pr-2">
      <form onSubmit={handleAddLesson}>
        <label className="block text-sm font-medium text-gray-700">Title</label>

        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            value={values.title}
            type="text"
            name="title"
            className="focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm py-2 border border-gray-200   px-2    rounded-md"
            placeholder="eg. Setup Server"
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
        </div>
        <label className="block text-sm font-medium mt-3 text-gray-700">
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
                  class="text-center w-full mt-2   rounded-md border border-gray-200 shadow-sm py-2 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-emerald-500"
                >
                  <option value={""}>Select</option>
                  {sections.map((section, index) => (
                    <option key={index + 1} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <label className="block text-sm mt-2 font-medium text-gray-700">
          Content
        </label>

        <div>
          <textarea
            value={values.content}
            onChange={(e) => setValues({ ...values, content: e.target.value })}
            name="content"
            required
            placeholder="eg. Setting up a server"
            type="text"
            className=" text-sm  rounded    border-gray-200 mt-1 px-2 w-full h-20    border"
          ></textarea>
        </div>
        <div class="flex justify-center">
          <div class="w-full ">
            <div class="flex   flex-col   w-full">
              <label className="block text-sm font-medium text-gray-700">
                Video
              </label>
              <label class="flex flex-col  mt-1 w-full h-full border  border-gray-300 rounded-md  hover:bg-gray-50   ">
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
                <div>
                    <div className="flex justify-between ">
                        <label className="block text-sm font-medium text-gray-700 mt-3">
                        Preview
                        </label>
                        <div class=" card bordered">
                            <div class="form-control">
                                <label class="label">
                                <span class="label-text"></span> 
                                <input onChange={v => setValues({...values,free_preview: v.target.checked})} defaultChecked={values.free_preview} type="checkbox" disabled={uploading} class="toggle toggle-accent"/>
                                </label>
                            </div> 
                        </div>
                    </div>
                    {values.free_preview &&
                    <div className=" flex justify-center">
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
        </div>
      </form>
    </div>
  );
}

export default UpdateLessonForm;
