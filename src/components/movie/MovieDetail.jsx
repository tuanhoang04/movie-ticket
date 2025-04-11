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
        <div className="bg-[#323137] w-full py-6 px-20 flex-grow my-7 rounded-3xl">
          {data && (
            <div className="grid grid-cols-11 grid-rows-1">
              <img
                src={data.info.film[0].film_img}
                className="col-span-2 row-span-1 rounded-3xl w-full"
              />
              <div className="col-span-7 row-span-1 flex flex-col justify-center px-10">
                <p className="text-white text-3xl pb-1 font-bold">
                  {data.info.film[0].film_name}
                </p>
                <p className="text-white text-xl pb-5 font-light">
                  {data.info.categorys
                    .map((item) => {
                      return item.category_name;
                    })
                    .join(", ")}
                </p>
                <p className="text-white text-xl pb-5 font-normal text-justify">
                  {data.info.film[0].film_describe}
                </p>
                <p className="text-white text-lg font-normal text-justify">
                  Actors:{" "}
                  {data.info.actors
                    .map((item) => {
                      return item.actor_name;
                    })
                    .join(", ")}
                </p>
              </div>
              <div className="col-span-2 row-span-1 flex flex-col justify-center items-center">
                {data.info.evaluate[0].sum_rate > 0 && (
                  <div className="flex flex-row self-center items-center justify-between w-[50%]">
                    <p className="text-white text-xl">Rating</p>
                    <div className="flex flex-row ">
                      <p>{data.info.evaluate[0].film_rate}</p>
                      <img src="/icons/rating.png" className="w-5 h-5" />
                    </div>
                  </div>
                )}
                <div className="flex flex-row items-center justify-between w-[50%]">
                  <p className="text-white text-xl">Age</p>

                  <p className="text-white text-xl">
                    {data.info.film[0].age_limit}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between w-[50%]">
                  <p className="text-white text-xl">Time</p>

                  <p className="text-white text-xl">
                    {data.info.film[0].duration + "m"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
