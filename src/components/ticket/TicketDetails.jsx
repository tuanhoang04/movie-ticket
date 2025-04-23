import { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function TicketDetails() {
  const jwt = localStorage.getItem("jwt");
  const [orderInfo, setOrderInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(3); // 0: Chọn ghế, 1: Bắp nước, 2: Thanh toán, 3: Thông tin vé
  const ref = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch seat data
    const fetchOrderInfo = () => {
      try {
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/getLastestOrder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jwt: jwt }),
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.success) {
              setOrderInfo(responseData.order); // Lưu thông tin đơn hàng vào state
              console.log(responseData.order);
              setLoading(false); // Đánh dấu việc load dữ liệu xong
            } else {
              alert("You are not logged in, please log in to continue!");
              window.location.href = `/home`; // Chuyển về trang chủ
            }
          })
          .catch((error) => console.error("Error:", error));
      } catch (error) {
        setError("Đã xảy ra lỗi khi tải thông tin.");
        setLoading(false); // Đánh dấu việc load dữ liệu xong
      }
    };
    fetchOrderInfo();
  }, [jwt]);

  const handleDownload = useCallback(async () => {
    if (!ref.current || loading) return;

    try {
      // Add slight delay to ensure rendering completion
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(ref.current, {
        useCORS: true, // Enable cross-origin images
        backgroundColor: "#323137", // Match your div's background
        scale: 2, // Higher resolution
      });

      const dataUrl = canvas.toDataURL("image/png");

      // Create temporary link
      const link = document.createElement("a");
      link.download = "ticket.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error capturing div:", error);
    }
  }, [loading]);

  const formatDate = (input) => {
    const date = new Date(input);
    const options = {
      weekday: "short", // e.g., "Sat"
      day: "2-digit", // e.g., "19"
      month: "short", // e.g., "Apr"
      year: "numeric", // e.g., "2025"
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-[#323137] w-full my-8 rounded-xl flex flex-col">
      <div className="py-2 px-24 w-full flex justify-between items-center flex-row rounded-t-xl bg-[#65438D]">
        <div className="flex flex-col items-center">
          <img src="/icons/car-seat-white.png" className="w-9 mb-[4px]" />
          <p className="text-white font-medium text-lg">Select your seat</p>
        </div>
        <img src="/icons/next-page.png" className="w-10 h-10" />
        <div className="flex flex-col items-center">
          <img src="/icons/shopping-white.png" className="w-9 mb-[4px]" />
          <p className="text-white font-medium text-lg">Buy snacks</p>
        </div>
        <img src="/icons/next-page.png" className="w-10 h-10" />
        <div className="flex flex-col items-center">
          <img src="/icons/coin-in-hand-white.png" className="w-9 mb-[4px]" />
          <p className="text-white font-medium text-lg">Payment</p>
        </div>
        <img src="/icons/next-page.png" className="w-10 h-10" />
        <div className="flex flex-col items-center">
          <img src="/icons/information.png" className="w-9 mb-[4px]" />
          <p className="text-[#B6DBFF] font-medium text-lg">
            Ticket Information
          </p>
        </div>
      </div>

      <div className="py-6 px-20 w-fit self-center flex flex-col items-center">
        <p className="text-white text-3xl font-light">
          The order was paid successfully, here is your ticket!
        </p>
        <div
          ref={ref}
          className="mt-10 p-10 box-content w-full self-center grid grid-cols-2 grid-rows-4 gap-y-5 gap-3"
        >
          <div className="col-span-2 row-span-1">
            <div className="flex flex-col items-start">
              <p className="text-white font-light text-xl">Date</p>
              <p className="text-white text-2xl">
                {formatDate(orderInfo?.show_date)}
              </p>
            </div>
          </div>
          <div className="col-span-1 row-span-1">
            <div className="flex flex-col items-start">
              <p className="text-white font-light text-xl">Movie Title</p>
              <p className="text-white text-2xl">{orderInfo?.film_name}</p>
            </div>
          </div>
          <div className="col-span-1 row-span-1 flex justify-end">
            <div className="flex flex-col items-end">
              <p className="text-white font-light text-xl">Room</p>
              <p className="text-white text-2xl">{orderInfo?.room_name}</p>
            </div>
          </div>
          <div className="col-span-1 row-span-1">
            <div className="flex flex-col items-start">
              <p className="text-white font-light text-xl">Seats</p>
              <p className="text-white text-2xl">
                {orderInfo?.seats.map((seat) => seat.seat_name).join(", ")}
              </p>
            </div>
          </div>
          <div className="col-span-1 row-span-1 flex justify-end">
            <div className="flex flex-col items-end">
              <p className="text-white font-light text-xl">Hour</p>
              <p className="text-white text-2xl">
                {orderInfo?.show_time.substring(0, 5)}
              </p>
            </div>
          </div>
          <div className="col-span-1 row-span-1">
            <div className="flex flex-col items-start">
              <p className="text-white font-light text-xl">Status</p>
              <p className="text-white text-2xl">Paid</p>
            </div>
          </div>
        </div>

        <Button
          variant="filled"
          color="purple"
          className="text-white text-base bg-[#693869] w-full rounded-lg"
          onClick={handleDownload}
        >
          Download Ticket
        </Button>
        <Button
          variant="text"
          className="text-white text-base mt-8"
          onClick={() => navigate("/home")}
        >
          Return home
        </Button>
      </div>
    </div>
  );
}
