import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import BackToTopButton from "../components/BackToTopButton";

import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
function createSlug(name) {
  return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
export default function NewsPage() {
  const navigate = useNavigate();
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [dataV, setDataV] = useState([]);
  const [dataA, setDataA] = useState([]);
  const limit = 3;
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const [allNews, setAllNews] = useState([]);

  useEffect(() => {
    const combinedData = [...dataV, ...dataA];
    console.log(combinedData);
    combinedData.sort((a, b) => new Date(b.new_time) - new Date(a.new_time));
    setAllNews(combinedData);
  }, [dataV, dataA]);

  const fetchNewVietnam = async () => {
    setIsFetching(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/new/vietnam?offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setDataV((prev) => {
          const newItems = result.filter(
            (item) => !prev.some((old) => old.new_id === item.new_id)
          );
          return [...prev, ...newItems];
        });
      } else {
        console.error("Error:", response.statusText);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    setIsFetching(false);
  };

  const fetchNewAboard = async () => {
    setIsFetching(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/new/aboard?offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setDataA((prev) => {
          const newItems = result.filter(
            (item) => !prev.some((old) => old.new_id === item.new_id)
          );
          return [...prev, ...newItems];
        });
        console.log("Data A");
        console.log(result);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    setIsFetching(false);
  };
  useEffect(() => {
    if (offset === 0) {
      fetchNewAboard();
      fetchNewVietnam().then(() => {
        setInitialLoaded(true);
      });
    } else {
      fetchNewAboard();
      fetchNewVietnam();
    }
  }, [offset]);
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
    if (!initialLoaded) return;

    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0.5,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [handleObserver, initialLoaded]);

  const handleRegionClick = (region) => {
    localStorage.setItem("region", region);
    navigate(`/news/region/${region}`);
  };

  return (
    <>
      <BackToTopButton />

      <NavBar currentPage={"News"} />
      <div
        id="body"
        className="flex flex-col lg:flex-row bg-[#1C1B21] p-4 md:p-6 lg:p-12 xl:p-20 2xl:p-32 md:gap-10 lg:gap-10 xl:gap-20 !pt-10 text-white"
      >
        <div id="lastest" className="lg:w-4/6 hidden lg:block">
          <div className="text-2xl lg:text-4xl px-2 lg:px-5 py-4 mb-5">
            Movie news
          </div>
          <div className="flex flex-col gap-5 lg:gap-10 p-2 lg:p-4">
            {allNews.map((item) => (
              <div
                key={item.new_id}
                onClick={() => {
                  localStorage.setItem("new_id", item.new_id);

                  navigate(
                    `/news/${encodeURIComponent(createSlug(item.new_header))}`
                  );
                }}
                className="flex flex-col gap-2 bg-[#2c2c2e] text-white p-2 md:p-5 lg:p-10 lg:pt-6 rounded-lg cursor-pointer"
              >
                <h1 className="text-2xl mb-3 ">{item.new_header}</h1>
                <img src={item.new_img} alt="" className="rounded-lg" />
                <div
                  className="line-clamp-5 text-lg hide-images"
                  dangerouslySetInnerHTML={{ __html: item.new_content }}
                ></div>
                <div className="flex justify-between items-center mt-5">
                  <p>
                    {item.new_time.substring(0, 10)} ● by {item.username}
                  </p>
                  <div className="text-xl underline cursor-pointer">
                    See full article
                  </div>
                </div>
              </div>
            ))}
            <div
              ref={loader}
              className="text-center  pt-20 py-4 text-white text-2xl"
            >
              {hasMore ? "Loading..." : "No more news"}
            </div>
          </div>
        </div>
        <div id="side" className="lg:w-2/6">
          <div className="text-4xl hidden lg:block  py-4 mb-10">
            More to explore
          </div>
          <div
            onClick={() => {
              handleRegionClick("vietnam");
            }}
            className="text-3xl flex items-center gap-5 mb-3 cursor-pointer"
          >
            <p>Vietnam Film News</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mb-20">
            {dataV.slice(0, 4).map((item) => (
              <div
                key={item.new_id}
                className="flex  gap-2 bg-[#2c2c2e] text-white p-5 rounded-lg cursor-pointer"
                onClick={() => {
                  localStorage.setItem("new_id", item.new_id);

                  navigate(
                    `/news/${encodeURIComponent(createSlug(item.new_header))}`
                  );
                }}
              >
                <div className="w-4/5 flex flex-col justify-between">
                  <p className="line-clamp-2 text-lg mb-10">
                    {item.new_header}
                  </p>
                  <p className="line-clamp-1 text-md">
                    {" "}
                    {item.new_time.substring(0, 10)} ● by {item.username}
                  </p>
                </div>
                <div className="w-24 h-32 rounded-xl overflow-hidden">
                  <img
                    src={item.new_img || "/image-placeholder.png"}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            onClick={() => {
              handleRegionClick("aboard");
            }}
            className="text-4xl flex items-center gap-5 mb-3 cursor-pointer"
          >
            <p>Worldwide Film News</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mb-20">
            {dataA.slice(0, 4).map((item) => (
              <div
                key={item.new_id}
                className="flex justify-between gap-2 bg-[#2c2c2e] text-white p-5 rounded-lg cursor-pointer"
                onClick={() => {
                  localStorage.setItem("new_id", item.new_id);

                  navigate(
                    `/news/${encodeURIComponent(createSlug(item.new_header))}`
                  );
                }}
              >
                <div className="w-4/5 flex flex-col justify-between">
                  <p className="line-clamp-2 text-lg mb-10">
                    {item.new_header}
                  </p>
                  <p className="line-clamp-1 text-md">
                    {" "}
                    {item.new_time.substring(0, 10)} ● by {item.username}
                  </p>
                </div>
                <div className="w-24 h-32 rounded-xl overflow-hidden">
                  <img
                    src={item.new_img || "/image-placeholder.png"}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
