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
import SignUp from "../pages/user/SignUp";
import ForgotPassword from "../pages/user/ForgotPassword";

function createSlug(name) {
  return name
    .trim()
    .replace(/\s*:\s*/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NavBar({
  currentPage,
  openSignInFromParent = false,
  setOpenSignInFromParent,
}) {
  const jwt = localStorage.getItem("jwt");
  const [openNav, setOpenNav] = useState(false);
  const [login, setLogin] = useState(!!jwt);
  const [userInfo, setUserInfo] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // listen for sign in trigger
  useEffect(() => {
    if (openSignInFromParent) {
      setOpenSignIn(true);
    }
  }, [openSignInFromParent]);

  useEffect(() => {
    if (!openSignIn) {
      setOpenSignInFromParent && setOpenSignInFromParent(false);
    }
  }, [openSignIn]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("searchTerm", searchTerm);
    navigate(`/search/${encodeURIComponent(createSlug(searchTerm))}`);
    if (currentPage === "search") {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!jwt) {
      setIsLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/userInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jwt: jwt }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setIsLoading(false);
        if (responseData.success) {
          setLogin(true);
          setUserInfo(responseData.userInfo[0]);
        } else {
          // JWT is invalid
          localStorage.removeItem("jwt");
          setLogin(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-8">
      <Typography as="li" variant="h4" className="p-1 font-light ">
        <a
          href="/home"
          className={`flex items-center text-white hover:text-purple-100
              ${currentPage === "Home" ? "underline underline-offset-8" : ""}`}
        >
          Home
        </a>
      </Typography>
      <Typography as="li" variant="h4" className="p-1 font-light ">
        <a
          href="/movie/filter"
          className={`flex items-center text-white hover:text-purple-100
              ${
                currentPage === "Movies" ? "underline underline-offset-8" : ""
              }`}
        >
          Movies
        </a>
      </Typography>
      <Typography as="li" variant="h4" className="p-1 font-light ">
        <a
          href="/theater-movie"
          className={`flex items-center text-white hover:text-purple-100
              ${
                currentPage === "Buy Ticket"
                  ? "underline underline-offset-8"
                  : ""
              }`}
        >
          Buy Ticket
        </a>
      </Typography>
      <Typography as="li" variant="h4" className="p-1 font-light ">
        <a
          href="/theaters"
          className={`flex items-center text-white hover:text-purple-100
              ${
                currentPage === "Theaters" ? "underline underline-offset-8" : ""
              }`}
        >
          Theaters
        </a>
      </Typography>
      <Typography as="li" variant="h4" className="p-1 font-light ">
        <a
          href="/news"
          className={`flex items-center text-white hover:text-purple-100
              ${currentPage === "News" ? "underline underline-offset-8" : ""}`}
        >
          News
        </a>
      </Typography>
    </ul>
  );

  return (
    <>
      <Navbar className="max-w-full relative py-2 px-2 lg:px-36 lg:py-4 rounded-none border-none !bg-[#502A50]">
        <div className="mx-auto flex flex-wrap items-center justify-between text-white">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="flex flex-row">
              <img
                src="/ico.png"
                className="w-11 h-10 mr-1 lg:mr-3 self-center"
              />
              {/* <Typography
              as="a"
              href="/home"
              variant="lg:h3"
              className="mr-4 cursor-pointer py-1.5 font-medium"
            >
              Starlight Cinema
            </Typography> */}
              <a href="/home">
                <p className="text-xl lg:text-3xl mr-4 cursor-pointer py-1.5 font-medium self-center">
                  Starlight Cinema
                </p>
              </a>
            </div>
            {login && userInfo ? (
              <ProfileMenu data={userInfo} />
            ) : (
              <div>
                <Button
                  variant="outlined"
                  className="text-white text-md rounded-3xl mr-2 border-white border-[0.8]"
                  onClick={() => setOpenSignUp(!openSignUp)}
                >
                  Sign up
                </Button>
                <Button
                  variant="filled"
                  color="red"
                  className="text-white bg-[#B44242] text-md rounded-3xl"
                  onClick={() => setOpenSignIn(true)}
                >
                  Sign in
                </Button>
              </div>
            )}
          </div>
          <div className="hidden lg:flex lg:justify-between w-screen"></div>
          <hr className="mt-3 hidden w-full lg:block lg:invisible" />
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
          <div className="hidden items-center justify-between mb-2 w-full gap-x-2 lg:flex">
            {navList}
            <div className="relative flex w-[20%] gap-2 ">
              <form className="min-w-full" onSubmit={handleSubmit}>
                <Input
                  type="search"
                  placeholder="Search"
                  size="lg"
                  onChange={handleChange}
                  value={searchTerm}
                  autoComplete="off"
                  className="border-none !min-w-full after:border-none before:border-none !rounded-3xl !text-base pl-5 bg-white placeholder:text-black placeholder:text-base placeholder:opacity-100 focus:placeholder-opacity-0"
                />
              </form>
            </div>
          </div>
        </div>
        <Collapse open={openNav}>
          <div>
            {navList}
            <div className="flex gap-x-2 flex-row sm:mb-4">
              <div className="w-full gap-2 md:w-max">
                <form onSubmit={handleSubmit}>
                  <Input
                    type="search"
                    placeholder="Search"
                    className="border-none rounded-3xl text-lg pl-6 placeholder:text-black bg-white"
                    onChange={handleChange}
                    value={searchTerm}
                    onSubmit={handleSubmit}
                  />
                </form>
              </div>
              <Button
                color="deep-purple"
                className="text-white text-md rounded-3xl"
                onClick={handleSubmit}
              >
                Search
              </Button>
            </div>
            {isLoading ? null : login && userInfo ? (
              <ProfileMenu data={userInfo} />
            ) : (
              <div>
                <Button
                  variant="outlined"
                  className="text-white text-md rounded-3xl mr-2 border-white border-[0.8]"
                  onClick={() => setOpenSignUp(!openSignUp)}
                >
                  Sign up
                </Button>
                <Button
                  variant="filled"
                  color="red"
                  className="text-white bg-[#B44242] text-md rounded-3xl"
                  onClick={() => setOpenSignIn(true)}
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
          handleOpenSignUp={() => {
            setOpenSignIn(false);
            setOpenSignUp(true);
          }}
          handleOpenForgotPassword={() => {
            setOpenSignIn(false);
            setOpenForgotPassword(true);
          }}
        />
        {openSignUp && (
          <SignUp
            openDialog={openSignUp}
            handleOpenDialog={() => {
              setOpenSignUp(!openSignUp);
            }}
            handleOpenSignIn={() => {
              setOpenSignUp(false);
              setOpenSignIn(true);
            }}
          />
        )}

        {openForgotPassword && (
          <ForgotPassword
            openDialog={openForgotPassword}
            handleOpenDialog={() => {
              setOpenForgotPassword(false);
              setOpenSignIn(true);
            }}
          />
        )}
      </Navbar>
    </>
  );
}
