import { PiHandHeartLight } from "react-icons/pi";
import { PiHandHeartFill } from "react-icons/pi";
import { useSelector } from "react-redux";

function Likes({blog}) {
    // const {blogStore} = useSelector((state) => state.blog);
    const {username} = useSelector((state) => state.auth);
    // const blog = blogStore[id];
  return (
    <span className="flex items-center gap-3">
      {blog?.likes?.includes(username) ? (
        <PiHandHeartFill size={25} />
      ) : (
        <PiHandHeartLight size={25} />
      )}
      <p>{blog?.likes?.length}</p>
    </span>
  );
}

export default Likes