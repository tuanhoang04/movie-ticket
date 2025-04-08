import React, { useState, useEffect } from "react";

import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import TicketBookedSkeleton from "../../components/skeleton/TicketBookedSkeleton";
import PostSkeleton from "../../components/skeleton/PostCardSkeleton";
import MovieSkeleton from "../../components/skeleton/MovieSkeleton";
import ProfilePostCard from "../../components/post/ProfilePostCard";
import TicketCard from "../../components/ticket/TicketCard";
import MovieCard from "../../components/movie/MovieCard";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
} from "@material-tailwind/react";

export default function Profile() {
  const [userInfor, setUserInfor] = useState([]);
  const [posts, setPosts] = useState([]);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/userInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (!responseData.success) {
          navigate("/auth");
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData) {
          console.log(responseData);

          setBookedTickets(responseData);
        } else {
          console.error("Failed to fetch booked tickets");
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/userInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success) {
          // setLogin(true);
          setUserInfor(responseData.userInfo[0]);
        } else {
          // setLogin(false);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/userInfo/filmNew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData) {
          setPosts(responseData);
        } else {
          console.error("Failed to fetch posts");
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/userInfo/filmLiked`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData) {
          setLikedMovies(responseData);
        } else {
          console.error("Failed to fetch filmlike");
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const tabStyles = {
    headerText: "text-white w-32",
    postAndTicketContainer: "grid place-items-center p-10 gap-20 h-fit",
    likedMoviesContainer:
      "grid grid-cols-3 lg:grid-cols-5 p-20 md:gap-20 lg:gap-20 h-fit",
  };

  const tabData = [
    {
      label: "Your posts",
      value: "posts",
      datas: posts,
      skeleton: <PostSkeleton />,
      component: (index, data) => <ProfilePostCard key={index} data={data} />,
      emptyText: "You have no posts yet.",
    },
    {
      label: "Booked tickets",
      value: "bookedTickets",
      datas: bookedTickets,
      skeleton: <TicketBookedSkeleton />,
      component: (index, data) => <TicketCard key={index} data={data} />,
      emptyText: "You have no booked tickets yet.",
    },
    {
      label: "Liked movies",
      value: "likedMovies",
      datas: likedMovies,
      skeleton: <MovieSkeleton />,
      component: (index, data) => <MovieCard key={index} data={data} />,
      emptyText: "You have no liked movies yet.",
    },
  ];

  return (
    <div className="bg-[#1C1B21] flex flex-col justify-center ">
      <NavBar />
      <div className="grid place-items-center lg:px-24 lg:pt-10">
        <div className="relative w-full">
          <img src="profile-cover.webp" alt="cover" className=" w-full " />
          <img
            src={
              userInfor.user_img
                ? userInfor.user_img
                : import.meta.env.VITE_DEFAULT_AVATAR
            }
            alt="profile"
            className="rounded-full border-4 border-white h-20 w-20 md:h-32 md:w-32  lg:h-[180px] lg:w-[180px] absolute bottom-[-40px] left-[30px] md:bottom-[-60px] md:left-[30px] lg:bottom-[-75px] lg:left-[100px]"
          />
          <p className=" md:text-xl lg:text-2xl text-white absolute left-[120px] md:left-[180px] md:bottom-[-43px] lg:left-[300px] lg:bottom-[-40px]">
            {userInfor.full_name}
          </p>
        </div>

        <Tabs
          value="posts"
          className="w-full mt-32 bg-white bg-opacity-10 rounded-3xl "
        >
          <TabsHeader
            className=" text-white h-[66px] bg-transparent gap-20 flex justify-start border-b-2 rounded-none p-2 pl-10"
            indicatorProps={{
              className: "bg-transparent border-2 rounded-full",
            }}
          >
            {tabData.map(({ label, value }) => (
              <Tab key={value} value={value} className={tabStyles.headerText}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody
            animate={{
              initial: { x: 0 },
              mount: { x: 0 },
              unmount: { x: 0 },
            }}
          >
            {tabData.map(({ value, skeleton, datas, emptyText, component }) => (
              <TabPanel key={value} value={value} className="p-0">
                {isloading ? (
                  <div
                    className={
                      value === "likedMovies"
                        ? tabStyles.likedMoviesContainer
                        : tabStyles.postAndTicketContainer
                    }
                  >
                    {skeleton}
                    {skeleton}
                    {skeleton}
                    {skeleton}
                  </div>
                ) : datas.length > 0 ? (
                  <div>
                    {value == "posts" ? (
                      <Button className="flex gap-2 m-10 mb-0 p-3 border-2 text-sm bg-white text-black rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="black"
                          class="bi bi-plus-lg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                          />
                        </svg>
                        New Post
                      </Button>
                    ) : (
                      ""
                    )}
                    <div
                      className={
                        value === "likedMovies"
                          ? tabStyles.likedMoviesContainer
                          : tabStyles.postAndTicketContainer
                      }
                    >
                      {datas.map((data, index) => component(index, data))}
                    </div>
                  </div>
                ) : (
                  <div className="text-white p-3">{emptyText}</div>
                )}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
