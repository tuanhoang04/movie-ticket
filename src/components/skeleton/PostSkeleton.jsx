import { Typography } from "@material-tailwind/react";
 
export default function PostSkeleton() {
    const titleClassName = "h-7 w-1/2 skeleton-bg";
    const genreClassName = "h-5 w-1/4 skeleton-bg";
    const textClassName = "h-4 w-full skeleton-bg";
    const imageClassName = "h-12 w-12 skeleton-img";


  return (
    <div className="w-full flex animate-pulse flex-nowrap items-center gap-8">
      <div className="grid h-36 w-24 place-items-center rounded-lg bg-gray-100 bg-opacity-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={imageClassName}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </div>
      <div className="w-full flex flex-col gap-2">
        <Typography
          as="div"
          variant="h1"
          className={titleClassName}
        >
          &nbsp;
        </Typography>
        
        <Typography
          as="div"
          variant="paragraph"
          className={genreClassName}
        >
          &nbsp;
        </Typography>
        <br />        
        <Typography
          as="div"
          variant="paragraph"
          className={textClassName}
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="paragraph"
          className={textClassName}
        >
          &nbsp;
        </Typography>
      </div>
    </div>
  );
}