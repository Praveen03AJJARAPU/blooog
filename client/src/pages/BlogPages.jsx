import './pages.css'
import Nav from '../sections/Nav'
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import SearchAnim from '../components/SearchAnim';
import axios from 'axios';
import BlogDetails from './BlogDetails';
import BlogLayout from '../components/BlogLayout';
import { useSelector } from 'react-redux';

function BlogPages() {
    const {term} = useParams();
    const {user} = useSelector((state) => state.auth);
    const tabRef = useRef([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [underLineStyle, setUnderLineStyle] = useState({});
    const [searchResult, setSearchResult] = useState({});
    useEffect(() => {
      if(tabRef.current[selectedTab]) {
          const { offsetLeft, offsetWidth } = tabRef.current[selectedTab];
          setUnderLineStyle({
              left: offsetLeft,
              width: offsetWidth
          })
      }
      console.log(selectedTab)
  },[selectedTab])

  useEffect(() => {
    if(term) {
      console.log(term)
      const res = axios
        .get(
          `${import.meta.env.VITE_SERVER_URL}/blog/get?q=${encodeURIComponent(
            term
          )}`
        )
        .then((r) => {
          setSearchResult(r.data);
        });
        console.log(searchResult);
        console.log(searchResult);
        
    }
  },[term])

  return (
    <div>
      <Nav />
      <SearchAnim />
      <div>
        {searchResult && (
          <div className="bg-primary md:px-24 py-16 min-h-[100vh] text-third mt-14 font-anto h-full">
            <p className="text-4xl">
              <span className="text-fourth">{term}</span> results
            </p>
            <div className="flex relative mt-10 gap-10 text-xl items-center">
              {["Blogs", "Topics", "Users"].map((tabName, index) => (
                <p
                  ref={(el) => (tabRef.current[index] = el)}
                  className="tabs"
                  key={index}
                  onClick={() => setSelectedTab(index)}
                >
                  {tabName}
                </p>
              ))}
              <div className="underline bg-fourth" style={underLineStyle}></div>
            </div>
            <div className="mt-5">
              {selectedTab == 0 && searchResult?.blogs?.length > 0 ? (
                <div className="w-[50%]">
                  {searchResult?.blogs?.map((b, id) => (
                    <BlogLayout blog={b} id={id} />
                  ))}
                </div>
              ) : (
                <div>{selectedTab == 0 && <p>No blogs found</p>}</div>
              )}

              {selectedTab == 1 && searchResult?.tags[0]?.uniqueTags?.length > 0 ? (
                <div className="flex items-center flex-wrap lg:w-[50%]">
                  {searchResult?.tags[0].uniqueTags.map((b, id) => (
                  <p className= 'bg-third px-3 py-2 rounded-full text-fourth'>{b}</p>
                  ))}
                </div>
              ) : (
                <div>{selectedTab == 1 && <p>No topics found</p>}</div>
              )}

              {selectedTab == 2 && searchResult?.users?.length > 0 ? (
                <div className="md:w-[50%]">
                  {searchResult?.users?.map((u, id) => (
                    <div  className="flex items-center gap-16" key={id}>
                      <div className='flex items-center gap-5'>
                      
                        <img
                          className="w-[70px] h-[70px] rounded-full"
                          src={typeof u?.profile_picture === "string" &&
                            u?.profile_picture.startsWith("http")
                              ? u?.profile_picture
                              : `${import.meta.env.VITE_SERVER_URL}/Images/${
                                  u?.profile_picture
                                }`}
                          alt="pp"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p>{u?.name}</p>
                          <p>{u?.bio}</p>
                        </div>
                      </div>
                      <Link to={`/profile/${u?._id}`} className='bg-fourth text-primary px-4 rounded-full py-2'>{user.following.includes(u._id) ? (<p>Following</p>) : (<p>Follow</p>)}</Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div>{selectedTab == 2 && <p>No users found</p>}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogPages