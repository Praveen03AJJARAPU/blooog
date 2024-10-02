import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import './sections.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { BsHeart } from "react-icons/bs";
import { BsHeartFill } from "react-icons/bs";
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SERVER_URL);


function CommentSection({blog}) {
    const {user} = useSelector((state) => state.auth);
    const [comment, setComment] = useState("");
    const [canComment, setCanComment] = useState(false);
    const [comments, setComments] = useState([]);

    const handleChange = (e) => {
        const value = e.target.value;
        setComment(value);
        value.length > 1 ? setCanComment(true) : setCanComment(false);
    }

    useEffect(() => {
      socket.on('commentAdded', (newComment) => {
        setComments((prev) => [...prev, newComment]);
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
                socket.emit('newComment', res.data);
              })
              .catch((error) => console.error(error));
            setComment("");
          }catch (error) {
            console.error(error);
          }
          
        }
    }
  return (
    <div>
      <div className="fixed overflow-y-auto pb-10 top-0 h-full px-3 right-0 z-30 font-inter w-[350px] bg-white">
        <div className="flex items-center mt-5 justify-between mx-5">
          <p className="text-2xl font-extralight">Comments</p>
          <RxCross1 />
        </div>
        <div className="shadow-md pb-5 my-10 border-b-8 rounded-xl">
          <div className="flex m-5 flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <img
                className="w-[30px] h-[30px] rounded-full"
                src={user?.profile_picture}
                alt="author_pic"
              />
              <p>{user?.name}</p>
            </div>
            <textarea
              onChange={(e) => handleChange(e)}
              className="outline-none resize-none"
              placeholder="share your thoughts"
              value={comment}
            />
          </div>
          <div className="flex items-center pr-3 justify-end">
            <p className="comment_btn">Cancel</p>
            <p
              onClick={handleComment}
              className={`comment_btn ${
                canComment ? "bg-green-500" : "bg-green-300"
              }`}
            >
              Send
            </p>
          </div>
        </div>

        <div className="comments">
          {comments &&
            comments.map((comment, id) => (
              <div className="comment px-4 my-5 border-b-2 pb-3" key={id}>
                <div className="flex items-center gap-2 text-sm">
                  <img
                    className="w-[30px] h-[30px] rounded-full"
                    src={comment.userId?.profile_picture}
                    alt="author_pic"
                  />
                  <p className="text-slate-700">{comment.userId?.name}</p>
                </div>
                <div className="mt-3">
                  <p>{comment.text}</p>
                </div>
                <div className="flex items-center gap-2 text-xs mt-3">
                  <BsHeart />
                  <p>0</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
    }
    
    export default CommentSection