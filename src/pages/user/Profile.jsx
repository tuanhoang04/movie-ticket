import React, { useState,useEffect } from "react";


import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import TicketBookedSkeleton from "../../components/skeleton/TicketBookedSkeleton";
import PostSkeleton from "../../components/skeleton/PostCardSkeleton";
import MovieSkeleton from "../../components/skeleton/MovieSkeleton";
import PostCard from "../../components/post/PostCard";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
  


export default function Profile() {

    const [posts, setPosts] = useState([]);
    const [bookedTickets, setBookedTickets] = useState([]);
    const [likedMovies, setLikedMovies] = useState([]);
    const [isloading, setIsLoading] = useState(false);


    // useEffect(() => {
    //     fetch(`${import.meta.env.VITE_API_URL}/api/userInfo/filmNew`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ jwt: localStorage.getItem('jwt') })
    //     })
    //         .then(response => response.json())
    //         .then(responseData => {
    //             if (responseData) {
    //                 setPosts(responseData)
    //             }
    //             else {
    //                 console.error('Failed to fetch filmlike');
    //             }

    //         })
    //         .catch(error => console.error('Error:', error));
    // }, []);


    const tabStyles = {
        headerText:"text-white w-56",
        postAndTicketContainer:"grid place-items-center p-10 gap-10 h-fit",
        likedMoviesContainer:"grid grid-cols-4 p-10 gap-32 h-fit"
    };

    const tabData = [
    {
      label: "Your posts",
      value: "posts",
      datas: posts,
      skeleton: <PostSkeleton />,
      emptyText:"You have no posts yet.",
    },
    {
      label: "Booked tickets",
      value: "bookedTickets",
      datas: bookedTickets,
        skeleton: <TicketBookedSkeleton />,
      emptyText:"You have no booked tickets yet.",

    },
    {
      label: "Liked movies",
      value: "likedMovies",
      datas: likedMovies,
    skeleton: <MovieSkeleton />,
      emptyText:"You have no liked movies yet.",

    }
  ];
    

  return (
    <div className="bg-[#1C1B21] flex flex-col justify-center">
      <NavBar />
      <div className="grid place-items-center p-32">
        <div className="relative w-fit">
            
            <img src="profile-cover.webp" alt="cover" className=" w-full" />
            
            <img src="profile-avatar-sample.jpg" alt="profile" className="rounded-full border-4 border-white  h-[180px] w-[180px] absolute bottom-[-75px] left-[100px]" />
            <p className="text-2xl text-white absolute left-[300px] bottom-[-40px]">User name</p>
        </div>
            <Tabs value="profile" className="w-full mt-32 bg-white bg-opacity-10 rounded-3xl ">
                <TabsHeader className=" text-white h-[66px] bg-transparent flex justify-start" indicatorProps={{ className: "bg-transparent shadow-none border-b-2 rounded-none" }}>
                    {tabData.map(({label,value}) => (
                        <Tab key={value} value={value} className={tabStyles.headerText}>{label}</Tab> 
                    ))}
                </TabsHeader>
                <TabsBody className=" text-white bg-transparent ">
                    {tabData.map(({ value, skeleton,datas, emptyText }) => (
                        <TabPanel key={value} value={value} className={tabStyles.skeleton}>
                            {isloading ? (
                                <div className={value == "likedMovies"  ?  tabStyles.likedMoviesContainer : tabStyles.postAndTicketContainer}>  
                                    {skeleton}
                                    {skeleton}
                                    {skeleton}
                                    {skeleton}
                                </div>
                            ) : (datas.length > 0 ? datas.map((data) => {
                                return (
                                 <PostCard data={data}/> 
                                );
                            }): <div className="text-white p-3">{emptyText}</div>)}
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
      </div>
      <Footer />
    </div>
  );
}
