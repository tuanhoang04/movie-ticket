import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Button,
  Typography,
  Radio,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogBody,
} from "@material-tailwind/react";
import AlertWithIcon from "../../components/Alert";

export default function SignIn({
  openDialog,
  handleOpenDialog,
  handleOpenSignUp,
  handleOpenForgotPassword,
}) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const [formData, setFormData] = useState({
    user__name: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOkMessage(`Sign in successfully: ${data.message}`);
          setErrorMessage(null);
          localStorage.setItem("jwt", data.jwt);
          localStorage.setItem("role", data.message === "user" ? "0" : "1");
          // Ẩn alert sau 1 giây
          setTimeout(() => {
            setOkMessage("");
          }, 1000);
          if (data.message == "user") {
            setTimeout(() => {
              window.location.reload();
            }, 1700); // 1.7 giây
          } else {
            setTimeout(() => {
              navigate("/admin");
            }, 1700);
          }
        } else {
          const error__alert = `Sign in failed: ${data.message}`;
          console.log(error__alert);
          setErrorMessage(`Sign in failed: ${data.message}`);
        }
      } else {
        console.error("Sign in failed:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <Dialog
      open={openDialog}
      handleOpen={handleOpenDialog}
      size="sm"
      className="px-6 py-4 my-4 bg-[#4B4A52] mx-auto gap-6 rounded-lg shadow-lg transition-all duration-300"
    >
      <DialogHeader className="text-white pb-3 text-3xl font-semibold text-center flex justify-center">
        Sign In
      </DialogHeader>
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
      <DialogBody className="mt-4">
        <form onSubmit={handleSubmit} className="flex flex-col w-[100%] gap-8">
          <div>
            <Typography
              variant="h5"
              color="white"
              className="mb-2 font-light text-xl text-white"
            >
              Username
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your username"
              name="user__name"
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div>
            <div className="flex flex-row items-center justify-between">
              <Typography
                variant="h5"
                color="white"
                className="mb-2 font-light text-xl text-white"
              >
                Password
              </Typography>
              <Typography
                onClick={handleOpenForgotPassword}
                className="text-[#3B82F6] lg:text-lg text-sm font-normal mb-2 cursor-pointer hover:underline"
              >
                Forgot your password?
              </Typography>
            </div>
            <Input
              type="password"
              size="lg"
              placeholder="Enter your password"
              name="password"
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="flex flex-row justify-center items-center gap-4">
            <Button
              color="gray"
              className="w-fit py-2.5 bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
              onClick={handleOpenDialog}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-fit py-2.5 focus:ring-2 focus:ring-[#D8B4FE] focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
              style={{
                background:
                  "linear-gradient(90deg, #f99d63 0%, #f373c6 50%, #ca6fff 100%)",
              }}
            >
              Sign In
            </Button>
          </div>
        </form>
      </DialogBody>
      <DialogFooter className="flex-col items-center !pt-1">
        <div>
          <Typography
            color="gray"
            className="text-gray-200 font-normal text-lg"
          >
            Don’t have an account?{" "}
            <a
              className="text-[#3B82F6] hover:underline cursor-pointer"
              onClick={handleOpenSignUp}
            >
              Sign up
            </a>
          </Typography>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
