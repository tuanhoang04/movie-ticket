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

export default function SignIn() {
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
          setOkMessage(`Đăng nhập thành công: ${data.message}`);
          localStorage.setItem("jwt", data.jwt);
          localStorage.setItem("user_id", data.user_id);
          if (data.message == "user") {
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            setTimeout(() => {
              window.location.href = "/admin";
              location.window.reload();
            }, 1500);
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
//   useEffect(() => {
//     if (errorMessage) {
//       const timer = setTimeout(() => {
//         setErrorMessage("");
//       }, 2000); // 2 giây

//       return () => clearTimeout(timer);
//     }
//   }, [errorMessage]);
  useEffect(() => {
    if (okMessage) {
      const timer = setTimeout(() => {
        navigate("/home");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [okMessage]);

  return (
    <div className="bg-[#1C1B21] flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-grow items-center justify-center px-6 lg:px-24">
        <Card className="px-6 py-4 my-3 bg-gray-600 mx-auto max-w-md" shadow={false}>
          <Typography variant="h4" color="white">
            Log in to your account
          </Typography>
          {errorMessage && <AlertWithIcon message={errorMessage} />}
          <form
            onSubmit={handleSubmit}
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          >
            <div className="mb-1 flex flex-col gap-5">
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
            <Button type="submit" className="mt-6" fullWidth>
              sign in
            </Button>
            <Typography
              color="gray"
              className="mt-4 text-center text-white font-normal"
            >
              Don't have an account?{" "}
              <a href="/sign-up" className="font-medium text-white">
                Sign Up
              </a>
            </Typography>
          </form>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
