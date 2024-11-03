import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Home, Editor, Login, Publish, Profile } from './pages';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { setLogIn } from '../store/slices/auth';
import { useNavigate } from 'react-router-dom';
import BlogDetails from './pages/BlogDetails';
import { topUsers } from '../store/slices/blog';
import BlogPages from './pages/BlogPages';
import TaggedPages from './pages/TaggedPages';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  console.log(user, isLoggedIn)
  useEffect(() => {
    const res = axios
      .get(`${import.meta.env.VITE_SERVER_URL}/blog/getPopular`)
      .then((res) => dispatch(topUsers(res.data)));
  }, []);

  const [loading, setLoading] = useState(true);
useEffect(() => {
  const getStatus = async () => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedLoggedIn = localStorage.getItem("loggedIn");

      if (savedUser && savedLoggedIn) {
        dispatch(setLogIn({ loggedIn: true, user: JSON.parse(savedUser)}));
        setLoading(false);
        return;
      }
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth/status`,
        { withCredentials: true }
      );
      dispatch(setLogIn({ loggedIn: res.data.loggedIn, user: res.data.user }));
      if (!res.data.loggedIn && window.location.pathname !== "/login") {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      if (window.location.pathname !== "/login") {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };
  getStatus();
}, [dispatch]);
 
  
  
if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route exact path="/" element={<Home />} />
      <Route path="/create" element={<Editor />} />
      <Route path="/blogs/:term" element={<BlogPages />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/taggedBlogs/:tag" element={<TaggedPages />} />
      <Route path="/publish" element={<Publish />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
    </Routes>
  );
}

export default App;
