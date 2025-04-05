export default function PostCard({data}){
    const titleClassName = "h-7 w-1/2 skeleton-bg";
    const genreClassName = "h-5 w-1/4 skeleton-bg";
    const contentClassName = "h-4 w-full skeleton-bg";

    return (
        <div className="w-full flex animate-pulse flex-nowrap items-center gap-8">
              <div className= "">
                <img src={data.image} alt="" />
              </div>
              <div className="w-full flex flex-col gap-2">
                <h1 className={titleClassName}>
                  {data.title}
                </h1>
                
                <div
                  className={genreClassName}
                >
                  {data.genres.map((index,value)=>{
                    value
                  })}
                </div>
                <br />        
                <div
                  as="div"
                  variant="paragraph"
                  className={contentClassName}
                >
                  {data.content}
                </div>
                
              </div>
            </div>
    )
}