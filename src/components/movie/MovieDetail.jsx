import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";

function createSlug(name) {
  return name
    .trim()
    .replace(/\s*:\s*/g, "-") // Thay thế dấu ":" và các khoảng trắng trước và sau nó bằng dấu gạch ngang
    .replace(/\s+/g, "-") // Thay thế tất cả khoảng trắng còn lại bằng dấu gạch ngang
    .replace(/-+/g, "-"); // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang
}

export default function MovieDetail() {
  const navigate = useNavigate();
  const { film_name } = useParams();
  const [data, setData] = useState(null);
  const film_id = localStorage.getItem("film_id");
  const [dataRelate, setDataRelate] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/film/filmInfo/id=${film_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log(result);
          setData(result);
        } else {
          console.log(`Truy cập: ${result.message}`);
        }
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };

  useEffect(() => {
    if (film_id) {
      fetchData();
    }
  }, []);

  //   const fetchMovieNews = async (film_id) => {
  //     try {
  //       const response = await fetch(
  //         `${import.meta.env.VITE_API_URL}/api/new/film_id=${film_id}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       if (response.ok) {
  //         const result = await response.json();
  //         setMovieData(result);
  //         console.log(result);
  //       } else {
  //         console.error("Lỗi khi truy cập:", response.statusText);
  //       }
  //     } catch (error) {
  //       console.error("Lỗi mạng:", error);
  //     }
  //   };

  //   const clickNews = (news_id, news_header) => {
  //     localStorage.setItem("news_id", news_id);
  //     navigate(`/tin_tuc/${encodeURIComponent(createSlug(news_header))}`);
  //     window.location.reload();
  //   };

  return (
    <div className="bg-[#1C1B21] flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow px-8 lg:px-36 flex">
        <div className="bg-[#323137] w-full flex-grow my-7 rounded-3xl">
          {data && (
            <div className="flex flex-row">
              <img src={data.info.film[0].film_img} className="w-72" />
              <div>
                <p className="text-white">{data.info.film[0].film_name}</p>
                <p className="text-white">
                  {data.info.categorys
                    .map((item) => {
                      return item.category_name;
                    })
                    .join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
