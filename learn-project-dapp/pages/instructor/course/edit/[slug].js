import { useEffect, useState } from "react";
import CourseCreateForm from "../../../../components/CourseCreateForm";
import DropDownInput from "../../../../components/DropDownInput";
import InstructorNavbar from "../../../../components/instructor/InstructorNavBar";
import { Moralis } from "moralis";
import { useMoralis } from "react-moralis";
import slugify from "slugify";
import { useRouter } from "next/router";

function CourseEdit() {
  //state

  const { user, isAuthenticated } = useMoralis();
  const router = useRouter();
  const { slug } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState([]);
  const [updatedSubmitted, setUpdateSubmitted] = useState(false);
  const [courseId, setCourseId] = useState("");

  const [values, setValues] = useState({
    name: "",
    description: "",
    price: 5,
    uploading: false,
    paid: true,
    loading: false,
    category: "",
    sections: [],
  });

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.attributes.role == "student") {
        router.push("/error/access");
      } else {
        loadCourse();
      }
    }
  }, [isLoading, isAuthenticated, user]);

  const loadCourse = async () => {
    const Course = Moralis.Object.extend("Course");
    const query = new Moralis.Query(Course);
    query.equalTo("slug", slug);
    const result = await query.find();
    if (result[0]) {
      setValues(result[0].attributes);
      console.log(result[0].attributes);
      setPreview(result[0].attributes.image_preview._url);
      setCourse(result);
      console.log(result);
      checkIfUpdateSubmitted(result[0].id);
    }
    setIsLoading(false); //once u get the value from the endpoint then u set to false as it will keep re running until the response is reached
  };

  const checkIfUpdateSubmitted = async (courseId) => {
    const CourseUpdate = Moralis.Object.extend("UpdatedCourse");
    const query = new Moralis.Query(CourseUpdate);
    console.log(courseId);
    query.equalTo("state", "pending");
    query.equalTo("courseToUpdate", courseId);
    const result = await query.find();
    if (result[0] != undefined) {
      setUpdateSubmitted(true);
      console.log("weo");
    }
  };

  const handleChange = (e) => {
    console.log(e);
    console.log(e.target.name);
    console.log(e.target.value);
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log(values);
  };

  const handleSections = (e) => {
    let arr = e.target.value.split(",");

    console.log(arr);
    setValues({ ...values, [e.target.name]: arr });
    console.log(values);
  };

  const handleImage = (e) => {
    setImageFile(e.target.files[0]);
    if (e.target.files[0]) {
      setPreview(window.URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // we will create a new database instance for the course and take all data from the form and upload to the database including the image

    updateCourse();

    console.log(values); //request to backend will be made here to create a course
  };

  const updateCourse = async () => {
    const Course = Moralis.Object.extend("UpdatedCourse");
    const query = new Moralis.Query(Course);
    query.equalTo("courseToUpdate", course[0].id);
    query.equalTo("state", "pending");
    const result = await query.first();
    if (result != undefined) {
      const wow = await result.destroy();
      console.log("we");
      console.log(wow);
    }

    const courseToUpdate = new Course();
    let acl = new Moralis.ACL();
    acl.setRoleReadAccess("admin",true);
    acl.setReadAccess(Moralis.User.current().id,true);
    acl.setWriteAccess(Moralis.User.current().id,true);
    courseToUpdate.setACL(acl);
    courseToUpdate.set("name", values.name);
    courseToUpdate.set("description", values.description);
    if (!values.paid) {
      courseToUpdate.set("price", 0);
    } else {
      courseToUpdate.set("price", values.price);
    }
    courseToUpdate.set("paid", values.paid);
    courseToUpdate.set("category", values.category);
    courseToUpdate.set("instructor", user);
    courseToUpdate.set("slug", slugify(values.name.toLowerCase()));
    courseToUpdate.set("sections", values.sections);
    courseToUpdate.set("courseToUpdate", course[0].id);
    courseToUpdate.set("originalCourseName",course[0].attributes.name);
    courseToUpdate.set("state", "pending");


    uploadFile(courseToUpdate);
    await courseToUpdate.save();
    setUpdateSubmitted(true);
    // router.push(
    //   `/instructor/course/view/${slugify(values.name.toLowerCase())}`
    // );
    console.log("wow");
    console.log(values.sections);
  };

  const uploadFile = async (courseToUpdate) => {
    //only if you change the image it will show up in updated row else it will remain undefined
    if (imageFile) {
      const imagePreview = new Moralis.File("image", imageFile);
      courseToUpdate.set("image_preview", imagePreview);
    }
  };

  return (
    <div className=" bg-fixed min-h-screen dark:bg-gradient-to-b dark:from-zinc-800    dark:via-emerald-700  dark:to-teal-500 bg-gradient-to-tr from-rose-200    via-teal-100  to-violet-200 text-zinc-700 dark:text-white">
      <InstructorNavbar />
      {!isLoading ? (
        <div>
          <div className="flex justify-center">
            <div class="w-3/4 justify-center    min-h-screen ">
              <div class="w-fullmx-auto px-6  flex justify-center items-center  ">
                <div class="bg-white dark:bg-zinc-800 w-full shadow-2xl  rounded-3xl  sm:p-12 mt-5 mb-5 ">
                  <p class="text-3xl font-bold leading-7 text-center text-emerald-500">
                    {" "}
                  </p>
                  <CourseCreateForm
                    handleSubmit={handleSubmit}
                    handleImage={handleImage}
                    handleChange={handleChange}
                    handleSections={handleSections}
                    values={values}
                    setValues={setValues}
                    preview={preview}
                    editing={true}
                    updateSubmitted={updatedSubmitted}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full justify-center items-center h-[25rem]   flex">
        <svg role="status" class="mr-2 w-30 h-36 text-gray-200 animate-spin dark:text-gray-600 fill-emerald-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        </div>
      )}
    </div>
  );
}

export default CourseEdit;
