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
} from "@material-tailwind/react";
import AlertWithIcon from "../../components/Alert";

export default function SignUp() {
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
          console.log("Sign up successfully:", data.message);
          setOkMessage(`Sign up successfully: ${data.message}`);
          setTimeout(() => {
            window.location.reload();
          }, 2500);
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
  //   useEffect(() => {
  //     if (errorMessage) {
  //       const timer = setTimeout(() => {
  //         setErrorMessage("");
  //       }, 1000); // 1 giây

  //       return () => clearTimeout(timer);
  //     }
  //   }, [errorMessage]);
  useEffect(() => {
    if (okMessage) {
      const timer = setTimeout(() => {
        navigate("/sign-in");
      }, 500); // 0.5 giây

      return () => clearTimeout(timer);
    }
  }, [okMessage]);

  return (
    <div className="bg-[#1C1B21] flex flex-col min-h-screen">
      <NavBar />
      <div className="flex items-center justify-center px-6 lg:px-24">
        <Card className="px-6 py-4 my-3 bg-gray-600 w-[50%]" shadow={false}>
          <Typography variant="h4" color="white">
            Create an account
          </Typography>
          {errorMessage && <AlertWithIcon message={errorMessage} />}
          <form
            onSubmit={handleSubmit}
            className="mt-8 mb-2 min-w-[100%] max-w-screen-lg sm:w-96"
          >
            <div className="mb-1 flex flex-col gap-5">
              <Typography
                variant="h5"
                color="white"
                className="font-light -mb-4"
              >
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
              <Typography
                variant="h5"
                color="white"
                className="-mb-4 font-light"
              >
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
              <Typography
                variant="h5"
                color="white"
                className="-mb-4 font-light"
              >
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
              <Typography
                variant="h5"
                color="white"
                className="-mb-4 font-light"
              >
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
              <Typography
                variant="h5"
                color="white"
                className="-mb-4 font-light"
              >
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
              <Typography
                variant="h5"
                color="white"
                className="-mb-4 font-light"
              >
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
            <Button type="submit" className="mt-6" fullWidth>
              sign up
            </Button>
            <Typography
              color="gray"
              className="mt-4 text-center text-white font-normal"
            >
              Already have an account?{" "}
              <a href="/sign-in" className="font-medium text-white">
                Sign In
              </a>
            </Typography>
          </form>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
