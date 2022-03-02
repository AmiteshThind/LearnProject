/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import AddLessonForm from "./AddLessonForm";
import UpdateLessonForm from "./UpdateLessonForm";

export default function Modal({
  visible,
  setVisible,
  setValues,
  values,
  handleAddLesson,
  uploading,
  uploadBtnText,
  handleVideo,
  setUploadBtnText,
  progress,
  handleVideoRemove,
  sections,
  editing,
  setEditing,
  handleUpdateLesson,
}) {
  useEffect(() => {
    // console.log(values);
  });

  const resetForm = (e) => {
    setValues({
      title: "",
      content: "",
      video: {},
      section: "",
    });
    setVisible(false);
    setEditing(false);
    setUploadBtnText("Upload Video");
  };

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={visible} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setVisible}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-zinc-500 backdrop-blur-sm bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-zinc-800 rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-zinc-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start ">
                  <div className="mt-3  w-full text-center item sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-4xl py-2 font-extrabold leading-6  text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-400"
                    >
                      Lesson
                    </Dialog.Title>

                    <div className="mt-2">
                      <div className="mt-3">
                        {!editing && (
                          <AddLessonForm
                            uploadBtnText={uploadBtnText}
                            values={values}
                            handleAddLesson={handleAddLesson}
                            setValues={setValues}
                            handleVideo={handleVideo}
                            uploading={uploading}
                            progress={progress}
                            sections={sections}
                          />
                        )}
                        {editing && (
                          <UpdateLessonForm
                            uploadBtnText={uploadBtnText}
                            values={values}
                            handleAddLesson={handleAddLesson}
                            setValues={setValues}
                            handleVideo={handleVideo}
                            uploading={uploading}
                            progress={progress}
                            sections={sections}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="  px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full btn inline-flex justify-center hover:border-gray-300 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 hover:scale-95 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={resetForm}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
                {!uploading && values.video.Location && (
                  <button
                    type="button"
                    className="mt-3 w-full btn inline-flex justify-center rounded-md  hover:scale-95  shadow-sm px-4 py-2 bg-red-500 hover:bg-red-500 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2   sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleVideoRemove}
                  >
                    Remove Video
                  </button>
                )}
                {!editing && (
                  <button
                    type="button"
                    className="w-full btn inline-flex justify-center hover:scale-95 rounded-md shadow-sm px-4 py-2  bg-gradient-to-br from-emerald-500 to-teal-400 text-base font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2   sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleAddLesson}
                    disabled={uploading}
                  >
                    Add Lesson
                  </button>
                )}
                {editing && (
                  <button
                    type="button"
                    className="w-full btn inline-flex justify-center hover:scale-95 rounded-md shadow-sm px-4 py-2  bg-gradient-to-br from-emerald-500 to-teal-400 text-base font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2   sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleUpdateLesson}
                    disabled={uploading}
                  >
                    Update Lesson
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
