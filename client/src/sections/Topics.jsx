import gsap from "gsap";
import { FaArrowUpLong } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

function Topics() {
    const containerRef = useRef([]);
    const [animIdx, setAnimIdx] = useState(-1);
    const nav = useNavigate();
    const paras = ["Ethics", "Morals", "Logics", "Metaphysics"];

    

    const generateText = (text) => {
      const res = [];
      for(let i = 0; i < 6; i++) {
        res.push(
          <span style={{ marginRight: "70px" }} className="flex items-center gap-2" key={i}>
            {text} {" "}
            <FaArrowUpLong className="rotate-45" />
          </span>
        );
      }
      return res;
    }

    useEffect(() => {

        const tl = gsap.timeline();
        if(animIdx != -1 && containerRef.current[animIdx]) {
          tl.fromTo(containerRef.current[animIdx], {scaleY: 0}, {scaleY: 1, zIndex: 0,ease: "power4.inOut" , duration: 0.6});        
          tl.fromTo(containerRef.current[animIdx].querySelector("span"), {y: 70, x: 500, opacity: 0}, {y: 50, x: 1700, ease: "power3.inOut",opacity: 1, duration: 0.6}, "<0.1")
        }  
      
      return () => {
      
        if(animIdx !== -1 && containerRef.current[animIdx]) {
          const tl = gsap.timeline();
          tl.to(containerRef.current[animIdx], {scaleY: 0, x: 400, duration: 0.6});
        } 
      }
      
    },[animIdx])
    

  return (
    <div className="w-[100vw]  topics overflow- h-[100vh] bg-secondary">
      <div className="font-lime items-center justify-center w-full text-6xl xl:text-8xl whitespace-nowrap text-fourth flex flex-col">
        {paras.map((text, index) => (
          <div onClick={() => nav(`/blogs/${text}`)}>
            {index == animIdx ? (
              <div
                key={index}
                style={{ height: "25vh", width: "100vw" }}
                ref={(el) => {
                  containerRef.current[index] = el;
                }}
                onMouseLeave={() => {
                  setAnimIdx(-1);
                }}
                className="flex  bg-fourth relative py-5 text-primary items-center"
              >
                <div className="absolute right-full top-0 -z-40">
                  <span className="flex items-center">
                    {generateText(text)}
                  </span>
                </div>
              </div>
            ) : (
              <div  className="h-[25vh] -z-30 w-[100vw] flex justify-center items-center">
                <p onMouseEnter={() => setAnimIdx(index)} key={index}>
                  {text}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Topics