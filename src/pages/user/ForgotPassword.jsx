import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import AlertWithIcon from "../../components/Alert";

export default function ForgotPassword({ openDialog, handleOpenDialog }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const [step, setStep] = useState(1);
  const [emailAddress, setEmailAddress] = useState({
    gmail: "",
  });

  const [passwordObj, setPasswordObj] = useState({
    password: "",
    rePassword: "",
  });
  const [newToken, setNewToken] = useState({
    token: "",
  });

  const handleChangeToken = (e) => {
    setNewToken({ ...newToken, token: e.target.value });
  };

  const handleChangeRePassword = (e) => {
    setPasswordObj({ ...passwordObj, rePassword: e.target.value });
  };
  const handleChangePassword = (e) => {
    setPasswordObj({ ...passwordObj, password: e.target.value });
  };
  const handleChangeEmail = (e) => {
    setEmailAddress({ ...emailAddress, gmail: e.target.value });
  };
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      console.log(emailAddress);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forgotPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailAddress),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("Success!");
          setErrorMessage("");
          setOkMessage(`${data.message}`);
          setTimeout(() => {
            setStep(2);
          }, 1000);
        } else {
          const errorAlert = `Failed to send verification code:${data.message}`;
          setOkMessage("");
          setErrorMessage(errorAlert);
        }
      } else {
        console.error("Error sending request:", response.statusText);
        setErrorMessage("An error occurred while sending the request. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error. Please check your connection.");
    }
  };

  const handleEmailAndTokenSubmit = async (e) => {
    e.preventDefault();
    console.log(emailAddress);
    console.log(newToken);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forgotPassword/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...emailAddress,
            ...newToken,
          }),
        }
      );
      console.log("a");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setErrorMessage("");
          setOkMessage(`${data.message}`);
          setTimeout(() => {
            setStep(3);
          }, 1000);
        } else {
          setOkMessage("");
          setErrorMessage(`Code is incorrect!`);
        }
      } else {
        console.error("An error occurred:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const handleChangePasswordByTokenSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/forgotPassword/changePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...passwordObj,
            ...emailAddress,
            ...newToken,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setErrorMessage("");
          setOkMessage(`${data.message}`);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setOkMessage("");
          setErrorMessage(`Failed to set new password: ${data.message}`);
        }
      } else {
        console.error("Error setting new password:", response.statusText);
      }
    } catch (error) {
      console.error("Network error. Please check your connection.", error);
    }
  };

  return (
    <Dialog
      open={openDialog}
      handleOpen={handleOpenDialog}
      size="sm"
      className="xl:px-6 xl:py-4 px-3 py-2 my-4 bg-[#4B4A52] mx-auto min-w-[85%] md:min-w-[30%] gap-3 xl:gap-6 rounded-lg shadow-lg transition-all duration-300"
    >
      <DialogHeader className="text-white text-2xl xl:text-3xl font-semibold text-center flex justify-center">
        Change Your Password
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
      <DialogBody className="xl:mt-4 mb-1">
        {step === 1 && (
          <form
            onSubmit={handleSubmitEmail}
            className="flex flex-col w-[100%] gap-8"
          >
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
                type="mail"
                onChange={(txt) => handleChangeEmail(txt)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="flex flex-row justify-center items-center gap-8">
              <Button
                className="w-fit py-2.5 bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
                onClick={() => {
                  handleOpenDialog();
                  setOkMessage("");
                  setEmailAddress("");
                  setErrorMessage("");
                  setNewToken("");
                  setPasswordObj({});
                  setStep(1);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitEmail}
                className="w-fit py-2.5 focus:ring-2 focus:ring-[#D8B4FE] focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
                type="submit"
                style={{
                  background:
                    "linear-gradient(90deg, #f99d63 0%, #f373c6 50%, #ca6fff 100%)",
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleEmailAndTokenSubmit}
            className="flex flex-col w-[100%] gap-8"
          >
            <div>
              <Typography
                variant="h5"
                color="white"
                className="mb-2 font-light text-xl text-white"
              >
                Password Reset Code
              </Typography>
              <Input
                size="lg"
                placeholder="Enter the code sent to your email address"
                type="text"
                onChange={(txt) => {
                  handleChangeToken(txt);
                }}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="flex flex-row justify-center items-center gap-8">
              <Button
                className="w-fit py-2.5 bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
                type="submit"
                onClick={() => {
                  handleOpenDialog();
                  setOkMessage("");
                  setEmailAddress("");
                  setErrorMessage("");
                  setNewToken("");
                  setPasswordObj({});
                  setStep(1);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEmailAndTokenSubmit}
                className="w-fit py-2.5 focus:ring-2 focus:ring-[#D8B4FE] focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
                style={{
                  background:
                    "linear-gradient(90deg, #f99d63 0%, #f373c6 50%, #ca6fff 100%)",
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handleChangePasswordByTokenSubmit}
            className="flex flex-col w-[100%] gap-8"
          >
            <div>
              <Typography
                variant="h5"
                color="white"
                className="mb-2 font-light text-xl text-white"
              >
                Your New Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="Enter your new password"
                name="password"
                onChange={handleChangePassword}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography
                variant="h5"
                color="white"
                className="mb-2 font-light text-xl text-white mt-4"
              >
                Re-enter Your New Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="Re-enter your new password"
                name="password"
                onChange={handleChangeRePassword}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-gray-300 placeholder:!opacity-70 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none !text-lg rounded-md shadow-sm transition-all duration-200"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="flex flex-row justify-center items-center gap-8">
              <Button
                className="w-fit py-2.5 bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
                onClick={() => {
                  handleOpenDialog();
                  setOkMessage("");
                  setEmailAddress("");
                  setErrorMessage("");
                  setNewToken("");
                  setPasswordObj({});
                  setStep(1);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePasswordByTokenSubmit}
                type="submit"
                className="w-fit py-2.5 focus:ring-2 focus:ring-[#D8B4FE] focus:outline-none rounded-md shadow-sm transition-all duration-200 text-lg font-normal capitalize"
                style={{
                  background:
                    "linear-gradient(90deg, #f99d63 0%, #f373c6 50%, #ca6fff 100%)",
                }}
              >
                Change Password
              </Button>
            </div>
          </form>
        )}
      </DialogBody>
    </Dialog>
  );
}