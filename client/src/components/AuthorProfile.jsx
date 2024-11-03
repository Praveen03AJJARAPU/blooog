import { BsCheckLg, BsHeart } from "react-icons/bs";
import { BsHeartFill } from "react-icons/bs";
import { TfiComment } from "react-icons/tfi";
import { BsBookmarks } from "react-icons/bs";
import { months } from ".";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from 'socket.io-client';
import { BsBookmarksFill } from "react-icons/bs";
import { toggleSection } from "../../store/slices/blog";
import { setUserData } from "../../store/slices/auth";
import { Link } from "react-router-dom";
import Loading from "./Loading";

const socket = io(import.meta.env.VITE_SERVER_URL);

function AuthorProfile({blog}) {
    const date = new Date(blog.createdAt);
    const month = months[date.getMonth()]; 
    const day = date.getDay();
    const [saved, setSaved] = useState(false);
    const year = date.getFullYear();
    const [likes, setLikes] = useState([]);
    const {user} = useSelector((state) => state.auth);
    const {commentSlide} = useSelector((state) => state.blog)
    const dispatch = useDispatch();

    useEffect(() => {
      // console.log(user )
      if(blog && blog.likes) {
        setLikes(blog.likes);
      }
    },[blog])

    useEffect(() => {
      socket.on('likeAdded', (data) => {
        if(data.blog._id == blog._id) {
          setLikes(data.likes);
          // console.log(data);
        }
      })
      return () => socket.disconnect();
    },[blog?._id])
    
    console.log(blog?.creator?.profile_picture)

    const handlelike = async() => {
      if (!user || !blog) return;
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/blog/like`,
        { blogId: blog._id, userId: user._id }
      ).then((res) => {
        setLikes(res?.data);
      });
    }
    // console.log(blog._id)
    const handleSave = async() => {
      if(!user || !blog) return;
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/blog/save`,
        { blogId: blog._id, userId: user._id }
      ).then((res) => {
        setUserData(res.data);
        // console.log(res.data)
        setSaved(res.data.includes(blog._id));
      });
    }

    
    
  return (
    <div>
      {blog ? (
        <div>
          <div className="profile flex font-anto gap-5 items-center mt-8">
            <div className="w-[40px] h-[40px]">
              <img
                src={
                  typeof blog?.creator?.profile_picture === "string" &&
                  blog?.creator?.profile_picture.startsWith("http")
                    ? blog?.creator?.profile_picture
                    : `${import.meta.env.VITE_SERVER_URL}/Images/${
                        blog?.creator?.profile_picture
                      }`
                }
                className="w-full h-full rounded-full object-cover"
                alt="author-picture"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <Link
                to={`/profile/${blog.creator?._id}`}
                className="flex text-md gap-3 items-center"
              >
                <p className="font-medium">{blog.creator?.name}</p>
                <p className="text-blue-500">Follow</p>
              </Link>
              <div className="flex items-center gap-3 text-sm">
                {blog.tags != null && (
                  <p>
                    {" "}
                    Published in{" "}
                    <span className="font-semibold">{blog.tags[0]}</span>{" "}
                  </p>
                )}
                <p>
                  {" "}
                  {day + " " + month}, {year}{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-8 border-y-2 border-fourth py-4 px-1 justify-between">
            <div className="flex items-center gap-10">
              <span onClick={handlelike} className="flex gap-2 items-center">
                {likes?.includes(user?._id) ? (
                  <BsHeartFill size={20} />
                ) : (
                  <BsHeart size={20} />
                )}{" "}
                {likes.length}{" "}
              </span>
              <span
                onClick={() => {
                  dispatch(toggleSection(true));
                }}
                className="flex gap-2 items-center mt-[2px]"
              >
                <TfiComment size={20} /> {blog.comments?.length}{" "}
              </span>
            </div>
            <span onClick={handleSave}>
              {saved ? (
                <BsBookmarksFill size={20} />
              ) : (
                <BsBookmarks size={20} />
              )}
            </span>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default AuthorProfile