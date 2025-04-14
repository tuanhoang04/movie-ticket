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
    setLoadedRatings(dataComment.slice(0, nextCount));
    setLoadedCount(nextCount);
  };

  return(<div>

  </div>)
}
