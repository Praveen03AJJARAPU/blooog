import { FaGoogle } from "react-icons/fa";
import { authStyleBtn, inputStyle } from ".";

function LoginTemp() {
    const google = () => {
        window.open("http://localhost:5000/auth/google", "_self")
    }
  return (
    <div className="bg-white p-16 font-dm flex items-center justify-evenly w-full">
      <p className="hidden md:block md:text-6xl lg:text-9xl">Blooog</p>
      <div>
        <p className="text-4xl mb-10 underline">Login</p>
        <form action="#" className="flex flex-col gap-10">
          <input
            className={`${inputStyle}`}
            placeholder="email"
            type="email"
            required
          />

          <input
            className={`${inputStyle}`}
            placeholder="password"
            type="password"
            required
          />

          <button type="submit" className="bg-black text-white py-1">
            Login
          </button>
        </form>
        <p className="text-center my-5">or</p>
        <div className={`${authStyleBtn}`} onClick={google}>
          <FaGoogle />
          <p>Sign with google</p>
        </div>
      </div>
    </div>
  );
}

export default LoginTemp