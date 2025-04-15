import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Dropdown from "../components/Dropdown";
export default function MoviesFilterPage() {
  const [formData, setFormData] = useState({
    filmType: "",
    country: "",
    categoryId: "",
  });
  const [data, setData] = useState(null);
  const handleSubmit = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/film/phim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  };
  const handleCateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    handleSubmit();
  }, []);
  useEffect(() => {
    if (formData.filmType || formData.country || formData.categoryId) {
      handleSubmit();
    }
  }, [formData]);

  const allStatus = {
    "All Movies": 4,
    "Now playing": 1,
    Upcoming: 2,
    Discontinued: 0,
  };

  const allGenres = {
    "All genres": 18,
    "Kinh Dị": 1,
    "Hài kịch": 2,
    "Hành Động": 3,
    "Tội Phạm": 4,
    "Phiêu Lưu": 5,
    "Hoạt Hình": 6,
    "Gia Đình": 7,
    "Khoa Học Viễn Tưởng": 8,
    "Bí Ẩn": 9,
    "Giả Tưởng": 10,
    "Lãng Mạn": 11,
    Drama: 12,
    "Giật Gân": 13,
    "Âm Nhạc": 14,
    "Tiểu Sử": 15,
    "Lịch Sử": 16,
    "Chiến Tranh": 17,
  };

  const allCountries = {
    "All Countries": 2,
    "Việt Nam": 1,
    "Quốc gia khác": 0,
  };
  return (
    <div className="flex flex-col flex-grow min-h-screen bg-[#1C1B21]">
      <NavBar />
      <div className="flex flex-col gap-3 flex-grow py-7 px-8 lg:px-36">
        <div className="flex flex-row gap-5">
          <div className="w-fit flex items-center gap-10 bg-gray-800 pl-5 rounded-2xl">
            <h1 className="text-white text-xl font-normal">Location</h1>
            <Dropdown label="Status" options={Object.keys(allStatus)} />
          </div>

          <div className="w-fit flex items-center gap-10 bg-gray-800 pl-5 rounded-2xl">
            <h1 className="text-white text-xl font-normal">Genre</h1>
            <Dropdown label="Genre" options={Object.keys(allGenres)} />
          </div>

          <div className="w-fit flex items-center gap-10 bg-gray-800 pl-5 rounded-2xl">
            <h1 className="text-white text-xl font-normal">Genre</h1>
            <Dropdown label="Country" options={Object.keys(allCountries)} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
