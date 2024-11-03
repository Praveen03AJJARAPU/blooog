import gsap from "gsap";
import axios from "axios";
import { HiXMark } from "react-icons/hi2";
import { FaPencilAlt } from "react-icons/fa";
import { toggleEdit } from "../../store/slices/blog";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

function EditProfile({user}) {
    const [info, setInfo] = useState({
      name: user.name,
      bio: user.bio,
      profile_picture: user.profile_picture,
    });
    const dispatch = useDispatch();
    const {openEdit} = useSelector((state) => state.blog);
    const ref = useRef();
    useEffect(() => {
      console.log(openEdit)
      if(openEdit) {

        gsap.to(ref.current, {y: "0%", opacity: 1});
      } else {

        gsap.to(ref.current, {y: "100%", opacity: 0});
      }

    },[openEdit])
    

    

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(user.name !== info.name || user.bio !== info.bio || user.profile_picture !== info.profile_picture) {
          const formdata = new FormData();
          formdata.append('name', info.name);
          formdata.append('bio', info.bio);
          formdata.append('id', user._id);
          formdata.append('profile_picture', info.profile_picture);
          console.log("hi")
          const res = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/blog/updateUser`,
            formdata, 
            {
              headers: {
                "Content-Type": "multipart/form-data", 
              },
            }
          ).then((res) => {
            console.log(res)
            localStorage.setItem('user', res.data)
          })
            window.location.reload();
        } else {
            console.log("bye")
            toast.error("Change the details to save");
        }
    }
  return (
    <div ref={ref} className="fixed md:top-[25%]  z-50 md:left-[40%]">
      <div
        className="bg-fourth md:rounded-xl font-anto w-screen md:w-[400px] h-[400px] flex flex-col py-5"
      >
        <ToastContainer
          position="top-center"
          hideProgressBar="true"
          draggable
          pauseOnHover
          theme="light"
        />
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="relative px-5 flex items-center gap-5">
            <img
              src={typeof info?.profile_picture === "string" &&
                info?.profile_picture.startsWith("http")
                  ? info?.profile_picture
                  : `${import.meta.env.VITE_SERVER_URL}/Images/${
                      info?.profile_picture
                    }`}
              className="rounded-full w-[100px] h-[100px] object-cover"
              alt="pp"
            />

            <input
              type="file"
              onChange={(e) =>
                setInfo((prev) => ({
                  ...prev,
                  profile_picture: e.target.files[0],
                }))
              }
              className="hidden"
              id="img"
            />
            <label htmlFor="img">
              <div className="flex gap-2 rounded-full text-fourth p-3 bg-third bottom-0 right-0">
                <FaPencilAlt size={20} />
                <p>Upload</p>
              </div>
            </label>
          </div>
          <span
            onClick={() => dispatch(toggleEdit(false))}
            className="absolute top-5 right-5"
          >
            <HiXMark size={25} />
          </span>
          <div className="px-10 flex flex-col mt-5 gap-5">
            <div className="flex flex-col gap-3">
              <label className="text-lg">Name</label>
              <input
                type="text"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="outline-none p-2"
                value={info.name}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-lg">Bio</label>
              <input
                type="text"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, bio: e.target.value }))
                }
                required
                className="outline-none p-2"
                value={info.bio}
              />
            </div>
          </div>
          <div className="flex items-center justify-end mt-8 mx-5  gap-3">
            <button
              type="submit"
              className="bg-primary px-3 py-1 rounded-full text-fourth"
            >
              Cancel
            </button>
            <button
              type="submit"
              onSubmit={(e) => handleSubmit(e)}
              className="bg-secondary px-3 py-1 rounded-full text-fourth"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile