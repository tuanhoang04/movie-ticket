import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Button } from "@material-tailwind/react";
import AlertWithIcon from "../Alert";
import Trailer from "./Trailer";
import RatingForm from "./RatingForm";
import MovieRatings from "./MovieRatings";

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
  const [ratingTitle, setRatingTitle] = useState("");
  const [openRatingForm, setOpenRatingForm] = useState(false);

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
          setData(result);
          const movieName = result.info.film[0].film_name;
          const rating =
            Math.round(result.info.evaluate[0].film_rate * 10) / 10;
          if (result.info.evaluate[0].sum_rate > 0) {
            setRatingTitle(
              `${movieName} has received an average rating of ${rating}/5`
            );
          } else {
            setRatingTitle(`${movieName} has not received any rating.`);
          }
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
  const handleNavigate = (film_name, film_id) => {
    localStorage.setItem("film_id", film_id);
    navigate(`/movie/buyTicket/${film_name}`);
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
        <div className="bg-[#323137] w-full h-full py-6 px-20 flex-grow my-7 rounded-3xl">
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
                  <div className="flex flex-row self-center items-center justify-between w-[52%] mb-2">
                    <p className="text-white text-xl font-semibold">Rating</p>
                    <div className="flex flex-row items-center">
                      <p className="text-white text-xl font-semibold mr-[2px]">
                        {Math.round(data.info.evaluate[0].film_rate * 10) / 10}
                      </p>
                      <img src="/icons/rating.png" className="w-4 h-4" />
                    </div>
                  </div>
                )}
                <div className="flex flex-row items-center justify-between w-[52%] mb-2">
                  <p className="text-white text-xl font-semibold">Age limit</p>
                  <p className="text-white text-xl font-semibold">
                    {data.info.film[0].age_limit}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between w-[52%] mb-6">
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
                    className="bg-[#B44242] rounded-xl flex flex-row p-2 px-3 items-center w-[52%] mb-3"
                    onClick={like}
                  >
                    <img src="/icons/heart.png" className="w-7 mr-2" />
                    <p className="text-sm font-bold">Save Movie</p>
                  </Button>
                )}
                <Button
                  color="red"
                  className="bg-[#B44242] rounded-xl flex flex-row p-2 px-3 items-center w-[52%]"
                  onClick={()=>{navigate("/movie/buyTicket/" + film_name);}}
                >
                  <img src="/icons/ticket.png" className="w-7 mr-2" />
                  <p className="text-sm font-bold">Buy Ticket</p>
                </Button>
              </div>
            </div>
          )}

          {data?.info?.film[0]?.film_trailer && (
            <div>
              <hr className="my-7 opacity-70" />
              <p className="text-white text-4xl font-bold pb-3">Trailer</p>
              <Trailer youtubeLink={data.info.film[0].film_trailer} />
            </div>
          )}

          {data && (
            <div className="flex flex-col">
              <hr className="my-7 opacity-70" />
              <p className="text-white text-4xl font-bold pb-3">Ratings</p>
              <div className="bg-[#606060] w-full p-5 rounded-2xl grid grid-cols-12 grid-rows-1">
                <div className="col-span-2 row-span-1 flex flex-row justify-center items-baseline border-e-2">
                  <p className="text-white text-7xl">
                    {Math.round(data.info.evaluate[0].film_rate * 10) / 10}
                  </p>
                  <p className="text-white font-extralight text-5xl">/</p>
                  <p className="text-white text-5xl">5</p>
                </div>

                <div className="col-span-10 row-span-1 flex flex-row ms-10 justify-start items-center">
                  <p className="text-white font-light text-3xl">
                    {ratingTitle}
                  </p>
                </div>
              </div>

              {!openRatingForm && (
                <Button
                  color="purple"
                  onClick={() => setOpenRatingForm(!openRatingForm)}
                  className="!bg-[#773e77] text-base my-5 self-start w-auto"
                >
                  Leave a rating
                </Button>
              )}
              {openRatingForm && (
                <RatingForm
                  handleOpen={() => {
                    setOpenRatingForm(!openRatingForm);
                  }}
                />
              )}

              {data.info.evaluate[0].sum_rate > 0 && (
                <MovieRatings film_id={film_id} />
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
