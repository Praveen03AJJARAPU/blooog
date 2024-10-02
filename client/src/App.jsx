import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Home, Editor, Login, Publish } from './pages';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';
import { setLogIn } from '../store/slices/auth';
import { useNavigate } from 'react-router-dom';
import BlogDetails from './pages/BlogDetails';


function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/status`, { withCredentials: true });
        dispatch(setLogIn({ loggedIn: res.data.loggedIn, user: res.data.user }));
        if (res.data.loggedIn) {
          navigate('/', {replace: true});
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error(error);
        navigate('/login'); 
      }
    };
    getStatus();
  }, [dispatch]);

  return (
    
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route exact path='/' element={isLoggedIn ? <Home /> : <Login />} />
        <Route path='/create' element={<Editor />} />
        <Route path='/publish' element={<Publish />} />
        <Route path='/blog/:id' element={<BlogDetails />} />
      </Routes>
   
  );
}

export default App;
