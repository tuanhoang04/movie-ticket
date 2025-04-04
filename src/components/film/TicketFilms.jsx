import React, { useEffect, useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import "./TicketFilms.css";
import { CircularPagination } from "../CircularPagination";
import FilmCard from "./FilmCard";

export default function TicketFilms() {
  const [data, setData] = useState([[]]);
  const [showing, setShowing] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const filmsPerPage = 15;
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
  const handlePageChange = (value) => {
    setCurrentPage(value);
  };

  const currentData = showing
    ? data[0].filter((item) => item.film_type === 1)
    : data[0].filter((item) => item.film_type === 2);

  const indexOfLastFilm = currentPage * filmsPerPage;
  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
  const currentFilms = currentData.slice(indexOfFirstFilm, indexOfLastFilm);
  console.log(JSON.stringify(currentFilms));
  const totalPages = Math.max(Math.ceil(currentData.length / filmsPerPage), 1);

  return (
    <>
      {!isLoading&&<div className="my-6 w-60 justify-self-center">
        <Select
          value={showing}
          className="text-white text-xl w-60 bg-[#313035] border-none after:border-none before:border-none"
          onChange={(val) => {
            setShowing(val);
            setCurrentPage(1);
          }}
        >
          <Option className="text-xl" value={true}>
            Now Showing
          </Option>
          <Option className="text-xl" value={false}>
            Upcoming Movies
          </Option>
        </Select>
      </div>}
      {data && (
        <div className="flex flex-wrap px-6 lg:px-24 gap-[5%]">
          {currentFilms.map((item) => {
            const date = item.Release_date.substring(0, 10);
            const day = date.substring(8, 10);
            const month = date.substring(5, 7);
            const year = date.substring(0, 4);
            const exactDate = `${day}/${month}/${year}`;
            return (
              <FilmCard
                key={item.film_id}
                index={item.film_id}
                image={item.film_img}
                name={item.film_name}
                date={exactDate}
                rate={JSON.parse(item.film_rate).toFixed(1)}
              />
            );
          })}
        </div>
      )}

      {!isLoading && (
        <div>
          <CircularPagination
            key={totalPages}
            pagesNumber={totalPages}
            handleChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
