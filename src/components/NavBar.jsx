import { useState, useEffect } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import SignIn from "../pages/user/SignIn";

export default function NavBar() {
  const [openNav, setOpenNav] = useState(false);
  const [login, setLogin] = useState(true);
  const [userInfo, setUserInfo] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
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
        console.log(responseData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-8">
      <Typography as="li" variant="h4" className="p-1 font-extralight ">
        <a
          href="/home"
          className="flex items-center text-white underline underline-offset-8 hover:text-purple-100"
        >
          Home
        </a>
      </Typography>
      <Typography as="li" variant="h4" className="p-1 font-extralight ">
        <a
          href="#"
          className="flex items-center text-white hover:text-purple-100"
        >
          Buy Tickets
        </a>
      </Typography>
      <Typography as="li" variant="h4" className="p-1 font-extralight ">
        <a
          href="#"
          className="flex items-center text-white hover:text-purple-100"
        >
          Theaters
        </a>
      </Typography>
      <Typography as="li" variant="h4" className="p-1 font-extralight ">
        <a
          href="#"
          className="flex items-center text-white hover:text-purple-100"
        >
          News
        </a>
      </Typography>
    </ul>
  );

  return (
    <>
      <Navbar className="max-w-full relative py-2 px-8 lg:px-36 lg:py-4 rounded-none border-none bg-[#502A50]">
        <div className="mx-auto flex flex-wrap items-center justify-between text-white">
          <div className="flex flex-row justify-center items-center">
            <img src="/ico.png" className="w-10 mr-3" />
            <Typography
              as="a"
              href="/home"
              variant="h3"
              className="mr-4 cursor-pointer py-1.5 font-medium"
            >
              Starlight Cinema
            </Typography>
          </div>
          <div className="hidden items-center gap-x-2 lg:flex">
            <div className="relative flex w-full gap-2 md:w-max ">
              <Input
                type="search"
                placeholder="Search"
                size="lg"
                className="border-none after:border-none before:border-none !rounded-3xl !text-base pl-5 bg-white placeholder:text-black placeholder:text-base placeholder:opacity-100 focus:placeholder-opacity-0"
              />
            </div>
          </div>

          <hr className="mt-5 hidden w-full lg:block lg:invisible" />

          <IconButton
            variant="text"
            className="lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" stroke="white" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" stroke="white" strokeWidth={2} />
            )}
          </IconButton>
          <div className="hidden lg:flex lg:justify-between w-screen">
            {navList}
            {login ? (
              <ProfileMenu fullname={userInfo.full_name} />
            ) : (
              <div>
                <Button
                  variant="outlined"
                  className="text-white text-md rounded-3xl mr-4 border-white border-[0.8]"
                  onClick={() => (window.location = "/sign-up")}
                >
                  Sign up
                </Button>
                <Button
                  variant="gradient"
                  color="red"
                  className="text-white text-md rounded-3xl"
                  onClick={() => setOpenSignIn(true)}
                >
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </div>
        <Collapse open={openNav}>
          <div>
            {navList}
            <div className="flex gap-x-2 flex-row sm: mb-4">
              <div className="w-full gap-2 md:w-max">
                <Input
                  type="search"
                  placeholder="Search"
                  className="border-none rounded-3xl text-lg pl-6 placeholder:text-black bg-white"
                />
              </div>
              <Button
                color="deep-purple"
                className="text-white text-md rounded-3xl"
              >
                Search
              </Button>
            </div>
            {login ? (
              <ProfileMenu fullname={userInfo.full_name} />
            ) : (
              <div>
                <Button
                  variant="outlined"
                  className="text-white text-md rounded-3xl mr-4 border-white border-[0.8] mb-4"
                >
                  Sign up
                </Button>
                <Button
                  variant="gradient"
                  color="red"
                  className="text-white text-md rounded-3xl mb-4"
                >
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </Collapse>
        <SignIn
          openDialog={openSignIn}
          handleOpenDialog={() => {
            setOpenSignIn(!openSignIn);
          }}
        />
      </Navbar>
    </>
  );
}
