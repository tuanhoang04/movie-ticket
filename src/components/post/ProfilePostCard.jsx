import { useNavigate } from "react-router-dom";

function createSlug(name) {
  return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
export default function PostCard({ data }) {
  const navigate = useNavigate();
  const imageClassName = " h-40 w-32  overflow-hidden rounded-lg";
  const titleClassName = "text-xl text-white";
  const genreClassName = "text-gray-500";
  const contentClassName = "w-full overflow-hidden line-clamp-2 text-white";

  return (
    <div
      className="w-full flex flex-nowrap items-center gap-8 hover:outline p-2 rounded-md hover:cursor-pointer"
      onClick={() => {
        localStorage.setItem("new_id", data.new_id);
        navigate(`/news/${encodeURIComponent(createSlug(data.new_header))}`);
      }}
    >
      <div className={imageClassName}>
        <img src={data.new_img} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="w-full grid grid-cols-1 gap-2">
        <h1 className={titleClassName}>{data.new_header}</h1>

        <h2 className={titleClassName}>{data.film_name}</h2>
        <div className={genreClassName}>
          {/* {data.genres.map((index,value)=>{
                    value
                  })} */}
          genres
        </div>
        <br />
        <div
          className={contentClassName}
          dangerouslySetInnerHTML={{ __html: data.new_content }}
        ></div>
      </div>
    </div>
  );
}
