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

export default function SignIn({openDialog, handleOpenDialog}) {
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
          localStorage.setItem("user_id", data.user_id);
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
        // Xử lý lỗi
        console.error("Sign in failed:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
    }
  };

  return (
    <Dialog
      open={openDialog}
      handleOpen={handleOpenDialog}
      className="px-6 py-4 my-3 bg-[#58565f] mx-auto w-[90%] md:w-[30%] gap-5"
    >
      <DialogHeader className="text-white pb-0">
        Log in to your account
      </DialogHeader>
      {errorMessage && <AlertWithIcon type="negative" message={errorMessage} />}
      {okMessage && <AlertWithIcon type="positive" message={okMessage} />}
      <DialogBody className="mt-3 mb-1">
        <form onSubmit={handleSubmit} className="flex flex-col w-[100%] gap-5">
          <div>
            <Typography variant="h5" color="white" className="mb-1 font-light">
              Username
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your username"
              name="user__name"
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div>
            <Typography variant="h5" color="white" className="mb-1 font-light">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="Enter your password"
              name="password"
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="flex flex-row justify-center items-center">
            <Button
              color="gray"
              className="w-28 mr-3 bg-gray-800"
              onClick={handleOpenDialog}
            >
              cancel
            </Button>
            <Button type="submit" className="w-28 !bg-[#502A50]" color="purple">
              sign in
            </Button>
          </div>
        </form>
      </DialogBody>
      <DialogFooter className="flex-col items-center pt-0">
        <div>
          <Typography color="gray" className="text-white font-normal">
            Forgot your password?{" "}
            <a
              href="/change-password"
              className="font-semibold hover:underline hover:underline-offset-2"
            >
              Change password
            </a>
          </Typography>
          <Typography color="gray" className="text-white font-normal mr-3">
            Don't have an account?{" "}
            <a
              href="/sign-up"
              className="font-semibold hover:underline hover:underline-offset-2"
            >
              Sign Up
            </a>
          </Typography>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
