import axios from 'axios'
import { useEffect } from "react"
import TagsSelector from "../components/TagsSelector"
import { useDispatch, useSelector } from "react-redux";
import { addBlogs } from '../../store/slices/blog';
import {useNavigate} from 'react-router-dom'

import { FaRegComment } from "react-icons/fa";
import { BsBookmarks } from "react-icons/bs";
import { BsBookmarksFill } from "react-icons/bs";
import Likes from '../components/Like';
import TimeStamp from '../components/TimeStamp';

function Blogs() {
  const { blogStore, tagSelected } = useSelector((state) => state.blog);
  const {username} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();
  useEffect(() => {
   const response = axios.get(`${import.meta.env.VITE_SERVER_URL}/blog/get/${tagSelected}`)
   .then((res) => dispatch(addBlogs(res.data)));
  }, []) 
  return (
    <div className="lg:px-20">
      <TagsSelector />
      {blogStore.length > 0 &&
        blogStore.map((blog, id) => (
          <div key={id} onClick={() => nav(`/blog/${blog._id}`)} className="my-12 font-robo cursor-pointer">
            <div className="profile flex items-center mb-3 text-sm gap-3 text-slate-600">
              <img className="w-[20px] h-[20px] object-cover rounded-full" src={blog.creator.profile_picture} alt="creator_dp"/>
              <p> {blog.creator.name} in{" "}
                 <span className="capitalize">{blog.tags[0]}</span>
              </p>
            </div>
            <div className="flex gap-5 justify-between">
              <div>
                <div className="header lg:w-[550px]">
                  <h2 className="text-xl lg:text-3xl font-bold">{blog.title}</h2>
                  <h2 className="text-xl ">{blog.subTitle}</h2>
                </div>
              </div>
              <div className="w-[120px] h-[75px]">
                <img className="w-fll h-full object-cover" src={`${import.meta.env.VITE_SERVER_URL}/Images/${blog.image}`} alt="blog_front_cover" />
              </div>
            </div>
            <div className="social mt-2 px-2 flex justify-between items-center">
              <div className="flex items-center gap-8">
                <TimeStamp time={blog.createdAt} />
                <Likes id={id} />
                <span className="flex items-center gap-3">
                  <FaRegComment className="text-slate-700" size={20} />
                  <p>{blog.comments.length}</p>
                </span>
              </div>
              <span>
                <BsBookmarks />
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Blogs