import { useState, useEffect } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import SignIn from "../pages/user/SignIn";
import SignUp from "../pages/user/SignUp";
import ForgottenPassword from "../pages/user/ForgotPassword";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

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
    if (currentPage === "search") {
      window.location.reload();
    } else {
      navigate(`/search/${encodeURIComponent(createSlug(searchTerm))}`);
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
          localStorage.setItem("full_name", responseData.userInfo[0].full_name);
          setUserInfo(responseData.userInfo[0]);
        } else {
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
    <ul className="mb-4 mt-2 flex flex-col gap-4 xl:mb-0 xl:mt-0 xl:flex-row xl:items-center xl:gap-10">
      <Typography as="li" variant="h5" className="p-1 font-light">
        <a
          href="/home"
          className={`flex items-center text-white hover:text-purple-300 hover:scale-110 hover:drop-shadow-md transition-all duration-200 ease-in-out ${
            currentPage === "Home"
              ? "bg-gradient-to-r from-[#502A50] to-[#3A253F] rounded-md px-2 py-1 drop-shadow-md"
              : ""
          }`}
        >
          Home
        </a>
      </Typography>
      <Typography as="li" variant="h5" className="p-1 font-light">
        <a
          href="/movie/filter"
          className={`flex items-center text-white hover:text-purple-300 hover:scale-110 hover:drop-shadow-md transition-all duration-200 ease-in-out ${
            currentPage === "Movies"
              ? "bg-gradient-to-r from-[#502A50] to-[#3A253F] rounded-md px-2 py-1 drop-shadow-md"
              : ""
          }`}
        >
          Movies
        </a>
      </Typography>
      <Typography as="li" variant="h5" className="p-1 font-light">
        <a
          href="/theater-movie"
          className={`flex items-center text-white hover:text-purple-300 hover:scale-110 hover:drop-shadow-md transition-all duration-200 ease-in-out ${
            currentPage === "Buy Ticket"
              ? "bg-gradient-to-r from-[#502A50] to-[#3A253F] rounded-md px-2 py-1 drop-shadow-md"
              : ""
          }`}
        >
          Buy Ticket
        </a>
      </Typography>
      <Typography as="li" variant="h5" className="p-1 font-light">
        <a
          href="/theaters"
          className={`flex items-center text-white hover:text-purple-300 hover:scale-110 hover:drop-shadow-md transition-all duration-200 ease-in-out ${
            currentPage === "Theaters"
              ? "bg-gradient-to-r from-[#502A50] to-[#3A253F] rounded-md px-2 py-1 drop-shadow-md"
              : ""
          }`}
        >
          Theaters
        </a>
      </Typography>
      <Typography as="li" variant="h5" className="p-1 font-light">
        <a
          href="/news"
          className={`flex items-center text-white hover:text-purple-300 hover:scale-110 hover:drop-shadow-md transition-all duration-200 ease-in-out ${
            currentPage === "News"
              ? "bg-gradient-to-r from-[#502A50] to-[#3A253F] rounded-md px-2 py-1 drop-shadow-md"
              : ""
          }`}
        >
          News
        </a>
      </Typography>
    </ul>
  );

  return (
    <>
      <Navbar className="max-w-full py-5 lg:py-6 px-4 lg:px-36 rounded-none border-none !bg-[#502A50] shadow-md">
        <div className="mx-auto flex items-center justify-between text-white">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/ico.png" className="w-10 h-10 mr-3 self-center" />
            <a href="/home">
              <p className="text-2xl xl:text-3xl cursor-pointer font-medium text-white">
                Starlight Cinema
              </p>
            </a>
          </div>

          {/* Navigation and Search for Desktop */}
          <div className="hidden xl:flex items-center justify-center flex-1">
            {navList}
          </div>

          {/* Right Section: Search, Profile/Sign in */}
          <div className="hidden xl:flex items-center gap-4">
            {/* Search Icon */}
            <div className="relative flex items-center">
              <MagnifyingGlassIcon
                className="h-8 w-8 text-white hover:brightness-150 hover:scale-110 transition-all duration-200 ease-in-out cursor-pointer"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
              {isSearchOpen && (
                <form onSubmit={handleSubmit} className="relative ml-2">
                  <input
                    type="search"
                    placeholder="Search"
                    onChange={handleChange}
                    value={searchTerm}
                    autoComplete="off"
                    className="outline-none ring-0 w-56 h-12 transition-all duration-400 ease-in-out rounded-full text-lg px-5 bg-gray-800 border border-gray-700 focus:border-gray-500 text-white shadow-sm"
                  />
                </form>
              )}
            </div>

            {/* Profile or Sign in/Sign up */}
            {login && userInfo ? (
              <ProfileMenu data={userInfo} />
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outlined"
                  className="text-white text-md rounded-full border-gray-600 hover:border-gray-400 transition-all duration-200 ease-in-out shadow-sm"
                  onClick={() => setOpenSignUp(!openSignUp)}
                >
                  Sign up
                </Button>
                <Button
                  variant="filled"
                  className="text-white bg-purple-500 text-md rounded-full hover:bg-purple-600 transition-all duration-200 ease-in-out shadow-sm"
                  onClick={() => setOpenSignIn(true)}
                >
                  Sign in
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <IconButton
            variant="text"
            className="xl:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <XMarkIcon className="h-8 w-8" stroke="white" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-8 w-8" stroke="white" strokeWidth={2} />
            )}
          </IconButton>
        </div>

        {/* Mobile Menu Collapse */}
        <Collapse open={openNav}>
          <div className="mt-4">
            {navList}
            <div className="flex flex-col gap-4 mt-4">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="search"
                  placeholder="Search"
                  onChange={handleChange}
                  value={searchTerm}
                  autoComplete="off"
                  className="outline-none ring-0 w-56 h-12 transition-all duration-400 ease-in-out rounded-full text-lg px-5 bg-gray-800 border border-gray-700 focus:border-gray-500 text-white shadow-sm"
                />
                <MagnifyingGlassIcon
                  onClick={handleSubmit}
                  className="absolute right-20 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-200"
                />
              </form>
              {isLoading ? null : login && userInfo ? (
                <ProfileMenu data={userInfo} />
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outlined"
                    className="text-white text-md rounded-full border-gray-600 hover:border-gray-400 transition-all duration-200 ease-in-out shadow-sm"
                    onClick={() => setOpenSignUp(!openSignUp)}
                  >
                    Sign up
                  </Button>
                  <Button
                    variant="filled"
                    className="text-white bg-purple-500 text-md rounded-full hover:bg-purple-600 transition-all duration-200 ease-in-out shadow-sm"
                    onClick={() => setOpenSignIn(true)}
                  >
                    Sign in
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Collapse>

        {/* Sign In/Sign Up/Forgot Password Popups */}
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
          <ForgottenPassword
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
