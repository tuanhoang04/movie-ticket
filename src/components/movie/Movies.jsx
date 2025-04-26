import React, { useEffect, useRef, useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import "./Movies.css";
import { CircularPagination } from "../CircularPagination";
import MovieCard from "./MovieCard";
import { useNavigate } from "react-router-dom";

export default function Movies() {
  const [nowShowing, setNowShowing] = useState([]);
  const [upcomings, setUpcomings] = useState([]);
  const filmsPerCate = 10;
  const [isLoading, setIsLoading] = useState(true);
  const nowSRef = useRef(null);
  const upcRef = useRef(null);
  const [shouldScroll,setShouldScroll] = useState(false);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/film/filmShowing`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        const allFilms = responseData[0];
        // Preload all images
        allFilms.forEach((film) => {
          const img = new Image();
          img.src = film.film_img;
        });

        setNowShowing(allFilms.filter((item) => item.film_type === 1));
        setUpcomings(allFilms.filter((item) => item.film_type === 0));
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
    if (shouldScroll&&nowSRef.current) {
      nowSRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setShouldScroll(false);
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
    if (shouldScroll&&upcRef.current) {
      upcRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setShouldScroll(false);
  }, [currentPageUpcoming, upcomings]);

  const navigate = useNavigate();
  const handleNavigate = (film_name, film_id) => {
    localStorage.setItem("film_id", film_id);
    navigate(`/movie/${film_name}`);
  };


  function createSlug(name) {
  return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
  return (
    <>
      {!isLoading && (
        <div>
          <img
            className="w-full h-[700px] object-cover object-center cursor-pointer"
            src={nowShowing[0].film_img}
            onClick={() => {
              handleNavigate(
                createSlug(nowShowing[0].film_name),
                nowShowing[0].film_id
              );
            }}
          />
        </div>
      )}
      <div className="px-3 lg:px-36">
        {!isLoading && (
          <div className="flex flex-col mt-7 mb-20">
            <div ref={nowSRef} className="flex flex-row items-center mb-5">
              <img src="/icons/red-dot.png" className="w-9 h-9" />
              <p className="text-white text-3xl drop-shadow-md ">Now Showing</p>
            </div>
            <div className="flex flex-wrap lg:gap-[3.75%] gap-[1%]">
              {currentNowShowings.map((item) => (
                <div className="mb-14 lg:w-[17%] w-[49%]" key={item.film_id}>
                  <MovieCard data={item} />
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
                  // Remove the scroll from here, as it's now in the useEffect
                }}
              />
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="flex flex-col mb-20">
            <div className="flex flex-row items-center mb-5" ref={upcRef}>
              <img src="/icons/red-dot.png" className="w-9 h-9" />
              <p className="text-white text-3xl drop-shadow-md">Upcoming Movies</p>
            </div>
            <div className="flex flex-wrap lg:gap-[3.75%] gap-[1%]">
              {currentUpcomings.map((item) => {
                return (
                  <div className="mb-14 lg:w-[17%] w-[49%]" key={item.film_id}>
                    <MovieCard data={item} className="transition-all duration-300 group-hover:shadow-xl group-hover:scale-105"/>
                  </div>
                );
              })}
            </div>
            <div>
              <CircularPagination
                key={totalPagesUpcoming}
                pagesNumber={totalPagesUpcoming}
                currentPage={currentPageUpcoming}
                handleChange={(value) => {
                  setCurrentPageUpcoming(value);
                  setShouldScroll(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
