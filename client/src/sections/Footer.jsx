import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
function Footer() {
  return (
    <div className="bg-primary flex flex-col sm:flex-row gap-5 justify-between text-third py-16 px-10 items-center">
      <h1 className="text-4xl md:text-6xl font-lime">Philoog</h1>
      <div className="flex items-center gap-5 text-xl font-lico">
        <p>Connect with me on</p>
        <a href="https://x.com/Praveen_Ajj" className="hover:text-white ease-linear duration-100">
          <FaTwitter />
        </a>
        <a href="https://www.linkedin.com/in/praveen-ajjarapu-229657226/" className="hover:text-white ease-linear duration-100">
          <FaLinkedin />
        </a>
      </div>
    </div>
  );
}

export default Footer