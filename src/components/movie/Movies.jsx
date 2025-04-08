import React, { useEffect, useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import "./Movies.css";
import { CircularPagination } from "../CircularPagination";
import MovieCard from "./MovieCard";

export default function Movies() {
  const [data, setData] = useState([[]]);
  const [currentPageNowShowing, setCurrentPageNowShowing] = useState(1);
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
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
        setData(responseData);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  }, []);
  const nowShowing = data[0].filter((item) => item.film_type === 1);
  const upcoming = data[0].filter((item) => item.film_type === 2);

  const indexOfLastFilmNowShowing = currentPageNowShowing * filmsPerCate;
  const indexOfFirstFilmNowShowing = indexOfLastFilmNowShowing - filmsPerCate;

  const indexOfLastFilmUpcoming = currentPageUpcoming * filmsPerCate;
  const indexOfFirstFilmUpcoming = indexOfLastFilmUpcoming - filmsPerCate;

  const currentNowShowings = nowShowing.slice(
    indexOfFirstFilmNowShowing,
    indexOfLastFilmNowShowing
  );
  const totalPagesNowShowing = Math.max(
    Math.ceil(nowShowing.length / filmsPerCate),
    1
  );

  const currentUpcomings = upcoming.slice(
    indexOfFirstFilmUpcoming,
    indexOfLastFilmUpcoming
  );
  const totalPagesUpcoming = Math.max(
    Math.ceil(upcoming.length / filmsPerCate),
    1
  );

  return (
    <div className="px-6 lg:px-24">
      {data && (
        <div className="flex flex-col w-[90%] mt-7 mb-20">
          <div>
            <p className="text-white text-3xl mb-4">Now Showing</p>
          </div>
          <div className="grid grid-cols-4 grid-rows-2">
            {currentNowShowings.map((item) => {
              const date = item.Release_date.substring(0, 10);
              const day = date.substring(8, 10);
              const month = date.substring(5, 7);
              const year = date.substring(0, 4);
              const exactDate = `${day}/${month}/${year}`;
              return (
                <div className="row-span-1 col-span-1 mb-6 w-[75%]">
                  <MovieCard
                    key={item.film_id}
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

      {data && (
        <div className="flex flex-col w-[90%] mb-20">
          <div>
            <p className="text-white text-3xl mb-4">Upcoming Movies</p>
          </div>

          <div className="grid grid-cols-4 grid-rows-2">
            {currentUpcomings.map((item) => {
              const date = item.Release_date.substring(0, 10);
              const day = date.substring(8, 10);
              const month = date.substring(5, 7);
              const year = date.substring(0, 4);
              const exactDate = `${day}/${month}/${year}`;
              return (
                <div className="row-span-1 col-span-1 mb-6 w-[75%]">
                  <MovieCard
                    key={item.film_id}
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
