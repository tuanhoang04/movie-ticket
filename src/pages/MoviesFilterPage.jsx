import { useState, useEffect } from "react";
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
  const [data, setData] = useState([]);
  const [statusLabel, setStatusLabel] = useState("All movies");
  const [genreLabel, setGenreLabel] = useState("All genres");
  const [countryLabel, setCountryLabel] = useState("All countries");
  const filmsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const indexOfLastFilm = currentPage * filmsPerPage;
    const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
    setCurrentMovies(
      data.slice(indexOfFirstFilm, indexOfLastFilm)
    );
    setTotalPages(
      Math.max(Math.ceil(data.length / filmsPerPage), 1)
    );
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
          console.log(`Truy cập: ${result.message}`);
        }
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };

  const handleStatusChange = (currStatus) => {
    setFormData({ ...formData, filmType: allStatus[currStatus] });
    setStatusLabel(currStatus);
  };

  const handleGenreChange = (currGenre) => {
    setFormData({ ...formData, categoryId: allGenres[currGenre] });
    setGenreLabel(currGenre);
  };
  const handleCountryChange = (currCountry) => {
    setFormData({ ...formData, country: allCountries[currCountry] });
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
    "Now playing": "1",
    Upcoming: "2",
    Discontinued: "0",
  };

  const allGenres = {
    "All genres": "18",
    "Kinh Dị": "1",
    "Hài kịch": "2",
    "Hành Động": "3",
    "Tội Phạm": "4",
    "Phiêu Lưu": "5",
    "Hoạt Hình": "6",
    "Gia Đình": "7",
    "Khoa Học Viễn Tưởng": "8",
    "Bí Ẩn": "9",
    "Giả Tưởng": "10",
    "Lãng Mạn": "11",
    Drama: "12",
    "Giật Gân": "13",
    "Âm Nhạc": "14",
    "Tiểu Sử": "15",
    "Lịch Sử": "16",
    "Chiến Tranh": "17",
  };

  const allCountries = {
    "All Countries": "2",
    "Việt Nam": "1",
    "Other countries": "0",
  };
  return (
    <div className="flex flex-col flex-grow min-h-screen bg-[#1C1B21]">
      <NavBar currentPage={"Movies"} />
      <div className="flex flex-col gap-3 flex-grow py-7 px-8 lg:px-36">
        <div className="flex flex-row gap-5">
          <div className="w-fit flex items-center gap-10 bg-gray-800 pl-5 rounded-2xl">
            <h1 className="text-white text-xl font-normal">Status</h1>
            <Dropdown
              label={statusLabel}
              handleChangeOption={handleStatusChange}
              options={Object.keys(allStatus)}
            />
          </div>

          <div className="w-fit flex items-center gap-10 bg-gray-800 pl-5 rounded-2xl">
            <h1 className="text-white text-xl font-normal">Genre</h1>
            <Dropdown
              label={genreLabel}
              handleChangeOption={handleGenreChange}
              options={Object.keys(allGenres)}
            />
          </div>

          <div className="w-fit flex items-center gap-10 bg-gray-800 pl-5 rounded-2xl">
            <h1 className="text-white text-xl font-normal">Country</h1>
            <Dropdown
              label={countryLabel}
              handleChangeOption={handleCountryChange}
              options={Object.keys(allCountries)}
            />
          </div>
        </div>

        {currentMovies && (
          <div className="flex flex-wrap lg:gap-[10.667%] gap-[4%]">
            {currentMovies.map((item) => {
              return (
                <div className="mb-6 lg:w-[17%] w-[48%]" key={item.film_id}>
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
      <Footer />
    </div>
  );
}
