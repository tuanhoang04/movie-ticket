import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Dropdown from "../components/Dropdown";
import { Button } from "@material-tailwind/react";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const theaterImgStyle = "rounded-full w-[40px] h-[40px]";

export default function TheatersPage() {
  const navigate = useNavigate();
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
      } else {
        console.error("Lỗi khi truy cập:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };

  return (
    <div className="bg-[#1C1B21] h-fit">
      <NavBar currentPage={"Theaters"} />
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
          <div className=" mx-[144px] mt-20 flex  text-white h-fit min-h-[400px] ">
            <div className="w-1/5 h-full bg-white bg-opacity-10 rounded-lg ">
              <p className=" p-4 pb-0 text-3xl">
                Theaters in {currentAreaName}
              </p>
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
                          className="text-white "
                          key={index}
                          value={index}
                        >
                          {typeof value !== "object" ? (
                            <span className="grid place-content-center">
                              {value}
                            </span>
                          ) : (
                            <div className=" flex flex-col gap-5">
                              {Object.keys(value).map((key) => {
                                console.log(value[key]);

                                return (
                                  <div className="flex gap-10 justify-between border-b-2 border-white border-opacity-30 py-5 mx-5 h-72">
                                    <div className="flex gap-5">
                                      <img
                                        className="rounded-xl "
                                        src={value[key].film_img}
                                        alt=""
                                      />
                                      <div className="p-2 flex flex-col gap-2">
                                        <p className="text-2xl font-bold line-clamp-1">
                                          {value[key].film_name}
                                        </p>
                                        <div className="text-xl flex gap-2 text-gray-400 line-clamp-1">
                                          {value[key].film_categories
                                            ? value[key].film_categories
                                                .map((item) => {
                                                  return item.category_name;
                                                })
                                                .join(", ")
                                            : "genres"}
                                        </div>
                                        <p className="text-xl mt-10 line-clamp-3 w-[700px]">
                                          {value[key].film_describe ||
                                            "Description"}
                                        </p>
                                      </div>
                                    </div>

                                    <div className=" flex flex-col justify-between text-xl w-[220px] p-3 py-5 ">
                                      <div className="flex flex-col gap-5">
                                        <div className="flex justify-between">
                                          <span>Rating</span>
                                          <div className="flex items-center gap-2">
                                            {value[key].rating || 5}
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              fill="currentColor"
                                              class="bi bi-star-fill"
                                              viewBox="0 0 16 16"
                                            >
                                              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Age</span>
                                          <span>R-{value[key].age_limit}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Duration</span>
                                          <span>{value[key].duration}m</span>
                                        </div>
                                      </div>
                                      <Button
                                        color="red"
                                        className="bg-[#B44242] rounded-xl flex flex-row p-2 px-3 items-center w-[70%] m-auto mb-0"
                                        onClick={() => {
                                          localStorage.setItem(
                                            "film_id",
                                            value[key].film_id
                                          );
                                          navigate(
                                            "/movie/buyTicket/" +
                                              value[key].film_name
                                          );
                                        }}
                                      >
                                        <img
                                          src="/icons/ticket.png"
                                          className="w-7 mr-2"
                                        />
                                        <p className="text-sm font-bold">
                                          Buy Ticket
                                        </p>
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
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
