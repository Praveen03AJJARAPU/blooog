import { useNavigate } from "react-router-dom";
import Search from "../components/Search"
import {useDispatch, useSelector} from 'react-redux'
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HiOutlineBars3 } from "react-icons/hi2";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setActive } from "../../store/slices/animation";
import { setLogIn } from "../../store/slices/auth";

function Nav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const ref = useRef(), isMounted = useRef(false);
  gsap.registerPlugin(ScrollTrigger)

  const handleClick = () => {
    if(isLoggedIn) {
      navigate('/create'); 
    } else {
      console.log("login")
    }
  }

  useEffect(() => {
    const changeNavColor = () => {
      const navbar = document.querySelector('.navBar');
      ScrollTrigger.create({
        trigger: '.topics',
        start: 'top 10%',
        onEnter: () => {
          gsap.fromTo(navbar,{scaleX: 0, color: '#fff'}, {backgroundColor: '#697565', color: '#3C3D37', z: 100, scaleX: 1, duration: 0.5, ease: 'power4.inOut'})
        },
        onLeaveBack: () => {
          gsap.to(navbar, {scaleX: 0,backgroundColor: 'transparent', duration: 0.1})
        }
      })
    }
    changeNavColor();

    return () => {
      ScrollTrigger.killAll();
    }
  },[])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return; 
    }
    if(open) {
      gsap.to(ref.current, {x: 0})
      gsap.to('.navFlex', {opacity: 1,
        y: 0,
        stagger: 0.2,
        ease: 'ease',
        duration: 0.3,
        delay: 0.2,
        height: "auto",});
    } else {
      gsap.to(ref.current, {x: 500})
      gsap.to('.navFlex', {y: 30, opacity: 0});
    }
  },[open])

  const logout = () => {
    dispatch(setLogIn({loggedIn: false, user: null }))
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
    window.open(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, "_self");
  }

  return (
    <div className="fixed font-lico text-3xl z-30 top-0 w-[100%] text-fourth">
      <div className="flex relative py-3 px-5 items- justify-between">
        <div className="navBar absolute -z-30 h-[60px] right-0 overflow-hidden w-[100%] top-0"></div>
        <div className="flex z-50 gap-10 items-center">
          <p className="text-4xl font-lico">Philoog</p>
        </div>
        <div className="block md:hidden">
          <span onClick={() => setOpen(true)}>
            <HiOutlineBars3 />
          </span>
          <div ref={ref} className="fixed font-anto top-0 right-0 w-screen sm:w-[350px] bg-third h-screen">
            <p onClick={() => setOpen(false)} className="float-right navFlex m-5 text-[20px] font-light">Cancel</p>
            <div className="flex h-[50%] w-full items-center justify-center">
              <div className="flex font-lime flex-col gap-10">
                <p className="navFlex" onClick={() => {dispatch(setActive(true));setOpen(false);}}>Search</p>
                <p className="navFlex" onClick={() => navigate(`/profile/${user._id}`)}>Profile</p>
                <p className="navFlex" onClick={handleClick}>Create</p>
                <p className="navFlex" onClick={logout}>Logout</p>
              </div>
            </div>
            <div className="absolute bottom-10 border-t-2 w-full ">
              <div className="flex gap-5 navFlex w-full justify-center mt-5 items-center">
                <img
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="w-[30px] h-[30px] rounded-full cursor-pointer"
                  src={typeof user?.profile_picture === "string" &&
                    user?.profile_picture.startsWith("http")
                      ? user?.profile_picture
                      : `${import.meta.env.VITE_SERVER_URL}/Images/${
                          user?.profile_picture
                        }`}
                  referrerPolicy="no-referrer" 
                  alt=""
                />
                <p>{user?.name}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="flex z-50 items-center gap-16">
            <Search />
            <p className="cursor-pointer" onClick={handleClick}>
              Create
            </p>
            <p onClick={logout} className="cursor-pointer font-lico">
              Logout
            </p>
            <img
              onClick={() => navigate(`/profile/${user._id}`)}
              className="w-[30px] h-[30px] rounded-full cursor-pointer"
              src={typeof user?.profile_picture === "string" &&
                user?.profile_picture.startsWith("http")
                  ? user?.profile_picture
                  : `${import.meta.env.VITE_SERVER_URL}/Images/${
                      user?.profile_picture
                    }`}
              referrerPolicy="no-referrer" 
              alt="pp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav