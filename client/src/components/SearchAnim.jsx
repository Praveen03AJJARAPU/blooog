 import { useDispatch, useSelector } from 'react-redux';
import { setActive } from '../../store/slices/animation';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';

const SearchAnim = () => {
    const {active} = useSelector((state) => state.anim);
    const eleRef = useRef([]);
    const nav = useNavigate();
    const containerRef = useRef(null);
    const dispatch = useDispatch();
    const {top} = useSelector((state) => state.blog);
    const hasMounted = useRef(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dbSearchTerm, setDbSearchTerm] = useState(searchTerm);
    const [searchResult, setSearchResult] = useState({});

useEffect(() => {
  if (!hasMounted.current) {
    hasMounted.current = true;
    return;
  }
  gsap.set(eleRef.current, {y: 0});
  if (active) {
    gsap.to(eleRef.current, {
      y: 0,
      opacity: 1,
      stagger: 0.05,
      delay: 0.5,
      duration: 0.3,
      ease: 0.4,
    });

    gsap.to('.bar', { scaleX: 1, opacity: 1, ease: 0.5, duration: 0.6, delay: 0.5 });
    gsap.to('.cancel', { x: 0, ease: 0.5, duration: 0.3, delay: 1, width: 'auto' });
    gsap.to('.names', {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      ease: 0.5,
      duration: 0.3,
      delay: 1.2,
      height: 'auto',
    });

    gsap.to(containerRef.current, {
      y: 0,
      scaleY: 1,
      ease: 'power1.out',
      duration: 0.6,
    });
  } else {
    gsap.to(eleRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.1,
    });
    gsap.to('.cancel', { x: 30, width: 0 });
    gsap.to('.names', { y: 50, stagger: -0.2, duration: 0.2, opacity: 0 });
    gsap.to('.bar', { scaleX: 0 });
    gsap.to(containerRef.current, {
      y: -200,
      ease: 'power1.in',
      duration: 0.1,
      scaleY: 0,
    });
  }
}, [active]);

useEffect(() => {
  const timer = setTimeout(() => {
    setDbSearchTerm(searchTerm);
  },500)

  return () => {clearTimeout(timer)};
},[searchTerm])


useEffect(() => {
  if(dbSearchTerm) {
    console.log(dbSearchTerm)
    const res = axios.get(`${import.meta.env.VITE_SERVER_URL}/blog/get?q=${encodeURIComponent(dbSearchTerm)}`)
                .then((r) => {setSearchResult(r.data)});
            console.log(searchResult)    
            console.log(searchResult)    
  }              
},[dbSearchTerm])

return (
  <div
    ref={containerRef}
    className="bg-third text-fourth min-h-[300px] top-0 z-40 right-0 w-full fixed"
    style={{ transform: "translateY(-200px)", scaleY: 0 }} // Initialize off-screen
  >
    <div className="flex items-center p-5 justify-between">
      <p className="hidden md:block">
        {"Philoog".split("").map((letter, index) => (
          <span
            key={index}
            style={{ display: "inline-block" }}
            ref={(el) => (eleRef.current[index] = el)}
            className="letters text-4xl font-medium font-lime overflow-hidden"
          >
            {letter}
          </span>
        ))}
      </p>

      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        className="bar py-2 px-3 mr-10 w-[50%] lg:w-[25%] outline-none bg-fourth text-black font-anto text-xl rounded-3xl"
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            nav(`/blogs/${e.target.value}`);
            dispatch(setActive(false));
            setSearchTerm("");
          }
        }}
      />
      <p
        className="cursor-pointer text-sm md:text-xl font-lime cancel"
        onClick={() => dispatch(setActive(false))}
      >
        Cancel
      </p>
    </div>
    <div className="pr-5">
      {searchTerm === "" ? (
        <div className="flex flex-col font-anto text-3xl gap-5 mt-3 mx-5 lg:mx-0 md:items-center">
          {top.map((user) => (
            <Link
              key={user._id}
              className="pr-5 names"
              to={`/profile/${user._id}`}
            >
              {user.name}
            </Link>
          ))}
        </div>
      ) : searchResult.blogs?.length > 0 || searchResult.users?.length > 0 || searchResult.tags?.length > 0 || searchResult.topics?.length > 0 ? (
        <section className="flex flex-col font-anto justify-center items-center text-3xl gap-5 mt-3 mx-5 lg:mx-0 ">
          <div>
            {searchResult.users?.length > 0 && (
              <div className='w-full md:w-max'>
                <p className="mb-2 text-lg md:text-xl md:text-center">Users</p>
                {searchResult.users.map((user, id) => (
                  <div key={id} className="text-lg text-primary">
                    <Link
                      to={`/profile/${user._id}`}
                      onClick={() => dispatch(setActive(false))}
                    >
                      {user.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='w-full md:w-max'>
            {searchResult.blogs?.length > 0 && (
              <div>
                <p className="mb-2 text-lg md:text-xl md:text-center">Blogs</p>
                {searchResult.blogs.map((blog, id) => (
                  <div key={id} className="text-sm md:text-lg text-primary">
                    <Link
                      to={`/blogs/${blog._id}`}
                      onClick={() => dispatch(setActive(false))}
                    >
                      {blog.title}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='w-full md:w-max'>
            {searchResult?.tags[0]?.uniqueTags?.length > 0 && (
              <div>
                <p className="mb-2 text-lg md:text-xl md:text-center">Tags</p>
                {searchResult?.tags[0]?.uniqueTags?.map((t, id) => (
                  <Link to={`/taggedBlogs/${t}`} key={id}  className="text-sm md:text-lg text-primary">
                    {t}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <div className="flex font-anto text-xl items-center justify-center">
          <p>No results found</p>
        </div>
      )}
    </div>
  </div>
);
};

export default SearchAnim