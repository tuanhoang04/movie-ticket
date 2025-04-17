import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import { useEffect, useState } from "react";

export default function NewsPage() {
  const [viewdetail, setViewDetail] = useState(false);
  const [dataV, setDataV] = useState([]);
  const [dataA, setDataA] = useState([]);

  const [filteredData, setFilteredData] = useState([]); // newsData là mảng bài viết gốc
  const [movie, setMovie] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const combinedData = [...dataV, ...dataA]; // Kết hợp dữ liệu từ cả hai mảng
    setFilteredData(combinedData); // Cập nhật filteredData với dữ liệu kết hợp
  }, [dataV, dataA]); // Chạy lại khi dataV hoặc dataA thay đổi

  useEffect(() => {
    let data = [...filteredData];

    if (movie) data = data.filter((item) => item.movie === movie);
    if (category) data = data.filter((item) => item.category === category);

    data.sort((a, b) => {
      if (sort === "newest") return new Date(b.new_time) - new Date(a.new_time);
      else return new Date(a.new_time) - new Date(b.new_time);
    });
    console.log("formatted", data);

    setFilteredData(data);
  }, [movie, category, sort]);

  const fetchNewVietnam = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/new/vietnam`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setDataV(result);
        console.log("Data V");
        console.log(result);
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };

  const fetchNewAboard = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/new/aboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setDataA(result);
        console.log("Data A");
        console.log(result);
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };
  useEffect(() => {
    fetchNewAboard();
    fetchNewVietnam();
  }, []);
  return (
    <>
      <NavBar />
      <div id="body" className="flex bg-[#1C1B21] p-32 gap-20 text-white">
        {viewdetail ? (
          <div>
            <div className="text-5xl border-l-8 px-5 py-4 mb-10">
              Movie news
            </div>
            <div className="flex flex-col gap-10 p-4">
              <div className="flex flex-col gap-2 bg-white border-opacity-10 p-6 rounded-lg">
                <h1 className="text-3xl mb-3">{filteredData.new_header}</h1>
                <img src={filteredData.new_img} alt="" className="rounded-lg" />
                <div
                  className="line-clamp-5 text-md"
                  dangerouslySetInnerHTML={{ __html: filteredData.new_content }}
                ></div>
                <div className="flex justify-between items-center mt-5">
                  <p>
                    {filteredData.new_time.substring(0, 10)} ● by{" "}
                    {filteredData.username}
                  </p>
                  <a src="#" className="text-xl underline">
                    See full article
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div id="lastest" className="w-3/4">
            <div className="text-5xl border-l-8 px-5 py-4 mb-10">
              Movie news
            </div>
            <div className="flex flex-col gap-10 p-4">
              {filteredData.map((item) => (
                <div
                  key={item.new_id}
                  className="flex flex-col gap-2 bg-white text-black p-6 rounded-lg"
                >
                  <h1 className="text-3xl mb-3">{item.new_header}</h1>
                  <img src={item.new_img} alt="" className="rounded-lg" />
                  <div
                    className="line-clamp-5 text-md"
                    dangerouslySetInnerHTML={{ __html: item.new_content }}
                  ></div>
                  <div className="flex justify-between items-center mt-5">
                    <p>
                      {item.new_time.substring(0, 10)} ● by {item.username}
                    </p>
                    <div className="text-xl underline">See full article</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div id="side" className="w-1/4">
          <div className="text-5xl border-l-8 px-5 py-4 mb-14">
            More to explore
          </div>
          <div className="flex flex-col gap-4 mb-20">
            <div className="text-4xl flex items-center gap-5 mb-3">
              <p>Viet Name news</p>
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
            {dataV.slice(0, 5).map((item) => (
              <div
                key={item.new_id}
                className="flex  gap-2 bg-white text-black p-3 rounded-lg"
              >
                <div className="w-4/5">
                  <p className="line-clamp-2 text-lg mb-3">{item.new_header}</p>
                  <p className="line-clamp-1 text-md">
                    {" "}
                    {item.new_time.substring(0, 10)} ● by {item.username}
                  </p>
                </div>
                <div className="w-1/5 h-32 rounded-xl overflow-hidden">
                  <img
                    src={item.new_img}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 ">
            <div className="text-4xl flex items-center gap-5 mb-3">
              <p>Global news</p>
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
            {dataV.slice(0, 5).map((item) => (
              <div
                key={item.new_id}
                className="flex  gap-2 bg-white text-black p-3 rounded-lg"
              >
                <div className="w-4/5">
                  <p className="line-clamp-2 text-lg mb-3">{item.new_header}</p>
                  <p className="line-clamp-1 text-md">
                    {" "}
                    {item.new_time.substring(0, 10)} ● by {item.username}
                  </p>
                </div>
                <div className="w-1/5 h-32 rounded-xl overflow-hidden">
                  <img
                    src={item.new_img}
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
