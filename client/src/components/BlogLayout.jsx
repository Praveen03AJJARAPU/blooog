import { FaRegComment } from "react-icons/fa"
import Likes from "./Like"
import { BsBookmarkFill, BsBookmarks, BsBookmarksFill } from "react-icons/bs"
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";


function BlogLayout({blog, id}) {
  const nav = useNavigate();

  return (
    <div>
      {blog ? (
        <div
          key={id}
          onClick={() => nav(`/blog/${blog?._id}`)}
          className="my-12 cursor-pointer font-anto"
        >
          <div className="flex lg:flex-row flex-col lg:gap-5 lg:items-center">
            <div className="w-full lg:w-[200px] xl:w-[250px] h-[150px] lg:h-[150px]">
              <img
                className="w-full h-full object-cover"
                src={`${import.meta.env.VITE_SERVER_URL}/Images/${blog?.image}`}
                alt="blog_front_cover"
              />
            </div>
            <div>
              <div className="header lg:w-[500px] xl:[600px] px-3">
                <h2 className="text-xl md:text-2xl lg:text-2xl text-primary font-bold">
                  {blog?.title}
                </h2>
                <h2 className="text-lg md:text-xl lg:text-xl my-3">
                  {blog?.subTitle}
                </h2>
                <div className="profile flex items-center mb-3 text-md gap-3 text-slate-600">
                  <img
                    className="w-[20px] h-[20px] object-cover rounded-full"
                    src={
                      typeof blog?.creator?.profile_picture === "string" &&
                      blog?.creator?.profile_picture.startsWith("http")
                        ? blog?.creator?.profile_picture
                        : `${import.meta.env.VITE_SERVER_URL}/Images/${
                            blog?.creator?.profile_picture
                          }`
                    }
                    alt="creator_dp"
                    referrerPolicy="no-referrer"
                  />
                  <p>
                    {" "}
                    {blog?.creator?.name} in{" "}
                    {blog?.tags?.length > 0 && <span className="capitalize">{blog?.tags[0]}</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="social mx-5 md:mx-0 mt-2 px-2 flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Likes blog={blog} />
              <span className="flex items-center gap-3">
                <FaRegComment className="text-slate-700" size={20} />
                <p>{blog?.comments?.length}</p>
              </span>
            </div>
            <span>
              <BsBookmarksFill />
            </span>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default BlogLayout