import { useEffect, useState } from "react"
import { Nav } from "../sections/index"
import { useParams } from "react-router-dom"
import axios from "axios";
import './pages.css';
import AuthorProfile from "../components/AuthorProfile";
import CommentSection from "../sections/CommentSection";
import { useSelector } from "react-redux";
import SearchAnim from "../components/SearchAnim";
import { CircularProgress } from "@mui/material";


function BlogDetails() {
    const {id} = useParams();
    const {commentSlide} = useSelector((state) => state.blog);
    const [blog, setBlog] = useState({});
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_URL}/blog/search/${id}`)
        .then((res) => {setBlog(res.data); window.scrollTo(0,0)});
    },[])

    if(!blog) {
      return <div>...Loading</div>
    }
  return (
    
    !blog ? (<div className="w-[100vw] h-[100vh] bg-primary flex justify-center items-center">
      <CircularProgress color={"secondary"} />
    </div>) :  (<div className= {`relative ${commentSlide && 'pointer-events-none'}`} >
      <Nav />
      <SearchAnim />
      <CommentSection setBlog={setBlog} blog={blog} />
      <div className="flex bg-primary justify-center items-center pt-24 text-fourth w-full h-full">
        <div className={`w-[600px] ${commentSlide && 'opacity-40'}`}>
          <h1 className="text-[20px]  md:text-[46px] leading-[45px] font-lime font-semibold">
            {blog.title}
          </h1>
          <p className="text-sm font-lime md:text-2xl  text-third mt-3">
            {blog.subTitle}
          </p>

          <AuthorProfile blog={blog} />

          <img
            className="my-10 md:h-[350px]"
            src={`${import.meta.env.VITE_SERVER_URL}/Images/${blog.image}`}
            alt="header-photo"
          />
          <div
            className="content-styling mb-10"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          ></div>
        </div>
      </div>
    </div>)
  );
}

export default BlogDetails;