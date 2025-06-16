import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useEffect, useRef, useState } from "react";
import { CircularPagination } from "../components/CircularPagination";
import {
  Button,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import Dropdown from "../components/Dropdown";
import MovieCard from "../components/movie/MovieCard";

const theaterImgStyle = "rounded-full w-[40px] h-[40px]";
export default function TheatersAndMovies() {
  const [nowShowing, setNowShowing] = useState([]);
  const filmsPerCate = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [shouldScroll, setShouldScroll] = useState(false);
  const begin = useRef(null);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/film/filmShowing`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        const allFilms = responseData[0];
        setNowShowing(allFilms.filter((item) => item.film_type === 1));
        setIsLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const [currentPageNowShowing, setCurrentPageNowShowing] = useState(1);
  const [currentNowShowings, setCurrentNowShowing] = useState([]);
  const [totalPagesNowShowing, setTotalPagesNowShowing] = useState(1);
  useEffect(() => {
    const indexOfLastFilmNowShowing = currentPageNowShowing * filmsPerCate;
    const indexOfFirstFilmNowShowing = indexOfLastFilmNowShowing - filmsPerCate;
    setCurrentNowShowing(
      nowShowing.slice(indexOfFirstFilmNowShowing, indexOfLastFilmNowShowing)
    );
    setTotalPagesNowShowing(
      Math.max(Math.ceil(nowShowing.length / filmsPerCate), 1)
    );
    if (shouldScroll && begin.current) {
      begin.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setShouldScroll(false);
  }, [currentPageNowShowing, nowShowing]);

  const navigate = useNavigate();
  const handleNavigate = (film_name, film_id) => {
    localStorage.setItem("film_id", film_id);
    navigate(`/movie/${film_name}`);
  };

  function createSlug(name) {
    return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
  }

  const [areas, setAreas] = useState([]);
  const [currentAreaName, setCurrentAreaName] = useState(
    localStorage.getItem("currentAreaName") || ""
  );
  const [currentAreaId, setCurrentAreaId] = useState(
    localStorage.getItem("currentAreaId") || -1
  );
  const [theaters, setTheaters] = useState([]);
  const [currentCinema, setCurrentCinema] = useState(null);

  const handleOptionClick = (option) => {
    localStorage.setItem("currentAreaId", option.region_id);
    localStorage.setItem("currentAreaName", option.region_name);
    setCurrentAreaName(option.region_name);
    setCurrentAreaId(option.region_id);
  };

  const getTheaterLogo = (cluster_name) => {
    switch (cluster_name) {
      case "Beta Cinemas":
        return "/beta.png";
      case "CGV Cinemas":
        return "/cgv.jpg";
      case "Lotte Cinemas":
        return "/lotte.png";
      case "Cinestar":
        return "/cinestar.png";
      case "Mega GS Cinemas":
        return "/megags.png";
      case "Dcine":
        return "/dcine.png";
      case "Starlight":
        return "/starlight.png";
      case "Rio Cinemas":
        return "/riocinema.png";
      case "Touch Cinema":
        return "/touchcinema.webp";

      default:
        return "/ico.png";
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/rap/region_id=${currentAreaId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setTheaters(result);
        } else {
          console.error("Error accessing:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };
    console.log(`Current Area ID: ${currentAreaId}`);

    if (setCurrentAreaId !== -1) {
      fetchData();
    }
  }, [currentAreaId]);

  const fetchData = async () => {
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
          setAreas(result);
          console.log(result);
        } else {
          console.log(`Access: ${result.message}`);
        }
      } else {
        console.error("Error accessing:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const fetchCinemaTime = async (info) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rap/cinema_id=${info.cinema_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();

        setCurrentCinema({
          info: info,
          time: result,
        });
      } else {
        console.error("Error accessing:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  return (
    <div className="bg-gradient-to-b from-[#1C1B21] to-[#141316] min-h-screen flex flex-col">
      <NavBar currentPage="Buy Ticket" key="Buy Ticket" />
      <div className="flex-grow">
        {/* Now showing movies section */}
        <div className="px-8 lg:px-36">
          {!isLoading && (
            <div className="flex flex-col mt-16 mb-16">
              <div className="flex items-center justify-center">
                <p
                  ref={begin}
                  className="text-white text-2xl md:text-4xl mb-12 font-bold "
                >
                  Buy Ticket by Movies
                </p>
              </div>
              <div className="flex flex-wrap lg:gap-[3.75%] gap-[1%]">
                {currentNowShowings.map((item) => (
                  <div className="mb-14 lg:w-[17%] w-[49%]" key={item.film_id}>
                    <MovieCard
                      data={item}
                      className="transition-all duration-300 group-hover:shadow-xl group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
              <div>
                <CircularPagination
                  key={totalPagesNowShowing}
                  pagesNumber={totalPagesNowShowing}
                  currentPage={currentPageNowShowing}
                  handleChange={(value) => {
                    setCurrentPageNowShowing(value);
                    setShouldScroll(true);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Thay <hr> bằng divider gradient */}
        <div className="flex justify-center mx-8 lg:mx-36 my-10">
          <div className="w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-600 to-transparent shadow-md"></div>
        </div>

        <div className="flex items-center justify-center">
          <p className="text-white text-2xl md:text-4xl md:mb-4 font-bold">
            Buy Ticket by Cinemas
          </p>
        </div>

        {/* Cinemas section */}

        <div id="body" className="">
          <div className="m-auto w-fit mt-10 flex items-center bg-gray-800 rounded-2xl border border-gray-600 shadow-md hover:shadow-lg hover:bg-gray-700 transition-all duration-200">
            <div className="text-white text-base md:text-lg lg:text-xl font-bold px-4 md:px-5 lg:px-6 py-3 border-r border-gray-600 place-content-center uppercase">
              Location
            </div>

            <Dropdown
              label={currentAreaName || "Select a location"}
              options={areas}
              handleChangeOption={handleOptionClick}
            />
          </div>

          <div className="min-h-screen p-4">
            {currentAreaName && (
              <div className=" p-4 md:p-6 lg:p-12 xl:p-20 2xl:p-32 pt-10 2xl:!pt-12 grid grid-cols-1 xl:grid-cols-7 gap-5 text-white h-fit xl:min-h-[400px]  ">
                <div className="col-span-1 xl:col-span-2 h-full min-h-[300px] xl:min-h-[800px] bg-white bg-opacity-10 rounded-lg border-gray-600 shadow-lg">
                  <p className=" p-5 pb-0 text-3xl font-bold ">
                    Cinemas in {currentAreaName}
                  </p>
                  {theaters.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 mt-4 h-fit max-h-[250px] xl:max-h-[800px] overflow-y-scroll scrollbar ">
                      {theaters.map((item) => (
                        <div
                          onClick={() => {
                            fetchCinemaTime(item);
                          }}
                          key={item.cinema_id}
                          style={
                            item.cinema_id === currentCinema?.info.cinema_id
                              ? { backgroundColor: "#502A50" }
                              : {}
                          }
                          className="flex items-center gap-6 p-4 cursor-pointer hover:bg-[#502A50] bg-white bg-opacity-10 m-2 mx-5 rounded-lg"
                        >
                          <img
                            src={getTheaterLogo(item.cluster_name)}
                            alt="logo"
                            className={theaterImgStyle}
                          ></img>
                          <div>
                            <p className="text-[18px] font-bold">
                              {item.cinema_name}
                            </p>
                            <p className="overflow-hidden line-clamp-2">
                              {item.address}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {currentCinema && (
                  <div className=" col-span-1 xl:col-span-5">
                    <div className="group rounded-xl p-5 bg-white bg-opacity-10 border-gray-600 shadow-lg transition-all duration-300 hover:scale-101 hover:shadow-xl">
                      <div className="flex justify-between gap-5 items-center w-full">
                        <img
                          src={getTheaterLogo(currentCinema.info.cluster_name)}
                          alt="logo"
                          className={theaterImgStyle}
                        ></img>
                        <div className="w-full flex flex-col xl:flex-row xl:items-center xl:justify-between">
                          <div className="">
                            <p className="text-2xl font-bold text-white ">
                              {currentCinema.info.cinema_name}
                            </p>
                            <p className="text-lg text-white xl:w-3/4">
                              {currentCinema.info.address}
                            </p>
                          </div>
                          <a
                            href={
                              "https://www.google.com/maps/search/" +
                              currentCinema.info.cinema_name.replace(/ /g, "+")
                            }
                            className="underline text-white hover:text-purple-300 hover:scale-105 transition-all duration-200"
                          >
                            <div className="flex items-center gap-2 text-2xl text-nowrap">
                              Find in map
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                class="bi bi-box-arrow-up-right"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                                />
                              </svg>
                            </div>
                          </a>
                        </div>
                      </div>
                      <p className="text-lg text-white mt-5 line-clamp-3">
                        View Showtimes and Buy Tickets easily and quickly
                        nationwide at {currentCinema.info.cinema_name} - a
                        cinema under {currentCinema.info.cluster_name}, only at
                        Starlight. {currentCinema.info.cinema_name} is designed
                        to Hollywood cinema standards, featuring Dolby 7.1
                        surround sound and a large, ultra-clear screen.{" "}
                        {currentCinema.info.cinema_name} is part of the{" "}
                        {currentCinema.info.cluster_name} chain — a proudly
                        locally owned cinema system. Even as a domestic brand,{" "}
                        {currentCinema.info.cinema_name} is committed to
                        delivering professional service, an
                        international-quality movie experience, and affordable
                        ticket prices.
                      </p>
                    </div>
                    <Tabs
                      className="mt-5 rounded-2xl bg-white bg-opacity-10 "
                      value={Object.keys(currentCinema.time)[0]}
                    >
                      <TabsHeader
                        className="bg-transparent h-[66px] gap-10 flex justify-start border-b-2 rounded-none p-2 pl-10 overflow-scroll hide-scrollbar "
                        indicatorProps={{
                          className: "bg-[#502A50]   rounded-xl",
                        }}
                      >
                        {Object.keys(currentCinema.time).map((value, index) => {
                          return (
                            <Tab
                              key={index}
                              value={index}
                              className="text-white text-nowrap"
                            >
                              {value}
                            </Tab>
                          );
                        })}
                      </TabsHeader>
                      <TabsBody
                        className="p-2"
                        animate={{
                          initial: { y: 0 },
                          mount: { y: 0 },
                          unmount: { y: 0 },
                        }}
                      >
                        {Object.values(currentCinema.time).map(
                          (value, index) => {
                            return (
                              <TabPanel
                                className="text-white "
                                key={index}
                                value={index}
                              >
                                {typeof value !== "object" ? (
                                  <span className="grid place-content-center">
                                    {value}
                                  </span>
                                ) : (
                                  <div className=" flex flex-col gap-5">
                                    {Object.keys(value).map((key) => {
                                      return (
                                        <div className="flex flex-col items-center xl:items-start xl:flex-row lg:gap-10 justify-between border-b-2 border-white border-opacity-30 py-5 mx-5 h-fit">
                                          <div className="flex flex-col items-center md:flex-row w-full gap-5">
                                            <img
                                              className="rounded-xl xl:w-32 xl:h-52"
                                              src={value[key].film_img}
                                              alt=""
                                            />
                                            <div className=" flex flex-col xl:flex-row gap-10 justify-between text-xl p-3 py-5 ">
                                              <div className="flex flex-col xl:flex-row justify-between gap-5 w-full">
                                                <div className="p-2 flex flex-col items-center md:items-start gap-2 xl:w-4/5">
                                                  <p className="text-2xl font-bold line-clamp-2">
                                                    {value[key].film_name}
                                                  </p>
                                                  <div className="text-xl flex gap-2 text-gray-400 line-clamp-2  ">
                                                    {value[key].film_categories
                                                      ? value[
                                                          key
                                                        ].film_categories
                                                          .map((item) => {
                                                            return item.category_name;
                                                          })
                                                          .join(", ")
                                                      : "genres"}
                                                  </div>
                                                  <div className="text-xl lg:mt-10 line-clamp-3 lg:w-full">
                                                    {value[key].film_describe ||
                                                      "Description"}
                                                  </div>
                                                </div>

                                                <div className=" grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-10 xl:w-52">
                                                  <div className=" flex flex-col gap-2">
                                                    <div className="flex justify-between">
                                                      <span>Rating</span>
                                                      <div className="flex items-center gap-2">
                                                        {value[key].rating || 5}
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          width="16"
                                                          height="16"
                                                          fill="currentColor"
                                                          class="bi bi-star-fill"
                                                          viewBox="0 0 16 16"
                                                        >
                                                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                        </svg>
                                                      </div>
                                                    </div>
                                                    <div className="flex justify-between">
                                                      <span>Age</span>
                                                      <span>
                                                        R-{value[key].age_limit}
                                                      </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                      <span>Duration</span>
                                                      <span>
                                                        {value[key].duration}m
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <Button
                                                    color="red"
                                                    className="bg-[#B44242] rounded-xl flex p-2 px-3 items-center w-[130px] m-auto "
                                                    onClick={() => {
                                                      localStorage.setItem(
                                                        "film_id",
                                                        value[key].film_id
                                                      );
                                                      navigate(
                                                        "/movie/buyTicket/" +
                                                          value[key].film_name
                                                      );
                                                    }}
                                                  >
                                                    <img
                                                      src="/icons/ticket.png"
                                                      className="w-7 mr-2"
                                                    />
                                                    <p className="text-sm font-bold">
                                                      Buy Ticket
                                                    </p>
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </TabPanel>
                            );
                          }
                        )}
                      </TabsBody>
                    </Tabs>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
