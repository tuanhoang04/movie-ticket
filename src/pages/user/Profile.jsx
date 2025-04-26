import React, { useState, useEffect } from "react";
import axios from "axios";

import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import TicketBookedSkeleton from "../../components/skeleton/TicketBookedSkeleton";
import PostSkeleton from "../../components/skeleton/PostCardSkeleton";
import MovieSkeleton from "../../components/skeleton/MovieSkeleton";
import ProfilePostCard from "../../components/post/ProfilePostCard";
import TicketCard from "../../components/ticket/TicketCard";
import MovieCard from "../../components/movie/MovieCard";
import CreateNewPost from "../../components/post/CreateNewPost";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import AlertWithIcon from "../../components/Alert";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Input,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Radio,
  Tooltip,
} from "@material-tailwind/react";

export default function Profile() {
  const jwt = localStorage.getItem("jwt");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [userInfor, setUserInfor] = useState({});
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [createPostVisible, setCreatePostVisible] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [formUserData, setFormUserData] = useState({});
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [okMessage, setOkMessage] = useState("");

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
          navigate("/");
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    setIsLoading(true);
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
          setBookedTickets(responseData);
        } else {
          console.error("Failed to fetch booked tickets");
        }
      })
      .catch((error) => console.error("Error:", error));
    setIsLoading(true);
  }, []);

  useEffect(() => {
    setIsLoading(true);
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
          setUserInfor(responseData.userInfo[0]);
        }
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    console.log("User information:", userInfor);

    if (userInfor) {
      setFormUserData({
        name: userInfor.full_name,
        phone__number: userInfor.phone_number,
        gmail: userInfor.email,
        sex: userInfor.sex,
        jwt: jwt,
      });
      console.log("Form user data:", formUserData);
    } else {
      console.log("User information is not available yet.");
    }
  }, [userInfor]);

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
    headerText:
      "text-white text-md lg:text-lg w-fit p-2 lg:p-5 hover:outline outline-1 outline-gray-400 rounded-full",
    postAndTicketContainer:
      "grid place-items-center p-4 lg:p-10 gap-5 lg:gap-10 h-fit",
    likedMoviesContainer:
      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 p-4 md:p-6 lg:p-10 2xl:p-20 gap-4 md:gap-6 lg:gap-10 xl:gap-15 2xl:gap-20 h-fit",
  };

  const tabData = [
    {
      label: "Your posts",
      value: "posts",
      datas: posts,
      skeleton: <PostSkeleton />,
      component: (index, data) => <ProfilePostCard key={index} data={data} />,
      emptyText: "You have no posts yet.",
      onclick: () => {},
    },
    {
      label: "Booked tickets",
      value: "bookedTickets",
      datas: bookedTickets,
      skeleton: <TicketBookedSkeleton />,
      component: (index, data) => <TicketCard key={index} data={data} />,
      emptyText: "You have no booked tickets yet.",
      onclick: () => {},
    },
    {
      label: "Liked movies",
      value: "likedMovies",
      datas: likedMovies,
      skeleton: <MovieSkeleton />,
      component: (index, data) => <MovieCard key={index} data={data} />,
      emptyText: "You have no liked movies yet.",
      onclick: () => {},
    },
  ];

  function handleCreatePost() {
    setCreatePostVisible(!createPostVisible);
  }
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const previewURL = URL.createObjectURL(selectedFile);
    setPreview(previewURL);
  };

  const submit = async () => {
    if (file) {
      await handleUpdateWithImage(new Event("submit"));
    }

    await handleUpdateInfoSubmit(new Event("submit"));
  };
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  useEffect(() => {
    if (okMessage) {
      const timerr = setTimeout(() => {
        setOkMessage("");
        window.location.reload();
      }, 2000);

      return () => clearTimeout(timerr);
    }
  }, [okMessage]);
  const handleUpdateInfoSubmit = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/userInfo/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formUserData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          setErrorMessage("");
          setUploadStatus("");
          setOkMessage("Successfully updated information!");
        } else {
          const error__alert = `Failed to update: ${data.message}`;
          setErrorMessage(error__alert);
        }
      } else {
        console.error("Error when change information:", response.statusText);

        setErrorMessage("Error: " + response.statusText);
        console.log("FormUserData", formUserData);
      }
    } catch (error) {
      setErrorMessage("Internet error:", error);
      console.error("Internet error:", error);
    }
  };
  const handleUpdateWithImage = async () => {
    if (!file) {
      alert("Please select an image file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    formData.append("jwt", jwt);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/uploadImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUploadStatus("Upload successful!");
        console.log("URL ảnh:", response.data.message.url);
      } else {
        setUploadStatus("Upload failed!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed!");
    }
    console.log(uploadStatus);
  };
  return (
    <div className="bg-[#1C1B21] flex flex-col justify-center text-white">
      <NavBar />
      {viewProfile ? (
        <Dialog
          open={viewProfile}
          size="sm"
          className="xl:px-6 xl:py-4 px-3 py-2 my-4 bg-[#4B4A52] mx-auto min-w-[85%] md:min-w-[30%] gap-8 rounded-lg shadow-lg transition-all duration-300"
        >
          <DialogHeader className="p-0 bg-[#4B4A52] relative h-20 px-5 flex flex-row-reverse">
            <div className="w-full h-1 absolute top-0 left-0 bg-gradient-to-r from-[#f99d63] to-[#ca6fff]"></div>
            <div className="rounded-full w-24 h-24 absolute left-0 right-0 top-10 mx-auto overflow-hidden">
              <img
                src={
                  preview ||
                  (userInfor.user_img
                    ? userInfor.user_img
                    : import.meta.env.VITE_DEFAULT_AVATAR)
                }
                alt=""
                className="absolute w-full h-full object-cover"
              />
              <div
                className="absolute top-0 left-0 right-0 bottom-0 rounded-full grid place-content-center opacity-0 hover:opacity-100 bg-gray-800 bg-opacity-50 cursor-pointer"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="white"
                  className="bi bi-pencil-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                </svg>
              </div>
            </div>
            <Button
              className="rounded-full w-10 h-10 grid place-content-center p-0 m-0 hover:bg-gray-600 bg-gray-500"
              onClick={() => setViewProfile(!viewProfile)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </Button>
          </DialogHeader>

          <DialogBody className="mt-10 mb-1">
            <form className="flex flex-col w-full gap-6">
              <input
                type="file"
                name="user__img"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <div>
                <Typography
                  variant="h5"
                  color="white"
                  className="mb-2 font-light text-xl text-white"
                >
                  Name
                </Typography>
                <Input
                  size="lg"
                  value={formUserData.name}
                  name="name"
                  onChange={handleFormChange}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div>
                <Typography
                  variant="h5"
                  color="white"
                  className="mb-2 font-light text-xl text-white"
                >
                  Email
                </Typography>
                <Input
                  type="text"
                  size="lg"
                  value={formUserData.gmail}
                  name="gmail"
                  onChange={handleFormChange}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div>
                <Typography
                  variant="h5"
                  color="white"
                  className="mb-2 font-light text-xl text-white"
                >
                  Phone number
                </Typography>
                <Input
                  size="lg"
                  value={formUserData.phone__number}
                  name="phone__number"
                  onChange={handleFormChange}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              <div className="flex lg:gap-3 lg:flex-row flex-col lg:items-center">
                <Typography
                  variant="h5"
                  color="white"
                  className="font-light text-xl text-white"
                >
                  Gender
                </Typography>
                <Radio
                  name="sex"
                  label="Male"
                  onChange={handleFormChange}
                  value="1"
                  checked={formUserData.sex == 1}
                  className="checked:bg-white checked:border-white"
                  labelProps={{ className: "text-lg text-white" }}
                />
                <Radio
                  name="sex"
                  label="Female"
                  onChange={handleFormChange}
                  value="0"
                  checked={formUserData.sex == 0}
                  className="checked:bg-white checked:border-white"
                  labelProps={{ className: "text-lg text-white" }}
                />
              </div>
              <div>
                {uploadStatus && (
                  <AlertWithIcon
                    type="positive"
                    message={uploadStatus}
                    className="animate-fade-in"
                  />
                )}
                {errorMessage && (
                  <AlertWithIcon
                    type="negative"
                    message={errorMessage}
                    className="animate-fade-in"
                  />
                )}
                {okMessage && (
                  <AlertWithIcon
                    type="positive"
                    message={okMessage}
                    className="animate-fade-in"
                  />
                )}
              </div>
              <div className="flex justify-center">
                <Button
                  className="w-full py-2.5 focus:ring-2 focus:ring-[#D8B4FE] focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
                  onClick={submit}
                  style={{
                    background:
                      "linear-gradient(90deg, #f99d63 0%, #f373c6 50%, #ca6fff 100%)",
                  }}
                >
                  Update
                </Button>
              </div>
            </form>
          </DialogBody>
        </Dialog>
      ) : (
        ""
      )}
      <div className="grid place-items-center px-4 md:px-10 lg:px-36 lg:pt-10 ">
        <div className="relative w-full">
          <img src="profile-cover.webp" alt="cover" className=" w-full " />
          <img
            src={
              userInfor.user_img
                ? userInfor.user_img
                : import.meta.env.VITE_DEFAULT_AVATAR
            }
            alt="profile"
            className="rounded-full border-4 border-white h-20 w-20 md:h-32 md:w-32  lg:h-[240px] lg:w-[240px] absolute bottom-[-40px] left-[20px] md:bottom-[-60px] md:left-[30px] lg:bottom-[-75px] lg:left-[100px]"
          />
          <div className=" flex items-center gap-4 md:text-xl lg:text-2xl text-white absolute left-[110px] md:left-[180px] md:bottom-[-43px] lg:left-[350px] lg:bottom-[-40px] font-bold">
            <p>{userInfor.full_name}</p>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-pencil-square hover:cursor-pointer"
              viewBox="0 0 16 16"
              onClick={() => {
                setViewProfile(!viewProfile);
              }}
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fillRule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </svg>
          </div>
        </div>
        {createPostVisible ? (
          <div className="w-full mt-14 md:mt-20 lg:mt-32 bg-white bg-opacity-10 rounded-3xl ">
            <CreateNewPost />
          </div>
        ) : (
          ""
        )}

        <Tabs
          value="posts"
          className="w-full mt-32 bg-white bg-opacity-10 rounded-3xl "
        >
          <TabsHeader
            className=" text-white h-[66px] bg-transparent gap-3 lg:gap-10 flex justify-start border-b-2 rounded-none p-2 lg:pl-10"
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
            {tabData.map(
              ({ value, skeleton, datas, emptyText, component, onclick }) => (
                <TabPanel key={value} value={value} className="p-0">
                  {value == "posts" ? (
                    <div className="w-full">
                      <Button
                        onClick={handleCreatePost}
                        className="flex gap-2 m-2 mt-5 lg:m-10 mb-0 p-5 text-sm bg-[#502A50]  text-white rounded-full hover:bg-[#602A50]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="white"
                          className="bi bi-plus-lg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                          />
                        </svg>
                        New Post
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
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
                      <div
                        className={
                          value === "likedMovies"
                            ? tabStyles.likedMoviesContainer
                            : tabStyles.postAndTicketContainer
                        }
                        onClick={onclick}
                      >
                        {datas.map((data, index) => component(index, data))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-white p-10 text-xl">{emptyText}</div>
                  )}
                </TabPanel>
              )
            )}
          </TabsBody>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
