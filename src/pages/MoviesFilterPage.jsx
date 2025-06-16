import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Dropdown from "../components/Dropdown";
import MovieCard from "../components/movie/MovieCard";
import { CircularPagination } from "../components/CircularPagination";
export default function MoviesFilterPage() {
  const [formData, setFormData] = useState({
    filmType: "",
    country: "",
    categoryId: "",
  });
  const begin = useRef(null);
  const [data, setData] = useState([]);
  const [statusLabel, setStatusLabel] = useState("All movies");
  const [genreLabel, setGenreLabel] = useState("All genres");
  const [countryLabel, setCountryLabel] = useState("All countries");
  const filmsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [shouldScroll, setShouldScroll] = useState(false);
  useEffect(() => {
    const indexOfLastFilm = currentPage * filmsPerPage;
    const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
    setCurrentMovies(data.slice(indexOfFirstFilm, indexOfLastFilm));
    setTotalPages(Math.max(Math.ceil(data.length / filmsPerPage), 1));
    if (shouldScroll && begin.current) {
      begin.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setShouldScroll(false);
  }, [currentPage, data]);
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/film/phim`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const result = await response.json();
        if (result) {
          setData(result);
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

  const handleStatusChange = (currStatus) => {
    setFormData({ ...formData, filmType: allStatus[currStatus] });
    setCurrentPage(1);
    setStatusLabel(currStatus);
  };

  const handleGenreChange = (currGenre) => {
    setFormData({ ...formData, categoryId: allGenres[currGenre] });
    setCurrentPage(1);
    setGenreLabel(currGenre);
  };
  const handleCountryChange = (currCountry) => {
    setFormData({ ...formData, country: allCountries[currCountry] });
    setCurrentPage(1);
    setCountryLabel(currCountry);
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  useEffect(() => {
    if (formData.filmType || formData.country || formData.categoryId) {
      console.log(formData);
      handleSubmit();
    }
  }, [formData]);

  const allStatus = {
    "All Movies": "4",
    "Now showing": "1",
    Upcoming: "0",
    Discontinued: "2",
  };

  const allGenres = {
    "All genres": "18",
    Horror: "1",
    Comedy: "2",
    Action: "3",
    Crime: "4",
    Adventure: "5",
    Animation: "6",
    Family: "7",
    "Science Fiction": "8",
    Mystery: "9",
    Fantasy: "10",
    Romance: "11",
    Drama: "12",
    Thriller: "13",
    Music: "14",
    Biography: "15",
    History: "16",
    War: "17",
  };

  const allCountries = {
    "All Countries": "2",
    "Việt Nam": "1",
    "Other countries": "0",
  };
  return (
    <div className="flex flex-col flex-grow min-h-screen bg-gradient-to-b from-[#1C1B21] to-[#141316]">
      <NavBar currentPage={"Movies"} />

      <div
        ref={begin}
        className="flex flex-col gap-3 md:gap-4 flex-grow py-8 md:py-12 lg:px-12 xl:px-20 2xl:px-32"
      >
        {/* Filter controls - responsive layout */}
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:flex-wrap md:gap-4 mb-10">
          <div className="w-[92%] md:w-auto min-w-[200px] flex items-center bg-gray-800 rounded-2xl border border-gray-600 shadow-md hover:shadow-lg hover:bg-gray-700 transition-all duration-200">
            <h1 className="text-white text-base md:text-lg lg:text-xl font-bold px-4 md:px-5 lg:px-6 py-3 border-r border-gray-600 place-content-center uppercase">
              Status
            </h1>
            <div className="flex-grow">
              <Dropdown
                label={statusLabel}
                handleChangeOption={handleStatusChange}
                options={Object.keys(allStatus)}
              />
            </div>
          </div>

          <div className="w-[92%] md:w-auto min-w-[200px] flex items-center bg-gray-800 rounded-2xl border border-gray-600 shadow-md hover:shadow-lg hover:bg-gray-700 transition-all duration-200">
            <h1 className="text-white text-base md:text-lg lg:text-xl font-bold px-4 md:px-5 lg:px-6 py-3 border-r border-gray-600 place-content-center uppercase">
              Genre
            </h1>
            <div className="flex-grow">
              <Dropdown
                label={genreLabel}
                handleChangeOption={handleGenreChange}
                options={Object.keys(allGenres)}
              />
            </div>
          </div>

          <div className="w-[92%] md:w-auto min-w-[200px] flex items-center bg-gray-800 rounded-2xl border border-gray-600 shadow-md hover:shadow-lg hover:bg-gray-700 transition-all duration-200">
            <h1 className="text-white text-base md:text-lg lg:text-xl font-bold px-4 md:px-5 lg:px-6 py-3 border-r border-gray-600 place-content-center uppercase">
              Country
            </h1>
            <div className="flex-grow">
              <Dropdown
                label={countryLabel}
                handleChangeOption={handleCountryChange}
                options={Object.keys(allCountries)}
              />
            </div>
          </div>
        </div>

        {/* No results message */}
        {(!currentMovies ||
          currentMovies?.length === 0 ||
          currentMovies === undefined) && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-medium mb-4">
              No results match. Please filter with another criteria.
            </h2>
          </div>
        )}

        {/* Movie grid - responsive layout */}
        {currentMovies && currentMovies.length > 0 && (
          <div className="flex flex-wrap lg:gap-[3.75%] gap-[1%]">
            {currentMovies.map((item) => {
              return (
                <div className="mb-14 lg:w-[17%] w-[49%]" key={item.film_id}>
                  <MovieCard
                    data={item}
                    className="transition-all duration-300 group-hover:shadow-xl group-hover:scale-105"
                  />
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
                  setShouldScroll(true);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
