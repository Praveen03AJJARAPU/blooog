import gsap from "gsap"
import { useEffect, useRef } from "react"

function Hero() {
  const para = useRef(null);

  useEffect(() => {
    gsap.fromTo(para.current, {y: 30, opacity: 0}, {y: 0, opacity: 1, duration: 0.6, ease: 0.5})
  },[])

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center z-0 text-3xl sm:text-5xl md:text-7xl text-center lg:text-8xl bg-primary">
      <div className="h-[100px] overflow-hidden">
        <h1 ref={para} className="font-lime text-fourth">
          Become who you are
        </h1>
      </div>
    </div>
  );
}

export default Hero