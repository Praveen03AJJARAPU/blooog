import { BsHeart } from "react-icons/bs";
import { BsHeartFill } from "react-icons/bs";
import { TfiComment } from "react-icons/tfi";
import { BsBookmarks } from "react-icons/bs";
import { months } from ".";
import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function AuthorProfile({blog}) {
    const date = new Date(blog.createdAt);
    const month = months[date.getMonth()]; 
    const day = date.getDay();
    const year = date.getFullYear();

    const {user} = useSelector((state) => state.auth);

   

    const handlelike = async() => {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/blog/like`,
        { blogId: blog._id, userId: user._id }
      );
    }
    
  return (
    <div>
      <div className="profile flex font-inter gap-5 items-center mt-8">
        <div className="w-[40px] h-[40px]">
          <img src={blog?.creator?.profile_picture} className="w-full h-full rounded-full object-cover" alt="author-picture" />
        </div>
        <div>
          <div className="flex text-md gap-3 items-center">
            <p className="font-medium">{blog.creator?.name}</p>
            <p className="text-blue-500">Follow</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {blog.tags != null && (
              <p> Published in{" "} <span className="font-semibold">{blog.tags[0]}</span> </p>
            )}
            <p> {day + " " + month}, {year} </p>
          </div>
        </div>
      </div>

      <div className="flex items-center mt-8 border-y-2 py-4 px-1 justify-between">
        <div className="flex items-center gap-10">
          <span onClick={handlelike} className="flex gap-2 items-center">
            <BsHeart size={20} /> {blog.likes?.length}{" "}
          </span>
          <span className="flex gap-2 items-center mt-[2px]">
            <TfiComment size={20} /> {blog.comments?.length}{" "}
          </span>
        </div>
        <BsBookmarks size={20} />
      </div>
    </div>
  );
}

export default AuthorProfile