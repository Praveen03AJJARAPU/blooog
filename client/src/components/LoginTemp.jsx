import axios from "axios";
import gsap from 'gsap'
import Otp from "./Otp";
import image from '../assets/default.jpg'
import { FaGoogle } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'
import { authStyleBtn, inputStyle } from ".";
import { ToastContainer, toast } from 'react-toastify';
import { setLogIn, setOtp, setOTPSlide } from "../../store/slices/auth";
import { useNavigate } from "react-router-dom";

function LoginTemp() {
  const dispatch = useDispatch();
  const otpRef = useRef(null); 
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [details, setDetails] = useState({email: '', name: '', password: ''});
  const [login, setLogin] = useState(true);
  const {openOTPSlide} = useSelector((state) => state.auth)

  const handleLogin = async(e) => {
    try {
      e.preventDefault();
      if(login) {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/register`, {email: details.email, password: details.password, login: true})
                    .then((res) => {
                      console.log(res)
                      if(res.data.success) {
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                        localStorage.setItem("loggedIn", JSON.stringify(true));
                        dispatch(
                          setLogIn({ loggedIn: true, user: res.data.user })
                        );
                        navigate("/");

                        setTimeout(() => {
                        }, 1000);
                      } else {
                          toast.error(res.data.message);
                      }
                  });
      } else {
        console.log('send')
        const res = await axios
          .post(`${import.meta.env.VITE_SERVER_URL}/auth/sendOTP`, {
            email: details.email
          })
          .then((res) => {
            if(res.data.success) {
              const {message, otp} = res.data;
              toast.success(message);
              dispatch(setOTPSlide(true));
              dispatch(setOtp(otp))
              gsap.to(otpRef, {y: 0, opacity: 1});
            } else {
              toast.error(res.data.message);
            }
          });
      }
    } catch (error) {
      console.log(error)
      toast.error('Internal server error');
    }
  }
  const google = () => {
    window.open(`${import.meta.env.VITE_SERVER_URL}/auth/google`, "_self");
  };

  useEffect(() => {
    if(openOTPSlide) {
      gsap.to(otpRef.current, {y: 0, opacity: 1})
    } else {
      gsap.to(otpRef.current, {y: '150%', opacity: 0})
    }
  }, [openOTPSlide])
  
  return (
    <div className="p-16 font- font-anto flex items-center justify-evenly w-[100vw] h-[100vh] ">
      <ToastContainer
        position="top-center"
        hideProgressBar="true"
        draggable
        pauseOnHover
        theme="light"
      />
      {/* <div  > */}
      <div className="fixed  top-[30%]"  ref={otpRef}>
        <Otp details={details} />
      </div>
      {/* </div> */}
      <p className="hidden font-lime  md:block md:text-7xl lg:text-9xl">
        Philoog
      </p>
      <div className="w-[210px] md:w-[300px]">
        <form action="#" className="flex flex-col gap-10">
          {!login && (
            <input
              className={`${inputStyle}`}
              onChange={(e) =>
                setDetails((det) => ({ ...det, name: e.target.value }))
              }
              placeholder="name"
              required
            />
          )}
          <input
            className={`${inputStyle}`}
            placeholder="email"
            type="email"
            value={details.email}
            onChange={(e) =>
              setDetails((det) => ({ ...det, email: e.target.value }))
            }
            required
          />
          <input
            className={`${inputStyle}`}
            placeholder="password"
            onChange={(e) =>
              setDetails((det) => ({ ...det, password: e.target.value }))
            }
            type="password"
            required
          />
          {login ? (
            <p>
              New philosopher?{" "}
              <span
                className="text-third border-b-2 cursor-pointer"
                onClick={() => setLogin(false)}
              >
                Register
              </span>
            </p>
          ) : (
            <p>
              Wo bist du Übermensch?{" "}
              <span
                className="text-third border-b-2 cursor-pointer"
                onClick={() => setLogin(true)}
              >
                Login
              </span>
            </p>
          )}
          <button
            onClick={(e) => handleLogin(e)}
            className="bg-fourth text-primary py-1"
          >
            {login ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-center my-5">or</p>
        <div
          className={`${authStyleBtn} bg-third hover:bg-secondary`}
          onClick={google}
        >
          <FaGoogle />
          <p>Sign with google</p>
        </div>
      </div>
    </div>
  );
}

export default LoginTemp
