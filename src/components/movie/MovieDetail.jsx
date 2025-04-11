import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Button } from "@material-tailwind/react";
import AlertWithIcon from "../Alert";

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
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState(null);
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
          console.log(`Connected: ${result.message}`);
        }
      } else {
        console.error("Connection failed:", response.statusText);
      }
    } catch (error) {
      console.error("Network failure:", error);
    }
  };

  useEffect(() => {
    if (film_id) {
      fetchData();
    }
  }, []);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/like/likeCheck/film_id=${film_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLiked(data.liked);
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, []);

  const unlike = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/like/unlike/film_id=${film_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLiked(data.liked);
    } catch (error) {
      console.error("Error fetching likeCheck:", error);
    }
  };

  const like = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/like/film_id=${film_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (
        data.message === "Người dùng chưa đăng nhập" ||
        data.message === "Người dùng hết phiên đăng nhập"
      ) {
        setMessage("Please login to continue!");
      }
      setLiked(data.liked);
    } catch (error) {
      console.error("Error fetching likeCheck:", error);
    }
  };

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
                {message && <AlertWithIcon message={message} />}
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
                  <div className="flex flex-row self-center items-center justify-between w-[57%]">
                    <p className="text-white text-xl">Rating</p>
                    <div className="flex flex-row ">
                      <p>{data.info.evaluate[0].film_rate}</p>
                      <img src="/icons/rating.png" className="w-5 h-5" />
                    </div>
                  </div>
                )}
                <div className="flex flex-row items-center justify-between w-[57%] mb-2">
                  <p className="text-white text-xl font-semibold">Age</p>
                  <p className="text-white text-xl font-semibold">
                    {data.info.film[0].age_limit}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between w-[57%] mb-6">
                  <p className="text-white text-xl font-semibold">Time</p>

                  <p className="text-white text-xl font-semibold">
                    {data.info.film[0].duration + "m"}
                  </p>
                </div>

                {liked ? (
                  <Button
                    color="red"
                    className="bg-[#B44242] rounded-xl flex flex-row p-2 px-3 items-center w-[52%] mb-3"
                    onClick={unlike}
                  >
                    <img src="/icons/heart-filled.png" className="w-7 mr-2 " />
                    <p className="text-sm font-bold">Saved</p>
                  </Button>
                ) : (
                  <Button
                    color="red"
                    className="bg-[#B44242] rounded-2xl flex flex-row p-2 px-3 items-center w-[52%] mb-3"
                    onClick={like}
                  >
                    <img src="/icons/heart.png" className="w-7 mr-2" />
                    <p className="text-sm font-bold">Save Movie</p>
                  </Button>
                )}
                <Button
                  color="red"
                  className="bg-[#B44242] rounded-xl flex flex-row p-2 px-3 items-center w-[52%]"
                >
                  <img src="/icons/ticket.png" className="w-7 mr-2" />
                  <p className="text-sm font-bold">Buy Ticket</p>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
