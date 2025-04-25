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
    setNewToken({...newToken, token: e.target.value});
  };

  const handleChangeRePassword = (e) => {
    setPasswordObj({ ...passwordObj, rePassword: e.target.value });
  };
  const handleChangePassword = (e) => {
    setPasswordObj({ ...passwordObj, password: e.target.value });
  };
  const handleChangeEmail = (e) => {
    setEmailAddress({...emailAddress, gmail: e.target.value });
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
          console.log("thanh cong roi");
          setErrorMessage("");
          setOkMessage(`${data.message}`);
          setTimeout(() => {
            setStep(2);
          }, 1000);
        } else {
          // Đảm bảo rằng bạn đang sử dụng message đúng
          const errorAlert = `Gửi mã xác thực thất bại: ${data.message}`;
          setOkMessage("");
          setErrorMessage(errorAlert);
        }
      } else {
        console.error("Lỗi khi gửi:", response.statusText);
        setErrorMessage("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
      setErrorMessage("Lỗi mạng. Vui lòng kiểm tra kết nối của bạn.");
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
          setErrorMessage(`Đặt mật khẩu mới thất bại: ${data.message}`);
        }
      } else {
        console.error("Lỗi khi đặt mật khẩu:", response.statusText);
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
        Change your password
      </DialogHeader>
      {errorMessage && <AlertWithIcon type="negative" message={errorMessage} />}
      {okMessage && <AlertWithIcon type="positive" message={okMessage} />}
      <DialogBody className="mt-3 mb-1">
        {step === 1 && (
          <form
            onSubmit={handleSubmitEmail}
            className="flex flex-col w-[100%] gap-5"
          >
            <div>
              <Typography
                variant="h5"
                color="white"
                className="mb-1 font-light"
              >
                Email
              </Typography>
              <Input
                size="lg"
                placeholder="Enter your email address"
                type="mail"
                onChange={(txt) => handleChangeEmail(txt)}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="flex flex-row justify-center items-center">
              <Button
                className="mr-3 !bg-gray-800"
                color="black"
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
                cancel
              </Button>
              <Button
                onClick={handleSubmitEmail}
                className="w-fit !bg-[#502A50]"
                type="submit"
                color="purple"
              >
                submit
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleEmailAndTokenSubmit}
            className="flex flex-col w-[100%] gap-5"
          >
            <div>
              <Typography
                variant="h5"
                color="white"
                className="mb-1 font-light"
              >
                Password reset code
              </Typography>
              <Input
                size="lg"
                placeholder="Enter the code sent to your email address"
                type="text"
                onChange={(txt) => {
                  handleChangeToken(txt);
                }}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="flex flex-row justify-center items-center">
              <Button
                className="mr-3 !bg-gray-800"
                color="black"
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
                cancel
              </Button>
              <Button
                onClick={handleEmailAndTokenSubmit}
                className="w-fit !bg-[#502A50]"
                color="purple"
              >
                submit
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
                className="mb-1 font-light"
              >
                Your new password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="Enter your new password"
                name="password"
                onChange={handleChangePassword}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Typography
                variant="h5"
                color="white"
                className="mb-1 font-light mt-3"
              >
                Re-enter your new password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="Re-enter your new password"
                name="password"
                onChange={handleChangeRePassword}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 !text-white placeholder:!text-white placeholder:!opacity-70"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <div className="flex flex-row justify-center items-center">
              <Button
                className="mr-3 !bg-gray-800"
                color="black"
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
                cancel
              </Button>
              <Button
                onClick={handleChangePasswordByTokenSubmit}
                type="submit"
                className="w-fit !bg-[#502A50]"
                color="purple"
              >
                Change your password
              </Button>
            </div>
          </form>
        )}
      </DialogBody>
    </Dialog>
  );
}
