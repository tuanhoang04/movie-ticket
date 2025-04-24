import { useNavigate } from "react-router-dom";
import { useTicketContext } from "./BookingTicketProvider";
import { Button } from "@material-tailwind/react";
import { useState } from "react";

export default function Payment({setNextStep}) {
  const jwt = localStorage.getItem("jwt");
  const {
    showtime_id,
    seatTotalAmount,
    popcornTotalAmount,
    selectedSeats,
    selectedCombos,
  } = useTicketContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    setLoading(true); // Bắt đầu loading khi nhấn nút Thanh Toán
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jwt: jwt,
            showtime_id: showtime_id,
            amount: seatTotalAmount+popcornTotalAmount,
            selectedSeats: selectedSeats,
            selectedCombos: selectedCombos,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseData) => {
            console.log(responseData)
        //     console.log(responseData);
        //   if (responseData && responseData.paymentUrl) {
        //     // window.location.href = responseData.paymentUrl;
        //   } else {
        //     alert(
        //       "You are not logged in, please log in to continue!"
        //     );
        //   }
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error has occurred while fetching payment, please try again!");
    } finally {
      setLoading(false); // Dừng loading sau khi xử lý xong
    }
  };
  return (
    <div className="bg-[#323137] w-full my-8 rounded-xl flex flex-col">
      <div className="py-2 px-4 sm:px-6 md:px-10 lg:px-24 w-full flex justify-between items-center flex-row rounded-t-xl bg-[#65438D]">
        <div className="flex flex-col items-center">
          <img src="/icons/car-seat.png" className="w-9 mb-[4px]" />
          <p className="hidden text-[#B6DBFF] lg:block  font-medium text-lg">
            Select your seat
          </p>
        </div>
        <img src="/icons/next-page.png" className="lg:w-10 lg:h-10 w-6 h-6" />
        <div className="flex flex-col items-center">
          <img src="/icons/shopping.png" className="w-9 mb-[4px]" />
          <p className="hidden text-[#B6DBFF] lg:block font-medium text-lg">
            Buy snacks
          </p>
        </div>
        <img src="/icons/next-page.png" className="lg:w-10 lg:h-10 w-6 h-6" />
        <div className="flex flex-col items-center">
          <img src="/icons/coin-in-hand-white.png" className="w-9 mb-[4px]" />
          <p className="text-white hidden lg:block font-medium text-lg">
            Payment
          </p>
        </div>
        <img src="/icons/next-page.png" className="lg:w-10 lg:h-10 w-6 h-6" />
        <div className="flex flex-col items-center">
          <img src="/icons/information.png" className="w-9 mb-[4px]" />
          <p className="text-[#B6DBFF] hidden lg:block  font-medium text-lg">
            Ticket Information
          </p>
        </div>
      </div>

      <div className="py-6 px-4 sm:px-6 md:px-10">
        <img className="w-full" src="/payment-sample.png" />
      </div>

      <div className="flex flex-row gap-4 justify-center mb-5">
        <Button
          variant="text"
          className="text-white lg:text-base"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          color="purple"
          className={`text-white lg:text-base ${
            seatTotalAmount > 0 ? "bg-[#7b427b]" : "bg-[#6d5e71]"
          } rounded-lg`}
          onClick={() => {
            handlePayment().then(setNextStep());
          }}
        >
          Pay
        </Button>
      </div>
    </div>
  );
}
