import { useState } from "react";
import { useNavigate } from "react-router-dom";

function createSlug(name) {
  return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function MovieCard({ image, name, date, data, index }) {
  const navigate = useNavigate();
  const handleNavigate = (film_name, film_id) => {
    localStorage.setItem("film_id", film_id);
    navigate(`/movie/${film_name}`);
  };
  return (
    <div
      className="flex flex-col justify-start hover:cursor-pointer hover:outline outline-gray-600 rounded-md p-4"
      onClick={() =>
        handleNavigate(encodeURIComponent(createSlug(name)), index)
      }
    >
      <img
        src={image || data.film_img}
        className="rounded-2xl object-cover w-full"
      />
      <p className="text-[#5D6A81] lg:text-xl text-base w-full">
        {date || data.Release_date.substring(0, 10)}
      </p>
      <p className="text-white lg:text-xl text-base font-bold overflow-hidden text-ellipsis break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] lg:h-[3.55rem] h-[3.05rem]">
        {name || data.film_name}
      </p>
    </div>
  );
}
