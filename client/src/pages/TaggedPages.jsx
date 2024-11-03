import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Nav, Suggestions } from "../sections";
import SearchAnim from "../components/SearchAnim";
import BlogLayout from "../components/BlogLayout";


function TaggedPages() {
    const {tag} = useParams();
    const [searchResult, setSearchResult] = useState([]);
    useEffect(() => {
        const res = axios.get(`${import.meta.env.VITE_SERVER_URL}/blog/get?q=${encodeURIComponent(tag)}`)
                .then((r) => {setSearchResult(r.data.topics)});
                console.log(searchResult)
                
    },[tag])
  return (
    <div>
      <Nav />
      <SearchAnim />
      <div className="bg-fourth pt-16 font-anto min-h-[100vh] w-[100vw]">
        <p className="text-third mx-10 my-5 text-3xl"> {tag} blogs</p>
        <div className="flex md:justify-around mx-10">
          {searchResult.map((b, id) => (
            <BlogLayout blog={b} key={id} />
          ))}
          <div className="hidden lg:block">

          <Suggestions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaggedPages