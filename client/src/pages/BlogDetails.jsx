import { useEffect, useState } from "react"
import { Nav } from "../sections/index"
import { useParams } from "react-router-dom"
import axios from "axios";
import './pages.css';
import AuthorProfile from "../components/AuthorProfile";
import CommentSection from "../sections/CommentSection";


function BlogDetails() {
    const {id} = useParams();
    const [blog, setBlog] = useState({});
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_URL}/blog/search/${id}`)
        .then((res) => setBlog(res.data));
        // console.log(blog)
        // console.log(blog)
    },[])
  return (
    <div className="relative">
      <Nav />
      <CommentSection blog={blog} />
      <div className="flex justify-center items-center my-10 w-full h-full">
        {blog && (
          <div className="w-[600px]">
            <h1 className="text-[20px]  md:text-[46px] leading-[45px] font-dm font-semibold">{blog.title}</h1>
            <p className="text-sm font-inter md:text-2xl  text-slate-700 mt-3">{blog.subTitle}</p>

            
            <AuthorProfile blog={blog} />

            <img className="my-10 md:h-[350px]" src={`${import.meta.env.VITE_SERVER_URL}/Images/${blog.image}`} alt="header-photo" />
            <div className="content-styling" dangerouslySetInnerHTML={{__html: blog.content}}></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogDetails