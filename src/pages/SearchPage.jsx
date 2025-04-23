import { useEffect, useState } from "react";
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
  const filmsPerCate = 8;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
      console.error("Lỗi mạng:", error);
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
    nowShowing && console.log(nowShowing);
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
    upcomings && console.log(upcomings);
  }, [currentPageUpcoming, upcomings]);

  const handleNavigate = (film_name, film_id) => {
    localStorage.setItem("film_id", film_id);
    navigate(`/movie/${film_name}`);
  };
  return (
    <div className="bg-[#1C1B21] flex flex-col min-h-screen">
      <NavBar currentPage={"search"} />
      <div className="flex flex-grow">
        <div className="px-3 lg:px-36 w-full">
          {!isLoading &&
            ((!upcomings && !nowShowing) ||
              (upcomings?.length == 0 && nowShowing?.length == 0) ||
              (upcomings === undefined && nowShowing === undefined)) && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-white text-3xl font-medium mb-4">
                  No Result for "{searchTerm}"
                </h2>
                <p className="text-gray-400 text-lg">
                  No results match. Please search for another keyword.
                </p>
              </div>
            )}
          {nowShowing?.length > 0 && (
            <div className="flex flex-col mt-7 mb-20">
              <div className="flex flex-row items-center mb-4">
                <img src="/icons/red-dot.png" className="w-9 h-9" />
                <p className="text-white text-3xl">Now Showing</p>
              </div>
              <div className="flex flex-wrap lg:gap-[9%] gap-[1%]">
                {currentNowShowings.map((item) => (
                  <div
                    className="mb-6 lg:w-[18.25%] w-[49%]"
                    key={item.film_id}
                  >
                    <MovieCard data={item} />
                  </div>
                ))}
              </div>
              {currentNowShowings.length <= 4 && (
                <div className="mb-6 lg:w-[18.25%] w-[49%]">
                  <div className="flex flex-col justify-start rounded-md p-4">
                    <div className="rounded-2xl w-full aspect-[2/3] bg-transparent mb-4" />
                    <div className="invisible">
                      <p className="text-[#5D6A81] lg:text-xl text-lg w-full">
                        &nbsp;
                      </p>
                      <p className="text-white lg:text-xl text-lg font-bold overflow-hidden text-ellipsis break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] h-[3.55rem]">
                        &nbsp;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <CircularPagination
                  key={totalPagesNowShowing}
                  pagesNumber={totalPagesNowShowing}
                  currentPage={currentPageNowShowing}
                  handleChange={(value) => {
                    setCurrentPageNowShowing(value);
                  }}
                />
              </div>
            </div>
          )}

          {upcomings?.length > 0 && (
            <div className="flex flex-col mb-20">
              <div className="flex flex-row items-center mb-4">
                <img src="/icons/red-dot.png" className="w-9 h-9" />
                <p className="text-white text-3xl">Upcoming Movies</p>
              </div>

              <div className="flex flex-wrap lg:gap-[10.667%] gap-[1%]">
                {currentUpcomings.map((item) => {
                  return (
                    <div className="mb-6 lg:w-[17%] w-[49%]" key={item.film_id}>
                      <MovieCard data={item} />
                    </div>
                  );
                })}
              </div>
              {currentUpcomings.length <= 4 && (
                <div className="mb-6 lg:w-[17%] w-[49%]">
                  <div className="flex flex-col justify-start rounded-md p-4">
                    <div className="rounded-2xl w-full aspect-[2/3] bg-transparent" />
                    <div className="invisible">
                      <p className="text-[#5D6A81] lg:text-xl text-lg w-full">
                        &nbsp;
                      </p>
                      <p className="text-white lg:text-xl text-lg font-bold overflow-hidden text-ellipsis break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] h-[3.55rem]">
                        &nbsp;
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <CircularPagination
                  key={totalPagesUpcoming}
                  pagesNumber={totalPagesUpcoming}
                  currentPage={currentPageUpcoming}
                  handleChange={(value) => {
                    setCurrentPageUpcoming(value);
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