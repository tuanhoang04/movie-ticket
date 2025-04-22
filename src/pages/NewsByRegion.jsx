import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
function createSlug(name) {
  return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
export default function NewsByRegion() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const region = localStorage.getItem("region");
  const navigate = useNavigate();

  const fetchNewByRegion = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/new/${region}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setNews(result);
        console.log("Data V");
        console.log(result);
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };
  useEffect(() => {
    fetchNewByRegion();
  }, []);
  const getRegion = () => {
    if (region === "vietnam") {
      return "Viet nam";
    } else if (region === "aboard") {
      return "Global";
    }
  };
  return (
    <>
      <NavBar />
      <div className="bg-[#1C1B21]">
        <br />
        <div className="text-white text-4xl ml-[144px] mt-10 flex items-center gap-2">
          <p>{getRegion()} news</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            class="bi bi-chevron-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        </div>
        <div className="grid grid-cols-3 m-[144px] mt-10 mb-0 gap-10  ">
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
              <img src={item.new_img} alt="" />
              <h1 className="text-2xl ">{item.new_header}</h1>

              <div className="flex justify-between items-center">
                <p>
                  {item.new_time.substring(0, 10)} ● by {item.username}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
