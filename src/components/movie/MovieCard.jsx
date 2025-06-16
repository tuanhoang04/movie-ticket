import { useState } from "react";
import { useNavigate } from "react-router-dom";

function createSlug(name) {
  return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function MovieCard({ data }) {
  const navigate = useNavigate();
  const handleNavigate = (film_name, film_id) => {
    localStorage.setItem("film_id", film_id);
    navigate(`/movie/${film_name}`);
  };

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() =>
        handleNavigate(
          encodeURIComponent(createSlug(data.film_name)),
          data.film_id
        )
      }
    >
      <img
        src={data.film_img}
        alt={data.film_name}
        className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Bottom blur overlay */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black/100 to-transparent pointer-events-none"></div>

      {/* Text content */}
      <div className="absolute flex flex-col items-center bottom-4 left-4 right-4 text-white z-10">
        <p className="lg:text-xl text-lg font-bold overflow-hidden text-ellipsis text-center w-full whitespace-nowrap">
          {data.film_name}
        </p>
        <p className="lg:text-xl text-lg text-gray-300">
          {data.Release_date.substring(0, 10).split("-").reverse().join("/")}
        </p>
      </div>
    </div>
  );
}
