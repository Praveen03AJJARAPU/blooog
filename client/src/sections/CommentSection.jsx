import './sections.css';
import axios from "axios";
import io from 'socket.io-client';
import gsap from 'gsap';
import { BsHeart } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { toggleSection } from "../../store/slices/blog";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const socket = io(import.meta.env.VITE_SERVER_URL);



function CommentSection({blog, setBlog}) {
    const {user} = useSelector((state) => state.auth);
    const [comment, setComment] = useState("");
    const [canComment, setCanComment] = useState(false);
    const [comments, setComments] = useState([]);
    const {commentSlide} = useSelector((state) => state.blog);
    const sectionRef = useRef(null);
    const comRef = useRef(null);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const value = e.target.value;
        setComment(value);
        value.length > 1 ? setCanComment(true) : setCanComment(false);
    }
    useEffect(() => {
      socket.on('commentAdded', (newComment) => {
        setComments((prev) => [newComment, ...prev]);
      })
      return () => {
        socket.off('commentAdded');
      }

    },[])

    useEffect(() => {
      if(blog && blog._id) {

        const res = axios.get(`${import.meta.env.VITE_SERVER_URL}/blog/getComments/${blog._id}`)
        .then((res) => setComments(res.data)); 
      }
    },[blog])

    const deleteComment = async(id) => {
      try {
        // console.log(comments);

        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/blog/deleteComment/${id}/${blog._id}`)
                    .then((res) => setComments(res.data))
                    .catch((err) => console.log(err));
        
        socket.emit('newComment', res.data);                   
      } catch (error) {
        console.log(error);
      }
    }

    

    const handleComment = async() => {
        if(canComment) {
          try {
            const res = await axios
              .post(`${import.meta.env.VITE_SERVER_URL}/blog/comment`, {
                userId: user._id,
                blogId: blog._id,
                comment,
              })
              .then((res) => {
                setBlog(res.data.blog)
                socket.emit('newComment', res.data.newComment);
              })
              .catch((error) => console.error(error));
            setComment("");
          }catch (error) {
            console.error(error);
          }
          
        }
    }

    useEffect(() => {
      if(comments) {

        if(commentSlide) {
          gsap.to(sectionRef.current, {x: 0, duration: 0.7, ease: 'sine.in'});
          gsap.to(sectionRef.current.children, {y: 0, opacity: 1, delay: 0.2, stagger: 0.2, duration: 0.4, ease: 'sine.in'});
        } else {
          gsap.to(sectionRef.current, {x: 400 , duration: 0.7, ease: 'sine.in'});
          gsap.to(sectionRef.current.children, {y: 40, opacity: 0, stagger: 0.1, duration: 0.2, ease: 'sine.in'});
        }
      }
    },[commentSlide])
  return (
    <div className={`${commentSlide ? 'opacity-100 pointer-events-auto' : ''}`}>
      <div ref={sectionRef} className="fixed font-anto overflow-y-auto cmntSection bg-fourth pb-10 top-0 h-full px-3 right-0 z-30 font-inter w-[350px]">
        <div className="flex items-center mt-5 justify-between mx-5">
          <p className="text-2xl font-medium text-primary">Comments</p>
          <span onClick={() => {dispatch(toggleSection(false))}}>
            <RxCross1 />
          </span>
        </div>
        <div className="shadow-md font-anto py-3 my-10 bg-third rounded-xl">
          <div className="flex m-5 flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
            
              <img
                className="w-[30px] h-[30px] rounded-full"
                src={typeof user?.profile_picture === "string" &&
                  user?.profile_picture.startsWith("http")
                    ? user?.profile_picture
                    : `${import.meta.env.VITE_SERVER_URL}/Images/${
                        user?.profile_picture
                      }`}
                alt="author_pic"
                referrerPolicy="no-referrer" 
              />
              <p className='text-primary'>{user?.name}</p>
            </div>
            <textarea
              onChange={(e) => handleChange(e)}
              className="outline-none bg-third resize-none"
              placeholder="share your thoughts"
              value={comment}
            />
          </div>
          <div className="flex items-center pr-3 justify-end">
            <p className="comment_btn">Cancel</p>
            <p
              onClick={handleComment}
              className={`comment_btn ${
                canComment ? "bg-fourth text-primary" : "bg-primary text-fourth"
              }`}
            >
              Send
            </p>
          </div>
        </div>

        <div className="comments">
          {comments &&
            comments.map((comment, id) => (
              <div ref={comRef} className="comment px-4 my-5 border-b-2 border-third pb-3" key={id}>
                <div className="flex items-center gap-2 text-sm">
                
                  <img
                    className="w-[30px] h-[30px] rounded-full"
                    src={typeof comment?.userId?.profile_picture === "string" &&
                      comment?.userId?.profile_picture.startsWith("http")
                        ? comment?.userId?.profile_picture
                        : `${import.meta.env.VITE_SERVER_URL}/Images/${
                            comment?.userId?.profile_picture
                          }`}
                    referrerPolicy="no-referrer" 
                    alt="author_pic"
                  />
                  <p className="text-secondary">{comment?.userId?.name}</p>
                </div>
                <div className="mt-3">
                  <p>{comment?.text}</p>
                </div>
                <div className="flex items-center mt-3 justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <BsHeart />
                    <p>0</p>
                  </div>
                  {user?._id === comment?.userId?._id && (
                    <div onClick={() => deleteComment(comment?._id)}>
                      <BsTrash3 />
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
    }
    
    export default CommentSection