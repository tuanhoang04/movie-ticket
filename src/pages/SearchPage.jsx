import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function SearchPage() {
  const [data, setData] = useState(null);
  const searchTerm = localStorage.getItem("searchTerm");
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
      const data = await response.json();
      console.log(data);
      setData(data); // Cập nhật state với dữ liệu
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-[#1C1B21] min-h-screen flex flex-col">
      <NavBar currentPage="Home" key="Home" />
      <div className="flex-grow">
        
      </div>
      <Footer />
    </div>
  );
}
