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
  DialogFooter,
  DialogBody,
  DialogHeader,
  Dialog,
} from "@material-tailwind/react";
import AlertWithIcon from "../../components/Alert";

export default function SignUp({ openDialog, handleOpenDialog }) {
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
  const [errorMessage, setErrorMessage] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const navigate = useNavigate();
  // Hàm cập nhật dữ liệu trong form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Hàm xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Thông tin form:', formData)

    if (formData.password !== formData.rePassword) {
      alert("Password and re-entered password do not match!");
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
        // Xử lý thành công
        const data = await response.json();

        // Kiểm tra success
        if (data.success) {
          setErrorMessage(null);
          console.log("Sign up successfully:", data.message);
          setOkMessage(`Sign up successfully: ${data.message}`);
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
      className="px-6 my-3 bg-[#58565f] mx-auto w-[90%] md:w-[30%] gap-2 overflow-auto"
    >
      <DialogHeader className="text-white pb-0">Create an account</DialogHeader>

      {errorMessage && <AlertWithIcon type="negative" message={errorMessage} />}
      {okMessage && <AlertWithIcon type="positive" message={okMessage} />}

      <DialogBody className="p-2">
        <form
          className="mt-1 mb-2 min-w-[100%] max-w-screen-lg sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="mb-1 flex flex-col gap-2">
            <Typography variant="h5" color="white" className="font-light">
              Name
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your full name"
              name="name"
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h5" color="white" className=" font-light">
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
            <Typography variant="h5" color="white" className="font-light">
              Email
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your email address"
              name="gmail"
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h5" color="white" className="font-light">
              Phone Number
            </Typography>
            <Input
              size="lg"
              placeholder="Enter your phone number"
              name="phone__number"
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h5" color="white" className="font-light">
              Date of birth
            </Typography>
            <Input
              size="lg"
              type="date"
              name="birthday"
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
            />
            <div className="flex gap-3 items-center">
              <Typography variant="h5" color="white" className="font-light">
                Gender
              </Typography>
              <Radio
                name="sex"
                onChange={handleChange}
                labelProps={{ className: "text-xl text-white" }}
                label="Male"
                value="male"
              />
              <Radio
                name="sex"
                onChange={handleChange}
                labelProps={{ className: "text-xl text-white" }}
                label="Female"
                value="female"
              />
            </div>
            <Typography variant="h5" color="white" className="font-light">
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
            <Input
              type="password"
              size="lg"
              placeholder="Confirm your password"
              name="rePassword"
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <div className="w-full flex flex-row justify-center">
            <Button
              type="submit"
              className="mt-2 mr-3 !bg-gray-800"
              color="black"
              onClick={() => {
                handleOpenDialog();
                setOkMessage("");
                setErrorMessage("");
              }}
            >
              cancel
            </Button>
            <Button type="submit" className="mt-2 !bg-[#502A50]" color="purple">
              sign up
            </Button>
          </div>
        </form>
      </DialogBody>
      <DialogFooter className="flex-col items-center pt-0">
        <Typography color="gray" className="text-center text-white font-normal">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="font-medium text-green-300 hover:underline hover:underline-offset-2"
          >
            Sign In
          </a>
        </Typography>
      </DialogFooter>
    </Dialog>
  );
}
