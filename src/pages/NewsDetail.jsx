import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useEffect, useState, useNavigate } from "react";

function createSlug(name) {
  return name.trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function NewsDetail() {
  const navigate = useNavigate();
  const new_id = localStorage.getItem("new_id");
  const [dataDetail, setDataDetail] = useState();
  const [dataRelate, setDataRelate] = useState();
  const fetchNewDetail = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/new/new_id=${new_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setDataDetail(result);
        console.log(result);
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };
  useEffect(() => {
    fetchNewDetail();
  }, []);

  const fetchNewRelate = async (film_id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/new/film_id=${film_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setDataRelate(result);
        console.log(result);
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };

  useEffect(() => {
    if (dataDetail && dataDetail.length > 0 && dataDetail[0].film_id) {
      fetchNewRelate(dataDetail[0].film_id);
    }
  }, [dataDetail]);
  const ClickNew = (new_id, new_header) => {
    localStorage.setItem("new_id", new_id);
    navigate(`/tin_tuc/${encodeURIComponent(createSlug(new_header))}`);
    window.location.reload();
  };

  return (
    <div className="bg-[#1C1B21] min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
}
