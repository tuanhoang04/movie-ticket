import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Dropdown from "../components/Dropdown";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import { useState, useEffect } from "react";

const theaterImgStyle = "rounded-full w-[40px] h-[40px]";

export default function TheatersPage() {
  const [areas, setAreas] = useState([]);
  const [currentAreaName, setCurrentAreaName] = useState(
    localStorage.getItem("currentAreaName") || ""
  );
  const [currentAreaId, setCurrentAreaId] = useState(
    localStorage.getItem("currentAreaId") || -1
  );
  const [theaters, setTheaters] = useState([]);
  const [currentCinema, setCurrentCinema] = useState(null);

  const handleOptionClick = (option) => {
    localStorage.setItem("currentAreaId", option.region_id);
    localStorage.setItem("currentAreaName", option.region_name);
    setCurrentAreaName(option.region_name);
    setCurrentAreaId(option.region_id);
  };

  const getTheaterLogo = (cluster_name) => {
    switch (cluster_name) {
      case "Beta Cinemas":
        return "/beta.png";
      case "CGV Cinemas":
        return "/cgv.jpg";
      case "Lotte Cinemas":
        return "/lotte.png";
      case "Cinestar":
        return "/cinestar.png";
      case "Mega GS Cinemas":
        return "/megags.png";
      case "Dcine":
        return "/dcine.png";
      case "Starlight":
        return "/starlight.png";
      case "Rio Cinemas":
        return "/riocinema.png";
      case "Touch Cinema":
        return "/touchcinema.webp";

      default:
        return "/ico.png";
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/rap/region_id=${currentAreaId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setTheaters(result);
        } else {
          console.error("Lỗi khi truy cập:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi mạng:", error);
      }
    };
    console.log(`Current Area ID: ${currentAreaId}`);

    if (setCurrentAreaId !== -1) {
      fetchData();
    }
  }, [currentAreaId]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lichChieu/khuVuc`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();
        if (result) {
          setAreas(result);
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

  const fetchCinemaTime = async (info) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rap/cinema_id=${info.cinema_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const result = await response.json();

        setCurrentCinema({
          info: info,
          time: result,
        });
        console.log(currentCinema);
        console.log(Object.keys(currentCinema.time)[0]);
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };

  return (
    <div className="bg-[#1C1B21] h-fit">
      <NavBar currentPage={"Theaters"}/>
      <div id="body" className="">
        <div className="m-auto w-fit mt-10 flex items-center bg-gray-800 rounded-lg">
          <p className="text-white text-xl p-2 pr-4 border-r-2">Location</p>

          <Dropdown
            label="Select a location"
            options={areas}
            handleChangeOption={handleOptionClick}
          />
        </div>
        {currentAreaName && (
          <div className=" m-20 flex  text-white h-fit min-h-[400px] ">
            <div className="w-1/5 h-full bg-white bg-opacity-10 rounded-lg ">
              <p className=" p-2 text-3xl">Theaters in {currentAreaName}</p>
              {theaters.length > 0 && (
                <div className="flex flex-col mt-4 h-fit max-h-[800px] overflow-y-scroll scrollbar ">
                  {theaters.map((item) => (
                    <div
                      onClick={() => {
                        fetchCinemaTime(item);
                      }}
                      key={item.cinema_id}
                      style={
                        item.cinema_id === currentCinema?.info.cinema_id
                          ? { backgroundColor: "#502A50" }
                          : {}
                      }
                      className="flex items-center gap-2 p-4 cursor-pointer hover:bg-[#502A50] bg-white bg-opacity-10 m-2 rounded-lg"
                    >
                      <img
                        src={getTheaterLogo(item.cluster_name)}
                        alt="logo"
                        className={theaterImgStyle}
                      ></img>
                      <div>
                        <div style={{ fontSize: "18px", fontWeight: "800" }}>
                          {item.cinema_name}
                        </div>
                        <div className="overflow-hidden line-clamp-2">
                          {item.address}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {currentCinema && (
              <div className=" w-4/5 ml-10">
                <div className="rounded-xl p-5 bg-white bg-opacity-10">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex  items-center gap-3 ">
                      <img
                        src={getTheaterLogo(currentCinema.info.cluster_name)}
                        alt="logo"
                        className={theaterImgStyle}
                        style={{
                          gridRow: "span 2",
                          gridColumn: "span 1",
                        }}
                      ></img>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {currentCinema.info.cinema_name}
                        </p>
                        <p className="text-lg text-white">
                          {currentCinema.info.address}
                        </p>
                      </div>
                    </div>
                    <a
                      href={
                        "https://www.google.com/maps/search/" +
                        currentCinema.info.cinema_name.replace(/ /g, "+")
                      }
                      className="underline"
                    >
                      <div className="flex items-center gap-2 text-2xl">
                        Find in map
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          class="bi bi-box-arrow-up-right"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
                          />
                        </svg>
                      </div>
                    </a>
                  </div>
                  <p className="text-lg text-white mt-5">
                    Xem Lịch chiếu và Mua vé tại{" "}
                    {currentCinema.info.cinema_name} - rạp{" "}
                    {currentCinema.info.cluster_name} toàn quốc dễ dàng - nhanh
                    chóng tại NHTT. Rạp {currentCinema.info.cinema_name} được
                    xây dựng với tiêu chuẩn rạp Hollywood, chuẩn âm thanh Dolby
                    7.1, màn hình lớn, sắc nét. {currentCinema.info.cinema_name}{" "}
                    là rạp chiếu phim thuộc hệ thống{" "}
                    {currentCinema.info.cluster_name} - 1 chuỗi rạp chiếu phim
                    thuộc sở hữu nội địa. Dù là rạp nội địa nhưng{" "}
                    {currentCinema.info.cinema_name} cam kết dịch vụ chuyên
                    nghiệp - trải nghiệm điện ảnh quốc tế và giá vé hạt dẻ.
                  </p>
                </div>
                <Tabs
                  className="mt-5 rounded-2xl bg-white bg-opacity-10 "
                  value={Object.keys(currentCinema.time)[0]}
                >
                  <TabsHeader
                    className="bg-transparent h-[66px] gap-10 flex justify-start border-b-2 rounded-none p-2 pl-10"
                    indicatorProps={{
                      className: "bg-[#502A50]   rounded-xl",
                    }}
                  >
                    {Object.keys(currentCinema.time).map((value, index) => {
                      return (
                        <Tab
                          key={index}
                          value={index}
                          className="text-white text-nowrap"
                        >
                          {value}
                        </Tab>
                      );
                    })}
                  </TabsHeader>
                  <TabsBody
                    className="p-2"
                    animate={{
                      initial: { y: 0 },
                      mount: { y: 0 },
                      unmount: { y: 0 },
                    }}
                  >
                    {Object.values(currentCinema.time).map((value, index) => {
                      return (
                        <TabPanel
                          className="text-white grid place-content-center"
                          key={index}
                          value={index}
                        >
                          {typeof value !== "object" ? (
                            <p>{value}</p>
                          ) : (
                            <div className="grid grid-cols-3 gap-5">
                              {value.map((item) => (
                                <div
                                  key={item.show_time}
                                  className="flex flex-col gap-2"
                                >
                                  <h1 className="text-sm opacity-50">
                                    {item.show_time}
                                  </h1>
                                  <p className="text-md">{item.film_name}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </TabPanel>
                      );
                    })}
                  </TabsBody>
                </Tabs>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
