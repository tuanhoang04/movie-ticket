import { Rating } from "@material-tailwind/react";
import { useEffect, useState } from "react";

export default function MovieRatings({ film_id }) {
  const [ratingsData, setRatingsData] = useState([]);
  const [loadedCount, setLoadedCount] = useState(5);
  const [loadedRatings, setLoadedRatings] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/film/filmInfo/getComment/id=${film_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setRatingsData(result.comment);
        console.log(result);
      } else {
        console.error("Backend error:", response.statusText);
      }
    } catch (error) {
      console.error("Internal error:", error);
    }
  };

  useEffect(() => {
    if (film_id) {
      fetchData();
    }
    setLoadedRatings(ratingsData.slice(0, 5));
  }, []);

  const loadMore = () => {
    const nextCount = loadedCount + 5;
    setLoadedRatings(ratingsData.slice(0, nextCount));
    setLoadedCount(nextCount);
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `About ${diffInMinutes} minute${
        diffInMinutes === 1 ? "" : "s"
      } ago`;
    if (diffInHours < 2) return "About 1 hour ago";
    if (diffInHours < 24) return `About ${diffInHours} hours ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    if (diffInWeeks < 2) return "1 week ago";
    if (diffInWeeks < 3) return "2 weeks ago";
    if (diffInWeeks < 4) return "3 weeks ago";
    if (diffInMonths < 2) return "1 month ago";
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    if (diffInYears < 2) return "1 year ago";
    return `${diffInYears} years ago`;
  };

  return (
    <div>
      {ratingsData.map((item, index) => {
        return (
          <div key={index} className="mb-9 flex flex-row">
            {item.user_img && <img src={item.user_img} />}
            <div className="flex flex-col">
              <div className="flex flex-row gap-3 items-end">
                <p className="text-white text-2xl">{item.full_name}</p>
                <p className="text-gray-400 text-lg font-light">
                  {timeAgo(item.date_posted)}
                </p>
              </div>
              <Rating
                value={item.star}
                readonly
                unratedColor="white"
                ratedColor="white"
                className="my-1 [&>span>svg]:w-5 [&>span>svg]:h-5"
              />
              <p className="text-white text-xl">{item.comments}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
