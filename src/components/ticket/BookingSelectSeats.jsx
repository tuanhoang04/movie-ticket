import { Button } from "@material-tailwind/react";
import { useTicketContext } from "./BookingTicketProvider";
import { useNavigate } from "react-router-dom";
import AlertWithIcon from "../Alert";
import { useEffect, useState } from "react";
// seat status: available: 0, sold: 1, reserved: 2
export default function BookingSelectSeats({setNextStep}) {
  const data = useTicketContext();
  const navigate = useNavigate();
  const selectedSeats = data.selectedSeats;
  const setSelectedSeats = data.setSelectedSeats;

  const selectedCombos = data.selectedCombos;
  const setSelectedCombos = data.setSelectedCombos;

  const seatTotalAmount = data.seatTotalAmount;
  const setSeatTotalAmount = data.setSeatTotalAmount;

  const popcornTotalAmount = data.popcornTotalAmount;
  const setPopcornTotalAmount = data.setPopcornTotalAmount;
  const numFormat = new Intl.NumberFormat("de-DE");
  const [message, setMessage] = useState("");
  useEffect(()=>{
    if(seatTotalAmount>0){
      setMessage("");
    }
  },[seatTotalAmount]);

  const seatData = data.seatData;
  return (
    <div className="bg-[#323137] w-full my-8 rounded-xl flex flex-col">
      <div className="py-2 px-4 sm:px-6 md:px-10 lg:px-24 w-full flex justify-between items-center flex-row rounded-t-xl bg-[#65438D]">
        <div className="flex flex-col items-center">
          <img src="/icons/car-seat-white.png" className="w-9 mb-[4px]" />
          <p className="hidden lg:block text-white font-medium text-lg">
            Select your seat
          </p>
        </div>
        <img src="/icons/next-page.png" className="lg:w-10 lg:h-10 w-6 h-6" />
        <div className="flex flex-col items-center">
          <img src="/icons/shopping.png" className="w-9 mb-[4px]" />
          <p className="text-[#B6DBFF] hidden lg:block font-medium text-lg">
            Buy snacks
          </p>
        </div>
        <img src="/icons/next-page.png" className="lg:w-10 lg:h-10 w-6 h-6" />
        <div className="flex flex-col items-center">
          <img src="/icons/coin-in-hand.png" className="w-9 mb-[4px]" />
          <p className="text-[#B6DBFF] hidden lg:block font-medium text-lg">
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
      {seatData && (
        <div className="flex flex-col">
          <div className="lg:w-[38%] w-[90%] py-6 px-4 sm:px-6 md:px-10 self-center my-9 rounded-2xl flex flex-col items-center justify-center bg-[#232323]">
            <div className="flex lg:flex-row flex-col gap-3 justify-between lg:w-[77%] w-full mb-5">
              <div className="flex flex-row items-center">
                <div className="bg-[#FFFFFF] w-[18px] h-[18px] mr-2"></div>
                <p className="text-white text-sm lg:text-xl">Normal Seat</p>
              </div>
              <div className="flex flex-row items-center">
                <div className="bg-[#FFDE5A] w-[18px] h-[18px] mr-2"></div>
                <p className="text-white text-sm lg:text-xl">VIP Seat</p>
              </div>
              <div className="flex flex-row items-center">
                <div className="bg-[#3944E1] w-[18px] h-[18px] mr-2"></div>
                <p className="text-white text-sm lg:text-xl">Double Seat</p>
              </div>
            </div>
            <p className="text-white lg:text-4xl mb-1 text-lg lg:mb-2">
              Screen
            </p>
            <div className="bg-white w-[50%] h-[5px] mb-12"></div>
            <div className="relative ml-4 lg:ml-7 w-full aspect-[12/10]">
              {/* Column Numbers */}
              <div className="absolute -top-5 lg:-top-7 left-0 right-0 grid grid-cols-12 gap-[1.5px] lg:gap-4">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={`col-${i}`}
                    className="text-center text-sm font-bold text-white"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Row Letters */}
              <div className="absolute -left-5 lg:-left-7 bottom-0 top-0 grid grid-rows-10 gap-[1.5px] lg:gap-4">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={`row-${i}`}
                    className="text-sm text-center text-white flex flex-col justify-center font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="w-full h-full grid grid-cols-12 grid-rows-10 gap-[1.5px] lg:gap-4">
                {seatData.seats.map((item, index) => {
                  const isSelected = selectedSeats.some(
                    (s) => s.seat_location === item.seat_location
                  );
                  const isDoubleSeat = item.seat_location[0] === "J";

                  const seatWithSeatName = {
                    ...item,
                    seat_name:
                      item.seat_type === 0
                        ? "ghe_thuong"
                        : item.seat_type === 1
                        ? "ghe_vip"
                        : "ghe_doi",
                  };

                  if (item.seat_status === 1) {
                    return (
                      <div
                        key={`${item.seat_location}-taken`}
                        className="col-span-1 row-span-1 bg-[repeating-linear-gradient(45deg,_#d9d9d9_0px,_#a6a6a6_10px,_#f0f0f0_10px,_#a6a6a6_20px)]"
                      ></div>
                    );
                  }

                  if (item.seat_status === 2) {
                    return (
                      <div
                        key={`${item.seat_location}-reserved`}
                        className="col-span-1 row-span-1 bg-[repeating-linear-gradient(to_bottom,_#e0e0e0_0px,_#b0b0b0_2px,_#8a8a8a_6px,_#e0e0e0_8px)]"
                      ></div>
                    );
                  }

                  if (isSelected) {
                    return (
                      <div
                        key={`${item.seat_location}-selected`}
                        onClick={() => {
                          if (!isDoubleSeat) {
                            setSelectedSeats(
                              selectedSeats.filter(
                                (s) => s.seat_location !== item.seat_location
                              )
                            );
                            setSeatTotalAmount(seatTotalAmount - item.price);
                          } else {
                            const pairIndex =
                              index % 2 === 0 ? index + 1 : index - 1;
                            const pairSeat = seatData.seats[pairIndex];
                            setSelectedSeats(
                              selectedSeats.filter(
                                (s) =>
                                  s.seat_location !== item.seat_location &&
                                  s.seat_location !== pairSeat?.seat_location
                              )
                            );
                            setSeatTotalAmount(
                              seatTotalAmount - item.price * 2
                            );
                          }
                        }}
                        className="col-span-1 row-span-1 bg-green-700"
                      ></div>
                    );
                  }

                  return (
                    <div
                      key={`${item.seat_location}-available`}
                      onClick={() => {
                        if (!isDoubleSeat) {
                          setSelectedSeats([
                            ...selectedSeats,
                            seatWithSeatName,
                          ]);
                          setSeatTotalAmount(seatTotalAmount + item.price);
                        } else {
                          const pairIndex =
                            index % 2 === 0 ? index + 1 : index - 1;
                          const pairSeat = seatData.seats[pairIndex];
                          if (pairSeat) {
                            setSelectedSeats([
                              ...selectedSeats,
                              seatWithSeatName,
                              {
                                ...pairSeat,
                                seat_name: "ghe_doi",
                              },
                            ]);
                            setSeatTotalAmount(
                              seatTotalAmount + item.price * 2
                            );
                          }
                        }
                      }}
                      className={`col-span-1 row-span-1 ${
                        item.seat_type === 0
                          ? "bg-[#FFFFFF]"
                          : item.seat_type === 1
                          ? "bg-[#FFDE5A]"
                          : "bg-[#3944E1]"
                      }`}
                    ></div>
                  );
                })}
              </div>
            </div>
            <div className="flex lg:flex-row flex-col gap-3 justify-between lg:w-[77%] w-full mt-5">
              <div className="flex flex-row items-center">
                <div className="bg-[repeating-linear-gradient(to_bottom,_#e0e0e0_0px,_#b0b0b0_2px,_#8a8a8a_6px,_#e0e0e0_8px)] w-[18px] h-[18px] mr-2"></div>
                <p className="text-white text-sm lg:text-xl">Reserved</p>
              </div>
              <div className="flex flex-row items-center">
                <div className="bg-[repeating-linear-gradient(45deg,_#d9d9d9_0px,_#a6a6a6_10px,_#f0f0f0_10px,_#a6a6a6_20px)] w-[18px] h-[18px] mr-2"></div>
                <p className="text-white text-sm lg:text-xl">Taken</p>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-6 md:px-10">
            {message && <AlertWithIcon type={"negative"} message={message} />}
            <div className="bg-[#606060] rounded-lg p-4">
              <p className="text-white text-xl lg:text-2xl font-medium mb-2">
                Cinema: {seatData.cinema_name}
              </p>
              <p className="text-white text-xl lg:text-2xl mb-1">
                Movie: {seatData.film_name}
              </p>
              <p className="text-white text-xl lg:text-2xl mb-1">
                Showtime: {seatData.show_time + " " + seatData.show_date}
              </p>
              <p className="text-white text-xl lg:text-2xl mb-1">
                Cinema room: {seatData.room_name}
              </p>
              <p className="text-white text-xl lg:text-2xl mb-1">
                Chosen seats:{" "}
                {selectedSeats.length !== 0
                  ? selectedSeats
                      .map((item, index) => {
                        return item.seat_location;
                      })
                      .join(", ")
                  : "None"}
              </p>
            </div>
          </div>
          <div className="py-7 px-4 sm:px-6 md:px-10">
            <div className="bg-[#606060] rounded-lg p-4">
              <p className="text-white text-xl lg:text-2xl font-light mb-2">
                Current total:
              </p>
              <p className="text-[#eaddf7] font-medium text-2xl lg:text-3xl">
                {numFormat.format(seatTotalAmount + popcornTotalAmount)}đ
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-4 justify-center mb-5">
            <Button
              variant="text"
              className="text-white lg:text-base"
              onClick={() => {
                navigate(`/movie/${createSlug(seatData.film_name)}`);
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
                if (seatTotalAmount === 0) {
                  setMessage("You need to select a seat or more to continue!");
                } else {
                  setNextStep();
                }
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function createSlug(name) {
  return name
    .trim()
    .replace(/\s*:\s*/g, "-") // Thay thế dấu ":" và các khoảng trắng trước và sau nó bằng dấu gạch ngang
    .replace(/\s+/g, "-") // Thay thế tất cả khoảng trắng còn lại bằng dấu gạch ngang
    .replace(/-+/g, "-"); // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang
}
