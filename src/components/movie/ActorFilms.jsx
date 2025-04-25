import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import Footer from "../Footer";
import Movies from "./Movies";
import MovieCard from "./MovieCard";
import { CircularPagination } from "../CircularPagination";
import { useEffect, useState } from "react";

export default function ActorFilms() {
  const navigate = useNavigate();
  const actor_id = localStorage.getItem("actor_id");
  const [actorData, setActorData] = useState(null);
  const [filmsData, setFilmsData] = useState([]);
  const fetchActorData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/actor/actor_id=${actor_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setFilmsData(result.films);
        setActorData(result.actor);
        console.log(result);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };
  useEffect(() => {
    fetchActorData();
  }, []);

  const filmsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const indexOfLastFilm = currentPage * filmsPerPage;
    const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
    setCurrentMovies(filmsData.slice(indexOfFirstFilm, indexOfLastFilm));
    setTotalPages(Math.max(Math.ceil(filmsData.length / filmsPerPage), 1));
  }, [currentPage, filmsData]);

  const clickFilm = (film_id) => {
    localStorage.setItem("film_id", film_id);
    navigate("/movie/:film_name");
  };

  return (
    <div className="bg-[#1C1B21] min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow p-4 md:p-6 lg:px-12 xl:px-20 2xl:px-32">
        {actorData && filmsData && (
          <div className="bg-[#323137] w-full h-full py-4 sm:py-5 md:py-8 px-4 sm:px-5 md:px-9 flex-grow rounded-3xl">
            <div className="md:grid md:grid-cols-11 md:grid-rows-1 flex flex-col gap-8">
              <img
                src={actorData.actor_img}
                className="md:col-span-2 md:row-span-1 rounded-3xl w-full"
              />
              <div className="col-span-9 gap-5 md:gap-10 flex flex-col justify-center">
                <p className="text-white text-3xl">
                  Actor: {actorData?.actor_name}
                </p>
                <p className="text text-white opacity-70 text-xl mr-3 text-justify">
                  {actorData.actor_describe}
                </p>
              </div>

              {/* <p className="text-white text-xl">{actorData?.actor_describe}</p> */}
            </div>
            <div>
              <hr className="my-7 opacity-70" />
              <div className="flex flex-row items-center mb-2">
                <img src="/icons/red-dot.png" className="w-9 h-9 mr-1" />
                <p className="text-white font-light text-3xl">
                  LIST OF MOVIES PARTICIPATING
                </p>
              </div>
              {currentMovies && (
                <div className="flex flex-wrap lg:gap-[9.6%] gap-[4%]">
                  {currentMovies.map((item) => {
                    return (
                      <div
                        className="mb-4 lg:w-[17.8%] w-[48%]"
                        key={item.film_id}
                      >
                        <MovieCard data={item} />
                      </div>
                    );
                  })}

                  <div className="w-full">
                    <CircularPagination
                      key={totalPages}
                      pagesNumber={totalPages}
                      currentPage={currentPage}
                      handleChange={(value) => {
                        setCurrentPage(value);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
