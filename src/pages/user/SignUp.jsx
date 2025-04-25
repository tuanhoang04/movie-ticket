import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Button,
  Typography,
  Radio,
  DialogFooter,
  DialogBody,
  DialogHeader,
  Dialog,
} from "@material-tailwind/react";
import AlertWithIcon from "../../components/Alert";

export default function SignUp({
  openDialog,
  handleOpenDialog,
  handleOpenSignIn,
}) {
  const [formData, setFormData] = useState({
    name: "",
    user__name: "",
    gmail: "",
    phone__number: "",
    birthday: "",
    sex: "",
    password: "",
    rePassword: "",
  });
  const begin = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (begin.current) {
      begin.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (formData.password !== formData.rePassword) {
      setErrorMessage("Password and re-entered password do not match!");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/signUp`,
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
          setErrorMessage(null);
          console.log("Sign up successfully:", data.message);
          setOkMessage(`Sign up successfully!`);
          setTimeout(() => {
            setErrorMessage("");
            setOkMessage("");
            handleOpenDialog();
          }, 1700);
        } else {
          const error_alert = `Sign up failed:, ${data.message}`;
          console.log(error_alert);
          setErrorMessage(`Sign up failed: ${data.message}`);
        }
      } else {
        setErrorMessage(`Sign up failed: ${response.statusText}`);
        console.error("Error when signing up:", response.statusText);
      }
    } catch (error) {
      setErrorMessage(`Network error: ${error}`);
    }
  };

  return (
    <Dialog
      open={openDialog}
      handleOpen={handleOpenDialog}
      className="px-6 py-4 my-4 bg-[#4B4A52] mx-auto w-[40%] md:w-[12%] gap-6 rounded-lg shadow-lg transition-all duration-300 max-h-[80vh] overflow-y-auto"
    >
      <DialogHeader
        ref={begin}
        className="text-white pb-3 text-3xl font-semibold text-center flex justify-center"
      >
        Create an account
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

      <DialogBody className="mt-4 mb-1">
        <form className="flex flex-col w-[100%] gap-8" onSubmit={handleSubmit}>
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
              placeholder="Enter your full name"
              name="name"
              onChange={handleChange}
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
            <Typography
              variant="h5"
              color="white"
              className="mb-2 font-light text-xl text-white"
            >
              Email
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your email address"
              name="gmail"
              onChange={handleChange}
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
              Phone Number
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your phone number"
              name="phone__number"
              onChange={handleChange}
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
              Date of birth
            </Typography>
            <Input
              size="lg"
              type="date"
              name="birthday"
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
            />
          </div>
          <div className="flex lg:gap-3 lg:flex-row flex-col lg:items-center">
            <Typography
              variant="h5"
              color="white"
              className="mb-2 font-light text-xl text-white"
            >
              Gender
            </Typography>
            <Radio
              name="sex"
              onChange={handleChange}
              labelProps={{ className: "text-lg text-white" }}
              label="Male"
              value="male"
            />
            <Radio
              name="sex"
              onChange={handleChange}
              labelProps={{ className: "text-lg text-white" }}
              label="Female"
              value="female"
            />
          </div>
          <div>
            <Typography
              variant="h5"
              color="white"
              className="mb-2 font-light text-xl text-white"
            >
              Password
            </Typography>
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
          <div>
            <Typography
              variant="h5"
              color="white"
              className="mb-2 font-light text-xl text-white"
            >
              Confirm Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="Confirm your password"
              name="rePassword"
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="flex flex-row justify-center items-center gap-4">
            <Button
              type="submit"
              className="w-fit py-2.5 bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
              onClick={() => {
                handleOpenDialog();
                setOkMessage("");
                setErrorMessage("");
              }}
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
              Sign Up
            </Button>
          </div>
        </form>
      </DialogBody>
      <DialogFooter className="flex-col items-center pt-3">
        <Typography color="gray" className="text-gray-200 font-normal text-lg">
          Already have an account?{" "}
          <a
            onClick={handleOpenSignIn}
            className="text-[#3B82F6] hover:underline cursor-pointer"
          >
            Sign In
          </a>
        </Typography>
      </DialogFooter>
    </Dialog>
  );
}
