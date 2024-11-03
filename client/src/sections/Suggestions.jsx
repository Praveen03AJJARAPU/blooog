import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";


function Suggestions() {
  const [users, setUsers] = useState([]);
  const {top} = useSelector((state) => state.blog);
  const nav = useNavigate();
  
  useEffect(() => {
    setUsers(top);
    console.log(users)
    console.log(users)
  },[])
 
  return (
    <div>
      <p className="text-3xl font-lime">Suggestions</p>
      <div className="flex flex-col gap-5 mt-5">
        {users && users.map((user, id) => (
          
            
            <div
              key={id}
              onClick={() => nav(`/profile/${user?._id}`)}
              className="flex items-center gap-4 font- text-xl"
            >
              <img
                className="w-[50px] h-[50px] rounded-full"
                src={typeof user?.profile_picture === "string" &&
                  user?.profile_picture.startsWith("http")
                    ? user?.profile_picture
                    : `${import.meta.env.VITE_SERVER_URL}/Images/${
                        user?.profile_picture
                      }`}
                referrerPolicy="no-referrer" 
                alt="pp"
              />
              <p>{user.name}</p>
            </div>
          
        ))}
      </div>
    </div>
  );
}

export default Suggestions