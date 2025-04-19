import { useEffect, useState } from "react";
import Footer from "../Footer";
import NavBar from "../NavBar";
import BookingTicketProvider from "./BookingTicketProvider";
import BookingSelectSeats from "./BookingSelectSeats";
import BookingSelectPopcorn from "./BookingSelectPopcorn";
export default function BookingTicket() {
  const jwt = localStorage.getItem("jwt");
  const checkLogin = async () => {
    if (selectedSeats.length > 0) {
      try {
        // Gửi request POST đến endpoint "/api/userInfo"
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/userInfo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ jwt: jwt }),
          }
        )
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.success) {
              // action to do when login is successful
            } else {
              alert("Please login to continue!");
              navigate(-1);
            }
          })
          .catch((error) => console.error("Error:", error));
      } catch (error) {
        console.error("Lỗi khi gửi request:", error);
        alert("Đã xảy ra lỗi, vui lòng thử lại sau!");
      }
    }
  };
  useEffect(() => {
    checkLogin();
  }, []);
  const [step, setStep] = useState(0); // 0: Select seats, 1: Buy popcorn, 2: Payment, 3: Ticket details
  const nextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 3)); // upper limit is 3
  };

  const prevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 0)); // bottom limit is 0;
  };
  return (
    <BookingTicketProvider>
      <div className="bg-[#1C1B21] min-h-screen flex flex-col">
        <NavBar />
        {step === 0 && (
          <div className="flex flex-grow px-8 lg:px-36">
            <BookingSelectSeats setNextStep={nextStep} />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-grow px-8 lg:px-36">
            <BookingSelectPopcorn
              setNextStep={nextStep}
              setPrevStep={prevStep}
            />
          </div>
        )}
        <Footer />
      </div>
    </BookingTicketProvider>
  );
}
