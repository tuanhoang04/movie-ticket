import { useEffect, useState } from "react";
import { useTicketContext } from "./BookingTicketProvider";
import { Button } from "@material-tailwind/react";
import AlertWithIcon from "../Alert";
export default function OrderDetails({ setNextStep, setPrevStep }) {
  const jwt = localStorage.getItem("jwt");
  const {
    showtime_id,
    seatTotalAmount,
    popcornTotalAmount,
    selectedSeats,
    selectedCombos,
  } = useTicketContext();
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
  const [message, setMessage] = useState("");
  const totalAmount = seatTotalAmount + popcornTotalAmount;
  const numFormat = new Intl.NumberFormat("de-DE");
  useEffect(() => {
    // Đồng hồ đếm ngược 5 phút
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Giữ ghế khi vào trang
  useEffect(() => {
    if (selectedSeats.length > 0) {
      handleReserveSeat(); // Giữ ghế nếu có ghế đã chọn
    }
  }, [selectedSeats]);

  // Hàm giữ ghế
  const handleReserveSeat = async () => {
    setLoading(true); // Bắt đầu loading khi giữ ghế
    try {
      // Gửi thông tin giữ ghế tới server
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payment/giu_ghe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`, // Thêm token nếu cần
          },
          body: JSON.stringify({
            showtime_id: showtime_id,
            bookedSeat: selectedSeats, // Ghế đã được chọn
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // console.log(data);
      } else {
        alert(
          "The seat has already been taken by another user, please try again!"
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Error during reserving seats:", error);
      alert("Đã có lỗi xảy ra khi giữ ghế. Vui lòng thử lại.");
    } finally {
      setLoading(false); // Dừng loading sau khi xử lý xong
    }
  };

  // Xử lý khi hết giờ
  const handleTimeOut = async () => {
    alert("Your reservation time is up. You will be redirected to homepage!");
    window.location.href = `/home`; // Chuyển về trang chủ
  };

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
            amount: totalAmount,
            selectedSeats: selectedSeats,
            selectedCombos: selectedCombos,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData && responseData.paymentUrl) {
            window.location.href = responseData.paymentUrl;
          } else {
            alert(
              "Bạn chưa đăng nhập hoặc đã hết phiên đăng nhập. Vui lòng thử lại."
            );
          }
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
      console.error("Payment error:", error);
      alert("Đã có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.");
    } finally {
      setLoading(false); // Dừng loading sau khi xử lý xong
    }
  };

  const getSeatName = (seatType) => {
    if (seatType === 0) return "Normal Seat";
    if (seatType === 1) return "VIP Seat";
    if (seatType === 2) return "Double Seat";
    return "Unidentified Seat";
  };

  // Nhóm ghế theo loại và tính tổng số lượng và giá
  const groupedSeats = selectedSeats.reduce((totalPriceAndQuantity, seat) => {
    const seatType = getSeatName(seat.seat_type);
    if (!totalPriceAndQuantity[seatType]) {
      totalPriceAndQuantity[seatType] = { quantity: 0, price: 0 };
    }
    totalPriceAndQuantity[seatType].quantity += 1;
    totalPriceAndQuantity[seatType].price += seat.price;
    return totalPriceAndQuantity;
  }, {});



  return (
    <div className="bg-[#323137] w-full my-8 rounded-xl flex flex-col">
      <div className="py-2 px-24 w-full flex justify-between items-center flex-row rounded-t-xl bg-[#65438D]">
        <div className="flex flex-col items-center">
          <img src="/icons/car-seat.png" className="w-9 mb-[4px]" />
          <p className="text-[#B6DBFF] font-medium text-lg">Select your seat</p>
        </div>
        <img src="/icons/next-page.png" className="w-10 h-10" />
        <div className="flex flex-col items-center">
          <img src="/icons/shopping.png" className="w-9 mb-[4px]" />
          <p className="text-[#B6DBFF] font-medium text-lg">Buy snacks</p>
        </div>
        <img src="/icons/next-page.png" className="w-10 h-10" />
        <div className="flex flex-col items-center">
          <img src="/icons/coin-in-hand.png" className="w-9 mb-[4px]" />
          <p className="text-[#B6DBFF] font-medium text-lg">Payment</p>
        </div>
        <img src="/icons/next-page.png" className="w-10 h-10" />
        <div className="flex flex-col items-center">
          <img src="/icons/information.png" className="w-9 mb-[4px]" />
          <p className="text-[#B6DBFF] font-medium text-lg">
            Ticket Information
          </p>
        </div>
      </div>

      <div className="py-6 px-20">
        {message && <AlertWithIcon message={message} />}
        <div className={`grid grid-cols-12 grid-rows-${groupedSeats.length}`}>
          <div className="bg-[#606060] rounded-t-lg col-span-12 row-span-1 grid grid-cols-12 grid-rows-1">
            <div className="col-span-7 row-span-1 ml-8 py-5">
              <p className="text-white text-xl font-light">Product name</p>
            </div>
            <div className="col-span-2 row-span-1 flex items-center justify-center border-l-2 border-r-2 py-5">
              <p className="text-white text-xl font-light">Quantity</p>
            </div>
            <div className="col-span-3 row-span-1 flex items-center justify-center py-5">
              <p className="text-white text-xl font-light">Price</p>
            </div>
          </div>

          {Object.entries(groupedSeats).map(([seatType, details], index) => {
            return (
              <div
                key={index}
                className="col-span-12 row-span-1 grid grid-cols-12 grid-rows-1"
              >
                <div className="col-span-7 row-span-1 ml-8 py-5">
                  <p className="text-white text-xl font-light">{seatType}</p>
                </div>
                <div className="col-span-2 row-span-1 flex items-center justify-center py-5">
                  <p className="text-white text-xl font-light">
                    {details.quantity}
                  </p>
                </div>
                <div className="col-span-3 row-span-1 flex items-center justify-center py-5">
                  <p className="text-white text-xl font-light">
                    {numFormat.format(parseInt(details.price)) + "đ"}
                  </p>
                </div>
              </div>
            );
          })}

          {Object.entries(selectedCombos).map(([id, item], index) => {
            
            return (
              <div
                key={index}
                className="col-span-12 row-span-1 grid grid-cols-12 grid-rows-1"
              >
                <div className="col-span-7 row-span-1 ml-8 py-5">
                  <p className="text-white text-xl font-light">
                    {item.combo_name}
                  </p>
                </div>
                <div className="col-span-2 row-span-1 flex items-center justify-center py-5">
                  <p className="text-white text-xl font-light">
                    {item.quantity}
                  </p>
                </div>
                <div className="col-span-3 row-span-1 flex items-center justify-center py-5">
                  <p className="text-white text-xl font-light">
                    {numFormat.format(parseInt(item.price)) + "đ"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pb-6 px-20">
        <div className="bg-[#606060] rounded-lg p-4">
          <p className="text-white text-2xl font-light mb-2">Order total:</p>
          <p className="text-white text-xl">
            {numFormat.format(seatTotalAmount + popcornTotalAmount)}đ
          </p>
          <br />
          <p className="text-white text-xl font-light">Time reserving seat left: <b>{timeLeft} seconds</b></p>
        </div>
      </div>

      <div className="flex flex-row gap-4 justify-center mb-5">
        <Button
          variant="text"
          className="text-white text-base"
          onClick={() => {
            setPrevStep();
          }}
        >
          Go Back
        </Button>
        <Button
          variant="filled"
          color="purple"
          className={`text-white text-base ${
            seatTotalAmount > 0 ? "bg-[#875CFF]" : "bg-[#6d5e71]"
          } rounded-lg`}
          onClick={() => {
            setNextStep();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
