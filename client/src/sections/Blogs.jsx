import axios from 'axios'
import { useEffect } from "react"
import TagsSelector from "../components/TagsSelector"
import { useDispatch, useSelector } from "react-redux";
import { addBlogs } from '../../store/slices/blog';
import BlogLayout from '../components/BlogLayout';

function Blogs() {
  const { blogStore, tagSelected } = useSelector((state) => state.blog);
  const dispatch = useDispatch();

  useEffect(() => {
   const response = axios.get(`${import.meta.env.VITE_SERVER_URL}/blog/get/${tagSelected}`)
   .then((res) => dispatch(addBlogs(res.data)));
  }, []) 
  return (
    <div className="py-10">
      <TagsSelector />
      {blogStore.length > 0 &&
        blogStore.map((blog, id) => (
          <BlogLayout blog={blog} id={id} />
        ))}
    </div>
  );
}

export default Blogs