import {useState, useEffect} from 'react';
export default function ForgotPassword(){
    const [errorMessage, setErrorMessage] = useState("");
    const [okMessage, setOkMessage] = useState("");
    const [step, setStep] = useState(1);
    const [emailAddress, setEmailAddress] = useState({
      gmail: "",
    });

    const [newPassword, setNewPassword] = useState({
      password: "",
      rePassword: "",
    });
    const [formDataa, setFormDataa] = useState({
      token: "",
    });
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEmailAddress((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    const handleChangee = (e) => {
      const { name, value } = e.target;
      setFormDataa((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    const handleChangeee = (e) => {
      const { name, value } = e.target;
      setNewPassword((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/forgotPassword`,
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
            console.log("Data sent successfully");
            setOkMessage(`${data.message}`);
            setTimeout(() => {
              setStep(2);
            }, 1000);
          } else {
            // Đảm bảo rằng bạn đang sử dụng message đúng
            const errorAlert = `Gửi mã xác thực thất bại: ${data.message}`;
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

    const handleSubmitt = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/forgotPassword/check`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              ...formDataa,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOkMessage(`${data.message}`);
            setTimeout(() => {
              setStep(3);
            }, 1000);
          } else {
            setErrorMessage(`Xác thực thất bại: ${data.message}`);
          }
        } else {
          console.error("Lỗi khi gửi:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi mạng:", error);
      }
    };
    const handleSubmittt = async (e) => {
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
              ...emailAddress,
              ...newPassword,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setOkMessage(`${data.message}`);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            setErrorMessage(`Đặt mật khẩu mới thất bại: ${data.message}`);
          }
        } else {
          console.error("Lỗi khi đặt mật khẩu:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi mạng:", error);
      }
    };
    useEffect(() => {
      if (errorMessage) {
        const timer = setTimeout(() => {
          setErrorMessage("");
        }, 2000); // 2 giây

        return () => clearTimeout(timer);
      }
    }, [errorMessage]);
    useEffect(() => {
      if (okMessage) {
        const timerr = setTimeout(() => {
          setOkMessage("");
        }, 2000);

        return () => clearTimeout(timerr);
      }
    }, [okMessage]);
}