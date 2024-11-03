import { useDispatch, useSelector } from "react-redux";
import { inputStyle } from "../components";
import Tags from "../components/Tags";
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { setSubTitle, setTitle } from "../../store/slices/editor";
import { CircularProgress } from "@mui/material";

function Publish() {
    const { tags, title, subTitle, content} = useSelector((state) => state.editor);
    const {name, _id} = useSelector((state) => state.auth.user);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const dispatch = useDispatch();
    
    const handleImage = async(img) => {
      // console.log(img)
      if(img.type == 'image/jpeg' || img.type == 'image/png' || img.type == 'image/jpg') {
        setPhoto(img);
      } 
    }

    const handleSubmit = async(e) => {
      e.preventDefault();
      if(photo == "" || tags.length == 0 || title == '') {
        toast.error("Fill all the details");
      } else {
        setLoading(true);
        try {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('subTitle', subTitle);
          formData.append('username', _id);
          formData.append('content', content);
          formData.append('tags', JSON.stringify(tags));
          formData.append('image', photo);
          const response = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/blog/create`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          toast.success("Blog created successfully");
          nav('/', {replace: true});
        } catch(err) {
          toast.error('Failed to create the blog');
          console.log(err);
        } finally{
          setLoading(true);
        }
      }
    }

  return (
    <div className="flex items-center gap-20 flex-col lg:flex-row justify-center h-[100vh]">
      <ToastContainer 
      position="top-center"
      hideProgressBar='true'
      draggable
      pauseOnHover
      theme="light"
      />
      {loading && <div className="h-full w-full absolute flex justify-center items-center" style={{background: 'rgba(0,0,0,0.4)'}}>

       <CircularProgress /> 
      </div>}
      <Link to={'/create'} className="absolute top-10 right-10 text-4xl">
        <IoCloseOutline />
      </Link>
      <div className="flex flex-col gap-5">
        <p className="text-xl font-bold">Story preview</p>
        <div className="bg-slate-100 w-[300px] sm:w-[350px] h-[200px]">
          {photo ? (
            <div className="relative w-[350px] h-[200px]">
              <img className="w-full h-full object-cover"  src={URL.createObjectURL(photo)} alt="sub_picture" />
              <span className="absolute text-black rounded-full top-3 right-3 text-2xl bg-white" onClick={() => setPhoto(null)}>
                <IoCloseOutline />
              </span>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <label
                htmlFor="imgs"
                className="text-xs sm:text-sm text-center cursor-pointer"
              >
                Include image for more engagement of viewers.
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imgs"
                onChange={(e) => handleImage(e.target.files[0])}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => dispatch(setTitle(e.target.value))}
          className={`${inputStyle} border-slate-100`}
          placeholder="Title"
        />
        <input
          type="text"
          value={subTitle}
          onChange={(e) => dispatch(setSubTitle(e.target.value))}
          className={`${inputStyle} border-slate-100`}
          placeholder="Write a preview subtitle"
        />
      </div>
      <div className="flex flex-col gap-3">
        <p>Publishing to: {name}</p>
        <Tags />
        <button type="submit" onClick={handleSubmit} className="publish">Publish Now</button>
      </div>
    </div>
  );
}

export default Publish