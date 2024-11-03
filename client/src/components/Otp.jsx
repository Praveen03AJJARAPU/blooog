import gsap from 'gsap';
import axios from 'axios';
import img from '../assets/default.jpg';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { HiXMark } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { setLogIn, setOTPSlide } from '../../store/slices/auth';
import { useNavigate } from 'react-router-dom';


function Otp({details}) {
    const [code, setCode] = useState('');
    const {name, email, password} = details;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = (code) => setCode(code);
    const {openOTPSlide} = useSelector((state) => state.auth)
    const otpRef = useRef(null);
    useEffect(() => {
        if (otpRef.current) {
            if (openOTPSlide) {
                gsap.to(otpRef.current, { y: 0, opacity: 1, duration: 0.5 });
            } else {
                gsap.to(otpRef.current, { y: 150, opacity: 0, duration: 0.5 });
            }
        }
    },[openOTPSlide])

    const handleVerification = async() => {
        try {
          const res = await axios
            .post(`${import.meta.env.VITE_SERVER_URL}/auth/verifyOTP`, {name, email, password, otp: code, image: 'https://lh3.googleusercontent.com/a/ACg8ocIlUujr1OAr0ScqUgDiiTl2v8RMnzsTNERg7spgtArJh09rSQ=s96-c'})
            .then((res) => {
              if (res.data.success) {
                dispatch(setLogIn({ loggedIn: true, user: res.data.user }));
                navigate("/");

                setTimeout(() => {
                  //getStatus();
                }, 1000);
                // console.log(res.data)
              } else {
                toast.error(res.data.message);
              }
            });
        } catch (error) {
            console.log(error)
        }
    }


    
  return (
    <div ref={otpRef} className="bg-fourth p-10 text-primary">
      <span
        onClick={() => dispatch(setOTPSlide(false))}
        className="absolute top-8 right-5"
      >
        <HiXMark size={25} />
      </span>

      <p className="text-4xl my-5">OTP</p>
      <div>
        <OtpInput
          
          value={code}
          onChange={handleChange}
          numInputs={6}
          separator={<span style={{ width: "8px" }}></span>}
          isInputNum={true}
          shouldAutoFocus={true}
          inputStyle={{
            border: "1px solid transparent",
            borderRadius: "8px",
            width: "54px",
            height: "54px",
            fontSize: "12px",
            color: "#000",
            marginRight: "10px",
            fontWeight: "400",
            caretColor: "blue",
          }}
          focusStyle={{
            border: "1px solid #CFD3DB",
            outline: "none",
          }}
          renderInput={(props) => <input {...props} />}
        />
      </div>

      <p className="text-third my-3">Resend OTP</p>
      <p
        onClick={() => {dispatch(setOTPSlide(true)); handleVerification()}}
        className="text-center px-5 bg-primary py-2 rounded-full text-fourth"
      >
        Verify
      </p>
    </div>
  );
}

export default Otp