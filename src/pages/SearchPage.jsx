import { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { CircularPagination } from "../components/CircularPagination";
import MovieCard from "../components/movie/MovieCard";

function createSlug(name) {
  return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function SearchPage() {
  const [data, setData] = useState(null);
  const searchTerm = localStorage.getItem("searchTerm");
  const [nowShowing, setNowShowing] = useState([]);
  const [upcomings, setUpcomings] = useState([]);
  const filmsPerCate = 10;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const beginNS = useRef(null);
  const [shouldScroll,setShouldScroll] = useState(false);
  const beginUC = useRef(null);
  const [currentPageNowShowing, setCurrentPageNowShowing] = useState(1);
  const [currentNowShowings, setCurrentNowShowing] = useState([]);
  const [totalPagesNowShowing, setTotalPagesNowShowing] = useState(1);
  const [currentPageUpcoming, setCurrentPageUpcoming] = useState(1);
  const [currentUpcomings, setCurrentUpcomings] = useState([]);
  const [totalPagesUpcoming, setTotalPagesUpcoming] = useState(1);
  const fetchData = async (e) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/film/searchFilm/${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const currData = await response.json();
      setNowShowing(currData[0]);
      setUpcomings(currData[1]);
      setData(currData); // Cập nhật state với dữ liệu
      setIsLoading(false);
    } catch (error) {
      console.error("Network error", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const indexOfLastFilmNowShowing = currentPageNowShowing * filmsPerCate;
    const indexOfFirstFilmNowShowing = indexOfLastFilmNowShowing - filmsPerCate;
    nowShowing &&
      setCurrentNowShowing(
        nowShowing.slice(indexOfFirstFilmNowShowing, indexOfLastFilmNowShowing)
      );
    nowShowing &&
      setTotalPagesNowShowing(
        Math.max(Math.ceil(nowShowing.length / filmsPerCate), 1)
      );

      if(shouldScroll&&beginNS.current){
        beginNS.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setShouldScroll(false);
  }, [currentPageNowShowing, nowShowing]);

  useEffect(() => {
    const indexOfLastFilmUpcoming = currentPageUpcoming * filmsPerCate;
    const indexOfFirstFilmUpcoming = indexOfLastFilmUpcoming - filmsPerCate;
    upcomings &&
      setCurrentUpcomings(
        upcomings.slice(indexOfFirstFilmUpcoming, indexOfLastFilmUpcoming)
      );
    upcomings &&
      setTotalPagesUpcoming(
        Math.max(Math.ceil(upcomings.length / filmsPerCate), 1)
      );
    if(shouldScroll&&beginUC.current){
      beginUC.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setShouldScroll(false);
  }, [currentPageUpcoming, upcomings]);

  const handleNavigate = (film_name, film_id) => {
    localStorage.setItem("film_id", film_id);
    navigate(`/movie/${film_name}`);
  };
  return (
    <div className="bg-gradient-to-b from-[#1C1B21] to-[#141316] flex flex-col min-h-screen">
      <NavBar currentPage={"search"} />
      <div className="flex flex-grow">
        <div className="flex flex-col px-3 lg:px-36 w-full">
          {!isLoading &&
            ((!upcomings && !nowShowing) ||
              (upcomings?.length == 0 && nowShowing?.length == 0) ||
              (upcomings === undefined && nowShowing === undefined)) && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-white text-3xl font-medium mb-4">
                  No results found for "{searchTerm}"
                </h2>
                <p className="text-gray-400 text-lg">
                  Oops! Nothing matches your search. Maybe try a new keyword?
                </p>
              </div>
            )}

          {searchTerm && (nowShowing?.length > 0 || upcomings?.length > 0) && (
            <p className="self-center text-white text-3xl my-14">
              Showing results for "{searchTerm}"
            </p>
          )}
          {nowShowing?.length > 0 && (
            <div className="flex flex-col mt-7">
              <div ref={beginNS} className="flex flex-row items-center mb-5">
                <img src="/icons/red-dot.png" className="w-9 h-9" />
                <p className="text-white text-3xl">Now Showing Movies</p>
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
                  }}
                />
              </div>
            </div>
          )}

          {upcomings?.length > 0 && (
            <div className="flex flex-col mt-20 mb-20">
              <div ref={beginUC} className="flex flex-row items-center mb-5">
                <img src="/icons/red-dot.png" className="w-9 h-9" />
                <p className="text-white text-3xl">Upcoming Movies</p>
              </div>

              <div className="flex flex-wrap lg:gap-[3.75%] gap-[1%]">
                {currentUpcomings.map((item) => {
                  return (
                    <div
                      className="mb-14 lg:w-[17%] w-[49%]"
                      key={item.film_id}
                    >
                      <MovieCard data={item} />
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
      </div>
      <Footer />
    </div>
  );
}
