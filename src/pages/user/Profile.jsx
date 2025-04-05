import React, { useState, useEffect } from "react";

import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import TicketBookedSkeleton from "../../components/skeleton/TicketBookedSkeleton";
import PostSkeleton from "../../components/skeleton/PostSkeleton";
import MovieSkeleton from "../../components/skeleton/MovieSkeleton";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [ticketBookeds, setTicketBookeds] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const jwt = localStorage.getItem("jwt");
  const [login, setLogin] = useState("");
  const [userInfo, setUserInfo] = useState([]);


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/userInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt: jwt }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.success) {
          setLogin(true);
          setUserInfo(responseData.userInfo[0]);
        } else {
          setLogin(false);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="bg-[#1C1B21] flex flex-col justify-center">
      <NavBar />
      <div className="grid place-items-center p-20">
        <div className="relative w-fit">
          <img src="profile-cover.webp" alt="cover" className=" w-full" />

          <img
            src="profile-avatar-sample.jpg"
            alt="profile"
            className="rounded-full border-4 border-white  h-[180px] w-[180px] absolute bottom-[-75px] left-[100px]"
          />
          <p className="text-2xl text-white absolute left-[300px] bottom-[-40px]">
            {userInfo?.full_name}
          </p>
        </div>
        <Tabs
          value="profile"
          className="w-full mt-32 bg-white bg-opacity-10 rounded-3xl "
        >
          <TabsHeader
            className=" text-white h-[66px] bg-transparent flex justify-start"
            indicatorProps={{
              className: "bg-transparent shadow-none border-b-2 rounded-none",
            }}
          >
            <Tab value="posts" className="text-white w-56">
              Your post
            </Tab>
            <Tab value="ticketBookeds" className="text-white w-56">
              Ticket booked
            </Tab>
            <Tab value="likedMovies" className="text-white w-56">
              Liked movies
            </Tab>
          </TabsHeader>
          <TabsBody className=" text-white bg-transparent ">
            <TabPanel value="posts">
              {posts.length === 0 ? (
                <div className="grid place-items-center p-10 gap-10 h-fit">
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </div>
              ) : (
                <div className="grid place-items-center p-10 gap-10 h-fit">
                  {posts.map((item) => {
                    return <div key={item.id}>{item}</div>;
                  })}
                </div>
              )}
            </TabPanel>
            <TabPanel value="ticketBookeds">
              {ticketBookeds.length === 0 ? (
                <div className="grid place-items-center p-10 gap-10 h-fit">
                  <TicketBookedSkeleton />
                  <TicketBookedSkeleton />
                  <TicketBookedSkeleton />
                </div>
              ) : (
                <div className="grid place-items-center p-10 gap-10 h-fit">
                  {ticketBookeds.map((item) => {
                    return <div key={item.id}>{item}</div>;
                  })}
                </div>
              )}
            </TabPanel>
            <TabPanel value="likedMovies">
              {likedMovies.length === 0 ? (
                <div className="grid grid-cols-4 p-10 gap-28 h-fit">
                  <MovieSkeleton />
                  <MovieSkeleton />
                  <MovieSkeleton />
                  <MovieSkeleton />
                </div>
              ) : (
                <div className="grid place-items-center p-10 gap-10 h-fit">
                  {likedMovies.map((item) => {
                    return <div key={item.id}>{item}</div>;
                  })}
                </div>
              )}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
