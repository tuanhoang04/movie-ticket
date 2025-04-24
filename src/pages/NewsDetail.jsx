import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function createSlug(name) {
  return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function NewsDetail() {
  const navigate = useNavigate();
  const new_id = localStorage.getItem("new_id");
  const [dataDetail, setDataDetail] = useState();
  const [dataRelate, setDataRelate] = useState();
  const fetchNewDetail = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/new/new_id=${new_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log(result[0]);

        setDataDetail(result[0]);
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };
  useEffect(() => {
    fetchNewDetail();
  }, []);

  const fetchNewRelate = async (film_id) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/new/film_id=${film_id}?new_id=${new_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setDataRelate(result);
        console.log("relate:" + result);
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };

  useEffect(() => {
    if (dataDetail) {
      fetchNewRelate(dataDetail.film_id);
    }
  }, [dataDetail]);

  const ClickNew = (new_id, new_header) => {
    localStorage.setItem("new_id", new_id);
    navigate(`/news/${encodeURIComponent(createSlug(new_header))}`);
    window.location.reload();
  };

  return (
    <div className="bg-[#1C1B21] min-h-screen flex flex-col">
      <NavBar />
      <div id="body" className="flex bg-[#1C1B21] p-32 gap-20 text-white">
        <div id="lastest" className="w-3/4">
          <div className="text-3xl border-l-8 px-5 py-4 mb-10">Movie news</div>
          <div className="flex flex-col gap-10 p-4">
            {dataDetail && (
              <div
                key={dataDetail.new_id}
                className="flex flex-col gap-2 bg-[#2c2c2e] text-white p-10 pt-6 rounded-lg"
              >
                <h1 className="text-3xl mb-3">{dataDetail.new_header}</h1>
                <img src={dataDetail.new_img} alt="" className="rounded-lg" />
                <div
                  className="text-xl text-justify leading-8 center-images flex flex-col gap-5"
                  dangerouslySetInnerHTML={{ __html: dataDetail.new_content }}
                ></div>
                <div className="flex justify-between items-center mt-5 text-lg">
                  <p>
                    {dataDetail.new_time.substring(0, 10)} ● by{" "}
                    {dataDetail.username}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div id="side" className="w-1/4">
          <div className="text-3xl border-l-8 px-5 py-4 mb-10">
            More to explore
          </div>
          <div className="flex flex-col gap-4 mb-20">
            <div className="text-4xl flex items-center gap-5 mb-3">
              <p>Related news</p>
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
            {dataRelate
              ? dataRelate.slice(0, 5).map((item) => (
                  <div
                    key={item.new_id}
                    className="flex  gap-2 bg-[#2c2c2e] text-white p-5 rounded-lg cursor-pointer"
                    onClick={() => ClickNew(item.new_id, item.new_header)}
                  >
                    <div className="w-4/5  flex flex-col justify-between">
                      <p className="line-clamp-2 text-lg">{item.new_header}</p>
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
                ))
              : "Chưa có bài viết liên quan nào !"}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
