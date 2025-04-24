import { useEffect, useState } from "react";
import Footer from "../Footer";
import NavBar from "../NavBar";
import { Button } from "@material-tailwind/react";
import Dropdown from "../Dropdown";
import CinemaShowtimeCard from "./ClusterShowtimeCard";
import ClusterShowtimeCard from "./ClusterShowtimeCard";
import { useNavigate } from "react-router-dom";
export default function BuyTicket() {
  const film_id = localStorage.getItem("film_id");
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const [data, setData] = useState(null);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityID, setCityID] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [clustersSchedule, setClustersSchedule] = useState([]);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

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
      )
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.success && film_id) {
            // action to do when login is successful
          } else {
            navigate(-1);
            alert("An error has occurred, please login and try again!");
          }
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      alert("An error has occurred, please login and try again!");
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    const fetchFilmSchedule = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/film/filmInfo/id=${film_id}/lichChieu/khuVuc_id=${cityID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          setSchedule(transformSchedule(result));
          // console.log(transformSchedule(result));
        } else {
          console.error("Lỗi khi truy cập:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi mạng:", error);
      }
    };

    if (cityID && selectedCity) {
      fetchFilmSchedule();
    }
  }, [cityID, film_id]);

  const fetchCities = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lichChieu/khuVuc`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        if (result) {
          setCities(result);
          // console.log(result);
        } else {
          // console.log(`Truy cập: ${result.message}`);
        }
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };
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

  function transformSchedule(data) {
    const result = [];
    const keys = Object.keys(data);

    keys.forEach((key, index) => {
      const [dayName, dateStr] = key.split(" ");
      const [day, month] = dateStr.split("-");

      const label = index === 0 ? "Today" : index === 1 ? "Tomorrow" : dayName;

      const formattedDate = `${day.padStart(2, "0")}/${month.padStart(2, "0")}`;

      const entry = { [label]: formattedDate };

      const innerArray = [entry];

      if (Object.keys(data[key]).length > 0) {
        const cinemas = Object.entries(data[key]).map(
          ([cinemaName, branches]) => ({
            [cinemaName]: branches,
          })
        );
        innerArray.push(cinemas);
      }

      result.push(innerArray);
    });

    return result;
  }

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
        data.message === "User sign-in session timed out" ||
        data.message === "User not logged in"
      ) {
        setMessage("Please login to continue!");
      }
      setLiked(data.liked);
    } catch (error) {
      console.error("Error fetching likeCheck:", error);
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
          // console.log(result);
          setData(result);
          const movieName = result.info.film[0].film_name;
          const rating =
            Math.round(result.info.evaluate[0].film_rate * 10) / 10;
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
      fetchLikeStatus();
      fetchCities();
    }
  }, []);

  return (
    <div className="bg-[#1C1B21] flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow px-8 lg:px-36 flex flex-col">
        {data && (
          <div className="bg-[#323137] w-full h-full py-4 sm:py-6 md:py-9 px-4 sm:px-6 md:px-10 flex-grow mt-6 md:mt-10 mb-4 rounded-xl md:rounded-3xl">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5">
              <div className="w-full lg:col-span-3">
                <img
                  src={data.info.film[0].film_img}
                  className="rounded-xl md:rounded-4xl w-full object-cover"
                  alt={data.info.film[0].film_name}
                />
              </div>

              {/* Movie Info - Full width on mobile, 7 cols on md+ */}
              <div className="w-full lg:col-span-7 flex flex-col justify-center">
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
                <p className="text-white text-xl leading-[1.25] pb-3 sm:pb-4 md:pb-5 font-normal text-justify">
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
                </div>
              </div>
            </div>
          </div>
        )}

        {cities && (
          <div className="bg-[#323137] w-full h-full py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10 flex-grow mt-6 md:mt-10 mb-4 rounded-xl md:rounded-3xl">
            {cities && (
              <div>
                <p className="text-white text-4xl font-bold pb-5">Buy ticket</p>
                <div className="border-2 w-fit rounded-lg">
                  <Dropdown
                    label={selectedCity || "Select a location"}
                    options={cities}
                    handleChangeOption={(option) => {
                      setSelectedButtonIndex(null);
                      setSelectedCity(option.region_name);
                      // console.log(option.region_name);
                      setClustersSchedule(null);
                      setCityID(option.region_id);
                    }}
                    // handleChangeCityID={(newID) => {
                    //   setCityID(newID);
                    // }}
                  />
                </div>
              </div>
            )}
            <div className="lg:hidden">
              {schedule && selectedCity && film_id && (
                <div className="flex flex-row lg:gap-8 justify-between mt-6 mb-9">
                  {schedule.slice(0, 5).map((item, index) => {
                    const [label, date] = Object.entries(item[0])[0];
                    const isSelected = selectedButtonIndex === index;
                    return (
                      <div key={index}>
                        <Button
                          variant="text"
                          onClick={() => {
                            setSelectedButtonIndex(index);
                            schedule[index].length > 1
                              ? setClustersSchedule(schedule[index][1])
                              : setClustersSchedule(1);
                          }}
                          className={`text-base sm:text-xl font-light p-0 ${
                            isSelected ? "text-[#B49AFF]" : "text-white"
                          }`}
                        >
                          <p className="hidden">{label}</p>
                          <p>{date}</p>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="lg:block hidden">
              {schedule && selectedCity && film_id && (
                <div className="flex flex-row gap-8 mt-6 mb-9">
                  {schedule.map((item, index) => {
                    const [label, date] = Object.entries(item[0])[0];
                    const isSelected = selectedButtonIndex === index;
                    return (
                      <div key={index}>
                        <Button
                          variant="text"
                          onClick={() => {
                            setSelectedButtonIndex(index);
                            schedule[index].length > 1
                              ? setClustersSchedule(schedule[index][1])
                              : setClustersSchedule(1);
                          }}
                          className={`text-xl font-light p-0 ${
                            isSelected ? "text-[#B49AFF]" : "text-white"
                          }`}
                        >
                          <p>{label}</p>
                          <p>{date}</p>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {clustersSchedule &&
              (clustersSchedule === 1 ? (
                <div>
                  <p className="text-lg lg:text-2xl text-white">
                    No showtime is available for this
                  </p>
                </div>
              ) : (
                <div>
                  {clustersSchedule.map((item, index) => {
                    return (
                      <ClusterShowtimeCard
                        key={index}
                        movieName={data.info.film[0].film_name}
                        data={item}
                      />
                    );
                  })}
                </div>
              ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
