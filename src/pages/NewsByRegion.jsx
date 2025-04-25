import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
function createSlug(name) {
  return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
export default function NewsByRegion() {
  const [news, setNews] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const region = localStorage.getItem("region");
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchNewByRegion = async () => {
    setIsFetching(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/new/${region}?offset=${offset}&limit=${limit}`
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        setNews((prev) => {
          const newItems = result.filter(
            (item) => !prev.some((old) => old.new_id === item.new_id)
          );
          return [...prev, ...newItems];
        });
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }

    setIsFetching(false);
  };

  useEffect(() => {
    fetchNewByRegion();
  }, [offset]);
  const getRegion = () => {
    if (region === "vietnam") {
      return "Vietnam Film";
    } else if (region === "aboard") {
      return "Worldwide Film";
    }
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isFetching) {
        setOffset((prev) => prev + limit);
      }
    },
    [hasMore]
  );
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0.5,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [handleObserver]);
  return (
    <>
      <NavBar />
      <div className="bg-[#1C1B21]">
        <br />
        <div className="text-white text-4xl p-4 md:p-6 lg:p-16 xl:p-20 2xl:p-32 !pt-10 !pb-10 flex items-center gap-2">
          <p>{getRegion()} News</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-chevron-right"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 md:p-6 lg:p-16 xl:p-20 2xl:p-32 !pt-10 mb-0 gap-10  ">
          {news.map((item) => (
            <div
              key={item.new_id}
              onClick={() => {
                localStorage.setItem("new_id", item.new_id);

                navigate(
                  `/news/${encodeURIComponent(createSlug(item.new_header))}`
                );
              }}
              className="flex flex-col gap-2 text-white  rounded-lg cursor-pointer"
            >
              <img
                src={item.new_img || "/image-placeholder.png"}
                className="aspect-video object-cover"
                alt=""
              />
              <h1 className="text-2xl ">{item.new_header}</h1>

              <div className="flex justify-between items-center">
                <p>
                  {item.new_time.substring(0, 10)} ● by {item.username}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div
          ref={loader}
          className="text-center py-4 pt-20 text-white text-2xl"
        >
          {hasMore ? "Loading..." : "No more news"}
        </div>
      </div>

      <Footer />
    </>
  );
}
