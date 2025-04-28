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
    .replace(/\s*:\s*/g, "-") // Replace ":" and surrounding spaces with hyphen
    .replace(/\s+/g, "-") // Replace all remaining spaces with hyphens
    .replace(/-+/g, "-"); // Replace consecutive hyphens with a single hyphen
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
        setMessage("Please login to continue!");
        setTimeout(() => {
          setOpenSignIn(true);
        }, 1000);
        return false;
      }
    } catch (error) {
      console.error("Request error:", error);
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


  useEffect(()=>{
    setTimeout(()=>{
      setMessage("");
    }, 4000);
  }, [message]);

  return (
    <div className="bg-[#1C1B21] flex flex-col min-h-screen">
      <NavBar
        openSignInFromParent={openSignIn}
        setOpenSignInFromParent={setOpenSignIn}
      />
      <div className="flex-grow p-4 md:p-6 lg:px-12 xl:px-20 2xl:px-32 flex flex-col">
        {data && (
          <div className="bg-[#323137] w-full h-full py-4 sm:py-5 md:py-8 px-4 sm:px-5 md:px-9 flex-grow rounded-xl md:rounded-3xl">
            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 gap-4">
              <div className="w-full lg:col-span-2">
                <img
                  src={data.info.film[0].film_img}
                  className="rounded-xl md:rounded-4xl w-full object-cover"
                  alt={data.info.film[0].film_name}
                />
              </div>

              {/* Movie Info - Full width on mobile, 7 cols on md+ */}
              <div className="w-full lg:col-span-8 flex flex-col justify-center">
                {message && (
                  <AlertWithIcon type={"negative"} message={message} />
                )}
                <p
                  className="text-white text-2xl md:text-3xl pb-1 font-bold"
                  style={message ? { marginTop: "10px" } : {}}
                >
                  {data.info.film[0].film_name}
                </p>
                <p className="text-white text-lg md:text-xl pb-2 sm:pb-3 md:pb-5 font-light">
                  {data.info.categorys
                    .map((item) => item.category_name)
                    .join(", ")}
                </p>
                <p className="text-white text-xl lg:leading-7 leading-[1.25] pb-3 sm:pb-4 md:pb-5 font-normal text-justify">
                  {data.info.film[0].film_describe}
                </p>
                <div className="flex flex-row flex-wrap gap-1">
                  <p className="text-white text-lg md:text-xl font-normal">
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
                          className="text-white text-lg md:text-xl hover:underline hover:underline-offset-2 cursor-pointer"
                        >
                          {item.actor_name}
                        </p>
                        <p className="text-white text-lg md:text-xl ">
                          {isLast ? "." : ", "}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Movie Details & Buttons - Full width on mobile, 2 cols on md+ */}
              <div className="w-[100%] lg:col-span-2 flex flex-col justify-center mt-4 md:mt-0">
                <div className="lg:w-[100%] w-[100%] flex flex-col justify-between md:justify-start gap-4 mb-6 ">
                  {data.info.evaluate[0].sum_rate > 0 && (
                    <div className="flex flex-row items-center justify-between w-[100%] mb-1">
                      <p className="text-white text-xl font-semibold">Rating</p>
                      <div className="flex flex-row items-center">
                        <p className="text-white text-xl font-semibold mr-1">
                          {Math.round(data.info.evaluate[0].film_rate * 10) /
                            10}
                        </p>
                        <img
                          src="/icons/rating.png"
                          className="w-3 h-3 md:w-4 md:h-4"
                          alt="rating"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-row items-center justify-between w-[100%] mb-1">
                    <p className="text-white text-xl font-semibold">
                      Age limit
                    </p>
                    <p className="text-white text-xl font-semibold">
                      {data.info.film[0].age_limit}
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-between w-[100%] mb-1">
                    <p className="text-white text-xl font-semibold">Time</p>
                    <p className="text-white text-xl font-semibold">
                      {data.info.film[0].duration + "m"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 w-full">
                  <Button
                    color="red"
                    className="bg-[#B44242] rounded-xl flex flex-row p-3 items-center justify-center w-full"
                    onClick={liked ? unlike : like}
                  >
                    <img
                      src={
                        liked ? "/icons/heart-filled.png" : "/icons/heart.png"
                      }
                      className="w-5 md:w-6 mr-2"
                      alt={liked ? "Saved" : "Save Movie"}
                    />
                    <p className="text-xs sm:text-lg lg:text-base font-bold">
                      {liked ? "Saved" : "Save Movie"}
                    </p>
                  </Button>

                  <Button
                    color="red"
                    className="bg-[#B44242] rounded-xl flex flex-row p-3 items-center justify-center w-full"
                    onClick={() => handleNavigate(film_name, film_id)}
                  >
                    <img
                      src="/icons/ticket.png"
                      className="w-5 md:w-6 mr-2"
                      alt="Buy Ticket"
                    />
                    <p className="text-xs sm:text-lg lg:text-base font-bold">
                      Buy Ticket
                    </p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trailer Section */}
        {data?.info?.film[0]?.film_trailer && (
          <div className="bg-[#323137] w-full h-full py-4 sm:py-5 md:py-8 px-4 sm:px-5 md:px-9 flex-grow mt-4 md:mt-6 mb-4 rounded-xl md:rounded-3xl">
            <div>
              <p className="text-white text-2xl md:text-3xl lg:text-4xl font-bold pb-3">
                Trailer
              </p>
              <Trailer youtubeLink={data.info.film[0].film_trailer} />
            </div>
          </div>
        )}

        {/* Ratings Section */}
        {data && (
          <div className="bg-[#323137] w-full h-full py-4 sm:py-5 md:py-8 px-4 sm:px-5 md:px-9 flex-grow md:mt-6 mb-4 rounded-xl md:rounded-3xl">
            <div className="flex flex-col">
              <p className="text-white text-2xl md:text-3xl lg:text-4xl font-bold pb-3">
                Ratings
              </p>

              <div className="flex flex-row flex-wrap justify-between">
                <div className="w-full xl:w-[40%]">
                  <div className="flex flex-row items-center mb-2">
                    <Rating
                      value={Math.round(data.info.evaluate[0].film_rate)}
                      readonly
                      unratedColor="white"
                      ratedColor="yellow"
                      className="my-1 [&>span>svg]:w-5 [&>span>svg]:h-5 md:[&>span>svg]:w-6 md:[&>span>svg]:h-6 lg:[&>span>svg]:w-8 lg:[&>span>svg]:h-8 mr-2"
                    />
                    <p className="ms-1 text-base md:text-lg lg:text-xl font-medium text-gray-300">
                      {Math.round(data.info.evaluate[0].film_rate * 10) / 10}{" "}
                      out of 5 stars
                    </p>
                  </div>
                  <p className="text-base md:text-lg lg:text-xl font-light text-gray-300 ">
                    {ratingsData.length} ratings
                  </p>
                  <div className="w-full flex flex-row flex-wrap xl:gap-[5%]">
                    <div className="w-full mt-4">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div
                          key={star}
                          className="grid grid-cols-12 items-center mt-3 gap-1 sm:gap-2"
                        >
                          <div className="col-span-2 sm:col-span-2">
                            <span className="text-sm sm:text-base md:text-lg font-medium text-white">
                              {star} star
                            </span>
                          </div>
                          <div className="col-span-8 sm:col-span-9 h-4 sm:h-5 bg-gray-200 rounded-sm dark:bg-gray-700">
                            <div
                              className="h-4 sm:h-5 bg-yellow-600 rounded-sm"
                              style={{
                                width: `${
                                  ratingsData.length
                                    ? Math.round(
                                        ((sumRatingsByStar[star] || 0) /
                                          ratingsData.length) *
                                          100
                                      )
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <div className="col-span-2 sm:col-span-1 text-right">
                            <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                              {ratingsData.length
                                ? Math.round(
                                    ((sumRatingsByStar[star] || 0) /
                                      ratingsData.length) *
                                      100
                                  )
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-full xl:w-[58%] mt-4">
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
                </div>
              </div>
              {/* Rating Form Button */}
              {!openRatingForm && (
                <Button
                  color="purple"
                  onClick={() => setOpenRatingForm(!openRatingForm)}
                  className="!bg-[#773e77] text-xs sm:text-base my-5 self-start w-auto p-3"
                >
                  Leave a rating
                </Button>
              )}

              {/* Movie Ratings Component */}
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
