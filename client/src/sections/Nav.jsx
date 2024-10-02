import { useNavigate } from "react-router-dom";
import Search from "../components/Search"
import {useSelector} from 'react-redux'

function Nav() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const handleClick = () => {
    if(isLoggedIn) {
      navigate('/create'); 
    } else {
      console.log("login")
    }
  }
  return (
    <div className="flex font-inter py-3 px-5 border-y-2 border-black items-center justify-between">
      <div className="flex gap-10 items-center">
        <p className="text-4xl font-dm">Blooog</p>
        <Search />
      </div>
      <div className="flex items-center gap-5">
        <p onClick={handleClick}>Create</p>
        <div>
          <p>Profile</p>
        </div>
      </div>
    </div>
  );
}

export default Nav