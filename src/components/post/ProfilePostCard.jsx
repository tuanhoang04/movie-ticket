export default function PostCard({ data }) {
  const imageClassName = " h-40 w-32  overflow-hidden rounded-lg";
  const titleClassName = "text-xl text-white";
  const genreClassName = "text-gray-500";
  const contentClassName = "w-full overflow-hidden line-clamp-2 text-white";

  return (
    <div className="w-full flex flex-nowrap items-center gap-8 hover:outline p-2 rounded-md hover:cursor-pointer">
      <div className={imageClassName}>
        <img src={data.new_img} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="w-full grid grid-cols-1 gap-2">
        <h1 className={titleClassName}>{data.new_header}</h1>

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
