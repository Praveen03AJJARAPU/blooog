import './pages.css';
import axios from "axios";
import { Nav } from "../sections";
import { toggleEdit } from "../../store/slices/blog";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import BlogLayout from "../components/BlogLayout";
import SearchAnim from "../components/SearchAnim";
import CircularProgress from '@mui/material/CircularProgress';
import EditProfile from "../sections/EditProfile";
import { setUserData } from '../../store/slices/auth';
import { toast, ToastContainer } from 'react-toastify';

function Profile() {
    const {id} = useParams();

    const {blogStore} = useSelector((state) => state.blog)
    const logger = useSelector((state) => state.auth.user)
    const [user, setUser] = useState();
    const [selectedTab, setSelectedTab] = useState(1);
    const [underLineStyle, setUnderLineStyle] = useState({});
    const [saved, setSaved] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const tabsRef = useRef([]);
    const dispatch = useDispatch();

    const handleFollowing = async() => {
      console.log(logger._id, user._id);
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/blog/follow`,
        {userId: logger._id, accId: user._id}
      ).then((res) => {
        if(res.status == 200) {
          toast.success(res.data.message);
          setUserData(res.data.user);
          setUser(res.data.acc);
          console.log(user)
        } else {
          toast.error(res.data);
        }
      })
    }

    useEffect(() => {
        if(tabsRef.current[selectedTab]) {
            const { offsetLeft, offsetWidth } = tabsRef.current[selectedTab];
            setUnderLineStyle({
                left: offsetLeft,
                width: offsetWidth
            })
        }
    },[selectedTab])
  

    useEffect(() => {
      const u = axios
        .get(`${import.meta.env.VITE_SERVER_URL}/blog/getUser/${id}`)
        .then((res) => setUser(res.data));
    },[user])

    
  return (
    <section>
      <ToastContainer
        position="top-center"
        hideProgressBar="true"
        draggable
        pauseOnHover
        theme="light"
      />
      {id && user ? (
        <div>
          <Nav />
          <SearchAnim />

          <EditProfile user={user} />

          <section className="flex font-anto text-fourth bg-primary py-20 min-h-[100vh] font-inter justify-center">
            <div className="md:border-r-[1px] w-[100vw] lg:w-max px-[20px] border-third pt-10 pr-16">
              <div className="flex md:flex-row flex-col items-center gap-10">
                <img
                  className="w-[100px] h-[100px] rounded-full object-cover block md:hidden"
                  src={
                    typeof user?.profile_picture === "string" &&
                    user?.profile_picture.startsWith("http")
                      ? user?.profile_picture
                      : `${import.meta.env.VITE_SERVER_URL}/Images/${
                          user?.profile_picture
                        }`
                  }
                  alt="pp"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-2xl md:text-5xl text-third mb-5">
                    {user?.name}
                  </p>
                  <div className="flex text-xs items-center gap-5">
                    <p>{user.followers.length} followers</p>
                    <p>{user.following.length} following</p>
                    {logger?._id != user?._id &&
                      (!user.followers.includes(logger._id) ? (
                        <p
                          onClick={() => handleFollowing()}
                          className="my-2 px-4 py-2 bg-fourth text-primary w-max rounded-full"
                        >
                          Follow
                        </p>
                      ) : (
                        <p
                          onClick={() => handleFollowing()}
                          className="my-2 px-4 py-2 bg-third text-fourth w-max rounded-full"
                        >
                          Following
                        </p>
                      ))}
                  </div>
                  {logger?._id == user?._id && (
                    <p
                      onClick={() => dispatch(toggleEdit(true))}
                      className="mt-3 block md:hidden cursor-pointer text-green-600 font-medium"
                    >
                      Edit Profile
                    </p>
                  )}
                </div>
              </div>
              <div className="flex w-full my-10 border-b-[.3px] border-b-third text-third relative items-center gap-10">
                <p
                  className={`tabs ${
                    logger?._id == user?._id ? "block" : "hidden"
                  }`}
                  ref={(el) => (tabsRef.current[0] = el)}
                  onClick={() => setSelectedTab(0)}
                >
                  Home
                </p>
                <p
                  className="tabs"
                  ref={(el) => (tabsRef.current[1] = el)}
                  onClick={() => setSelectedTab(1)}
                >
                  Blogs
                </p>
                <div
                  className="underline bg-fourth"
                  style={underLineStyle}
                ></div>
              </div>
              {selectedTab == 0 ? (
                <div>
                  {logger?._id == user?._id && (
                    <div>
                      {user.saved.length == 0 ? (
                        <p>Not coming to an agreement...</p>
                      ) : (
                        <div>
                          <p className="text-sm">Saved</p>
                          {user?.saved.map((b, id) => (
                            <BlogLayout blog={b} id={id} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {user.blogs.length == 0 ? (
                    <p>Still finding himself...</p>
                  ) : (
                    <div>
                      {user?.blogs.map((b, id) => (
                        <BlogLayout blog={b} id={id} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="hidden md:block">
              {user && (
                <div className="pl-10 mt-16">
                  <img
                    className="w-[100px] h-[100px] object-cover"
                    src={
                      typeof user?.profile_picture === "string" &&
                      user?.profile_picture.startsWith("http")
                        ? user?.profile_picture
                        : `${import.meta.env.VITE_SERVER_URL}/Images/${
                            user?.profile_picture
                          }`
                    }
                    alt="dp"
                    referrerPolicy="no-referrer"
                  />
                  <p>{user?.name}</p>
                  <p>{user?.bio}</p>
                  {logger?._id == user?._id && (
                    <p
                      onClick={() => dispatch(toggleEdit(true))}
                      className="mt-3 cursor-pointer text-green-600 font-medium"
                    >
                      Edit Profile
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="w-[100vw] h-[100vh] bg-primary flex justify-center items-center">
          <CircularProgress color={"secondary"} />
        </div>
      )}
    </section>
  );
}

export default Profile