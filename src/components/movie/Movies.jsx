import React, { useEffect, useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import "./Movies.css";
import { CircularPagination } from "../CircularPagination";
import MovieCard from "./MovieCard";

export default function Movies() {
  const [nowShowing, setNowShowing] = useState([]);
  const [upcomings, setUpcomings] = useState([]);
  const filmsPerCate = 8;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/film/filmShowing`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setNowShowing(responseData[0].filter((item) => item.film_type === 1));
        setUpcomings(responseData[0].filter((item) => item.film_type === 2));
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
  }, [currentPageNowShowing, nowShowing]);

  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
  const [currentUpcomings, setCurrentUpcomings] = useState([]);
  const [totalPagesUpcoming, setTotalPagesUpcoming] = useState(1);

  useEffect(() => {
    const indexOfLastFilmUpcoming = currentPageUpcoming * filmsPerCate;
    const indexOfFirstFilmUpcoming = indexOfLastFilmUpcoming - filmsPerCate;
    setCurrentUpcomings(
      upcomings.slice(indexOfFirstFilmUpcoming, indexOfLastFilmUpcoming)
    );
    setTotalPagesUpcoming(
      Math.max(Math.ceil(upcomings.length / filmsPerCate), 1)
    );
  }, [currentPageUpcoming, upcomings]);

  return (
    <div className="px-7 lg:px-32">
      {!isLoading && (
        <div className="flex flex-col mt-7 mb-20">
          <div>
            <p className="text-white text-3xl mb-4">Now Showing</p>
          </div>
          <div className="flex flex-wrap lg:gap-[10.666%] gap-[4%]">
            {currentNowShowings.map((item) => {
              const date = item.Release_date.substring(0, 10);
              const day = date.substring(8, 10);
              const month = date.substring(5, 7);
              const year = date.substring(0, 4);
              const exactDate = `${day}/${month}/${year}`;
              return (
                <div className="mb-6 lg:w-[17%] w-[22%]" key={item.film_id}>
                  <MovieCard
                    index={item.film_id}
                    image={item.film_img}
                    name={item.film_name}
                    date={exactDate}
                    rate={JSON.parse(item.film_rate).toFixed(1)}
                  />
                </div>
              );
            })}
          </div>
          {currentNowShowings.length <= 4 && (
            <div>
              <div className="mb-6 lg:w-[17%] w-[22%] aspect-[2/3] flex-grow-1" />
              <p className="text-[#5D6A81] lg:text-xl text-base w-full invisible">
                a
              </p>
              <p className="text-white lg:text-xl text-base font-bold overflow-hidden text-ellipsis break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] lg:h-[3.55rem] h-[3.05rem] invisible">
                a
              </p>
            </div>
          )}

          <div>
            <CircularPagination
              key={totalPagesNowShowing}
              pagesNumber={totalPagesNowShowing}
              handleChange={(value) => {
                setCurrentPageNowShowing(value);
              }}
            />
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col mb-20">
          <div>
            <p className="text-white text-3xl mb-4">Upcoming Movies</p>
          </div>

          <div className="flex flex-wrap lg:gap-[10.666%] gap-[4%]">
            {currentUpcomings.map((item) => {
              const date = item.Release_date.substring(0, 10);
              const day = date.substring(8, 10);
              const month = date.substring(5, 7);
              const year = date.substring(0, 4);
              const exactDate = `${day}/${month}/${year}`;
              return (
                <div className="mb-6 lg:w-[17%] w-[22%]" key={item.film_id}>
                  <MovieCard
                    index={item.film_id}
                    image={item.film_img}
                    name={item.film_name}
                    date={exactDate}
                    rate={JSON.parse(item.film_rate).toFixed(1)}
                  />
                </div>
              );
            })}
          </div>
          {currentUpcomings.length <= 4 && (
            <div>
              <div className="mb-6 lg:w-[17%] w-[22%] aspect-[2/3] flex-grow-1" />
              <p className="text-[#5D6A81] lg:text-xl text-base w-full invisible">
                a
              </p>
              <p className="text-white lg:text-xl text-base font-bold overflow-hidden text-ellipsis break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] lg:h-[3.55rem] h-[3.05rem] invisible">
                a
              </p>
            </div>
          )}
          <div>
            <CircularPagination
              key={totalPagesUpcoming}
              pagesNumber={totalPagesUpcoming}
              handleChange={(value) => {
                setCurrentPageUpcoming(value);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
