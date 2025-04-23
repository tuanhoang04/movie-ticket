import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import { Button, Rating } from "@material-tailwind/react";
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
  const [ratingsData, setRatingsData] = useState([]);
  const film_id = localStorage.getItem("film_id");
  const [dataRelate, setDataRelate] = useState(null);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState(null);
  const [ratingTitle, setRatingTitle] = useState("");
  const [openRatingForm, setOpenRatingForm] = useState(false);
  const [sumRatingsByStar, setSumRatingsByStar] = useState({});
  const [openSignIn, setOpenSignIn] = useState(false);
  const jwt = localStorage.getItem("jwt");
  const checkLogin = async () => {
    try {
      // Gửi request POST đến endpoint "/api/userInfo"
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/userInfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jwt: jwt }),
        }
      );
      const responseData = await response.json();
      if (responseData.success) {
        return true;
      } else {
        // alert("Please login to continue!");

        setMessage("Please login to continue!");
        setTimeout(() => {
          setOpenSignIn(true);
        }, 1000);
        // navigate(-1);
        return false;
      }
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      setMessage("An error has occurred, please try again!");
    }
  };

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
          console.log(result);
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
      fetchCommentData();
    }
    fetchLikeStatus();
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
        data.message === "User not logged in" ||
        data.message === "User sign-in session timed out"
      ) {
        setMessage("Please login to continue!");
        setTimeout(() => {
          // console.log("ac");
          setOpenSignIn(true);
        }, 900);
      }
      setLiked(data.liked);
    } catch (error) {
      console.error("Error fetching likeCheck:", error);
    }
  };

  const fetchCommentData = async () => {
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
        console.log(result.comment);
      } else {
        console.error("Backend error:", response.statusText);
      }
    } catch (error) {
      console.error("Internal error:", error);
    }
  };

  useEffect(() => {
    const newSum = {};

    for (let i = 0; i < ratingsData.length; i++) {
      const star = ratingsData[i].star;
      newSum[star] = (newSum[star] || 0) + 1;
    }
    console.log(newSum);
    setSumRatingsByStar(newSum);
  }, [ratingsData]);

  const handleNavigate = async (film_name, film_id) => {
    if (await checkLogin()) {
      localStorage.setItem("film_id", film_id);
      navigate(`/movie/buyTicket/${film_name}`);
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
      <NavBar
        openSignInFromParent={openSignIn}
        setOpenSignInFromParent={setOpenSignIn}
      />
      <div className="flex-grow px-8 lg:px-36 flex flex-col">
        {data && (
          <div className="bg-[#323137] w-full h-full py-8 px-20 flex-grow mt-10 mb-4 rounded-3xl">
            <div className="grid grid-cols-11 grid-rows-1">
              <img
                src={data.info.film[0].film_img}
                className="col-span-2 row-span-1 rounded-3xl w-full"
              />
              <div className="col-span-7 row-span-1 flex flex-col justify-center px-10">
                {message && (
                  <AlertWithIcon type={"negative"} message={message} />
                )}
                <p
                  className="text-white text-3xl pb-1 font-bold"
                  style={message && { marginTop: "10px" }}
                >
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
                <div className="flex flex-row gap-1">
                  <p className="text-white text-lg font-normal text-justify">
                    Actors:{" "}
                  </p>
                  {data.info.actors.map((item, index) => {
                    const isLast = index === data.info.actors.length - 1;
                    return (
                      <div key={index} className="flex flex-row">
                        <p
                          onClick={() => {
                            localStorage.setItem("actor_id", item.actor_id);
                            navigate(`/actor/${createSlug(item.actor_name)}`);
                          }}
                          className="text-white text-lg hover:underline hover:underline-offset-2 cursor-pointer"
                        >
                          {item.actor_name}
                        </p>
                        <p className="text-white text-lg">
                          {isLast ? "." : ", "}
                        </p>
                      </div>
                    );
                  })}
                </div>
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
                    className="bg-[#B44242] rounded-xl flex flex-row p-2 px-3 items-center min-w-[150px] mb-3"
                    onClick={unlike}
                  >
                    <img src="/icons/heart-filled.png" className="w-7 mr-2 " />
                    <p className="text-sm font-bold">Saved</p>
                  </Button>
                ) : (
                  <Button
                    color="red"
                    className="bg-[#B44242] rounded-xl flex flex-row p-2 px-3 items-center min-w-[150px] mb-3"
                    onClick={like}
                  >
                    <img src="/icons/heart.png" className="w-7 mr-2" />
                    <p className="text-sm font-bold">Save Movie</p>
                  </Button>
                )}
                <Button
                  color="red"
                  className="bg-[#B44242] rounded-xl flex flex-row p-2 px-3 items-center min-w-[150px]"
                  onClick={() => {
                    handleNavigate(film_name, film_id);
                  }}
                >
                  <img src="/icons/ticket.png" className="w-7 mr-2" />
                  <p className="text-sm font-bold">Buy Ticket</p>
                </Button>
              </div>
            </div>
          </div>
        )}
        {data?.info?.film[0]?.film_trailer && (
          <div className="bg-[#323137] w-full h-full py-8 px-20 flex-grow my-4 rounded-3xl">
            <div>
              <p className="text-white text-4xl font-bold pb-3">Trailer</p>
              <Trailer youtubeLink={data.info.film[0].film_trailer} />
            </div>
          </div>
        )}
        {data && (
          <div className="bg-[#323137] w-full h-full py-8 px-20 flex-grow my-4 rounded-3xl">
            <div className="flex flex-col">
              <p className="text-white text-4xl font-bold pb-3">Ratings</p>
              <div className="flex flex-row items-center mb-2">
                <Rating
                  value={Math.round(data.info.evaluate[0].film_rate)}
                  readonly
                  unratedColor="white"
                  ratedColor="yellow"
                  className="my-1 [&>span>svg]:w-8 [&>span>svg]:h-8 mr-2"
                />
                <p className="ms-1 text-xl font-medium text-gray-300 ">
                  {Math.round(data.info.evaluate[0].film_rate * 10) / 10}
                </p>
                <p className="ms-1 text-xl font-medium text-gray-300 ">
                  out of
                </p>
                <p className="ms-1 text-xl font-medium text-gray-300 ">
                  5 stars
                </p>
              </div>
              <p className="text-xl font-light text-gray-300 ">
                {ratingsData.length} ratings
              </p>

              <div className="grid grid-cols-11 grid-rows-1 w-3/4 justify-between items-center mt-4">
                <a className="col-span-1 text-lg font-medium text-white">
                  5 star
                </a>
                <div className="col-span-7 h-5 flex flex-row mx-4 bg-gray-200 rounded-sm dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-600 rounded-sm"
                    style={{
                      width:
                        Math.round(
                          ((sumRatingsByStar[5] || 0) / ratingsData.length) *
                            1000
                        ) /
                          10 +
                        "%",
                    }}
                  ></div>
                </div>
                <p className="col-span-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {Math.round(
                    ((sumRatingsByStar[5] || 0) / ratingsData.length) * 100
                  ) || 0}
                  %
                </p>
              </div>
              <div className="grid grid-cols-11 grid-rows-1 w-3/4 justify-between items-center mt-4">
                <a className="col-span-1 text-lg font-medium text-white">
                  4 star
                </a>
                <div className="col-span-7 h-5 flex flex-row mx-4 bg-gray-200 rounded-sm dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-600 rounded-sm"
                    style={{
                      width:
                        Math.round(
                          ((sumRatingsByStar[4] || 0) / ratingsData.length) *
                            1000
                        ) /
                          10 +
                        "%",
                    }}
                  ></div>
                </div>
                <p className="col-span-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {Math.round(
                    ((sumRatingsByStar[4] || 0) / ratingsData.length) * 100
                  ) || 0}
                  %
                </p>
              </div>
              <div className="grid grid-cols-11 grid-rows-1 w-3/4 justify-between items-center mt-4">
                <a className="col-span-1 text-lg font-medium text-white">
                  3 star
                </a>
                <div className="col-span-7 h-5 flex flex-row mx-4 bg-gray-200 rounded-sm dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-600 rounded-sm"
                    style={{
                      width:
                        Math.round(
                          ((sumRatingsByStar[3] || 0) / ratingsData.length) *
                            1000
                        ) /
                          10 +
                        "%",
                    }}
                  ></div>
                </div>
                <p className="col-span-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {Math.round(
                    ((sumRatingsByStar[3] || 0) / ratingsData.length) * 100
                  ) || 0}
                  %
                </p>
              </div>
              <div className="grid grid-cols-11 grid-rows-1 w-3/4 justify-between items-center mt-4">
                <a className="col-span-1 text-lg font-medium text-white">
                  2 star
                </a>
                <div className="col-span-7 h-5 flex flex-row mx-4 bg-gray-200 rounded-sm dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-600 rounded-sm"
                    style={{
                      width:
                        Math.round(
                          ((sumRatingsByStar[2] || 0) / ratingsData.length) *
                            1000
                        ) /
                          10 +
                        "%",
                    }}
                  ></div>
                </div>
                <p className="col-span-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {Math.round(
                    ((sumRatingsByStar[2] || 0) / ratingsData.length) * 100
                  ) || 0}
                  %
                </p>
              </div>
              <div className="grid grid-cols-11 grid-rows-1 w-3/4 justify-between items-center mt-4">
                <a className="col-span-1 text-lg font-medium text-white">
                  1 star
                </a>
                <div className="col-span-7 h-5 flex flex-row mx-4 bg-gray-200 rounded-sm dark:bg-gray-700">
                  <div
                    className="h-5 bg-yellow-600 rounded-sm"
                    style={{
                      width:
                        Math.round(
                          ((sumRatingsByStar[1] || 0) / ratingsData.length) *
                            1000
                        ) /
                          10 +
                        "%",
                    }}
                  ></div>
                </div>
                <p className="col-span-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {Math.round(
                    ((sumRatingsByStar[1] || 0) / ratingsData.length) * 100
                  ) || 0}
                  %
                </p>
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
                  handleOpenSignIn={() => {
                    setTimeout(() => {
                      setOpenSignIn(true);
                    }, 1000);
                  }}
                />
              )}

              {data.info.evaluate[0].sum_rate > 0 && (
                <MovieRatings film_id={film_id} />
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
