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
  const [message, setMessage] = useState("");
  useEffect(()=>{
    if(seatTotalAmount>0){
      setMessage("");
    }
  },[seatTotalAmount]);

  const seatData = data.seatData;
  // console.log(seatData);
  // console.log(data);
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
      {seatData && (
        <div className="flex flex-col">
          <div className="w-[38%] py-6 px-10 self-center my-9 rounded-2xl flex flex-col items-center justify-center bg-[#232323]">
            <div className="flex flex-row justify-between w-[77%] mb-5">
              <div className="flex flex-row items-center">
                <div className="bg-[#FFFFFF] w-[18px] h-[18px] mr-3"></div>
                <p className="text-white text-xl">Normal Seat</p>
              </div>
              <div className="flex flex-row items-center">
                <div className="bg-[#FFDE5A] w-[18px] h-[18px] mr-3"></div>
                <p className="text-white text-xl">VIP Seat</p>
              </div>
              <div className="flex flex-row items-center">
                <div className="bg-[#3944E1] w-[18px] h-[18px] mr-3"></div>
                <p className="text-white text-xl">Double Seat</p>
              </div>
            </div>
            <p className="text-white text-4xl mb-2">Screen</p>
            <div className="bg-white w-[50%] h-[5px] mb-12"></div>
            <div className="relative ml-7 w-full aspect-[12/10]">
              {/* Column Numbers */}
              <div className="absolute -top-7 left-0 right-0 grid grid-cols-12 gap-4">
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
              <div className="absolute -left-7 bottom-0 top-0 grid grid-rows-10 gap-4">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={`row-${i}`}
                    className="text-sm text-center text-white flex flex-col justify-center font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="w-full h-full grid grid-cols-12 grid-rows-10 gap-4">
                {seatData.seats.map((item, index) => {
                  const isSelected = selectedSeats.includes(item.seat_location);
                  const isDoubleSeat = item.seat_location[0] === "J";

                  // Taken seats
                  if (item.seat_status === 1) {
                    return (
                      <div
                        key={`${item.seat_location}-taken`}
                        className="col-span-1 row-span-1 bg-[repeating-linear-gradient(45deg,_#ccc_0px,_#4c4b4d_10px,_#eee_10px,_#4c4b4d_20px)]"
                      ></div>
                    );
                  }

                  // Reserved seats
                  if (item.seat_status === 2) {
                    return (
                      <div
                        key={`${item.seat_location}-reserved`}
                        className="col-span-1 row-span-1 bg-[repeating-linear-gradient(to_bottom,_#ccc_0px,_#999999_0px,_#4c4b4d_7px,_#eee_7px)]"
                      ></div>
                    );
                  }

                  // Selected seat
                  if (isSelected) {
                    return (
                      <div
                        key={`${item.seat_location}-selected`}
                        onClick={() => {
                          if (!isDoubleSeat) {
                            setSelectedSeats(
                              selectedSeats.filter(
                                (s) => s !== item.seat_location
                              )
                            );
                            setSeatTotalAmount(seatTotalAmount - item.price);
                          } else {
                            const pairIndex =
                              index % 2 === 0 ? index + 1 : index - 1;
                            const pairSeat =
                              seatData.seats[pairIndex]?.seat_location;
                            setSelectedSeats(
                              selectedSeats.filter(
                                (s) =>
                                  s !== item.seat_location && s !== pairSeat
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

                  // Available but not selected
                  return (
                    <div
                      key={`${item.seat_location}-available`}
                      onClick={() => {
                        if (!isDoubleSeat) {
                          setSelectedSeats([
                            ...selectedSeats,
                            item.seat_location,
                          ]);
                          setSeatTotalAmount(seatTotalAmount + item.price);
                        } else {
                          const pairIndex =
                            index % 2 === 0 ? index + 1 : index - 1;
                          const pairSeat =
                            seatData.seats[pairIndex]?.seat_location;
                          if (pairSeat) {
                            setSelectedSeats([
                              ...selectedSeats,
                              item.seat_location,
                              pairSeat,
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
            <div className="flex flex-row justify-between w-[55%] mt-5">
              <div className="flex flex-row items-center">
                <div className="bg-[repeating-linear-gradient(to_bottom,_#ccc_0px,_#999999_0px,_#4c4b4d_7px,_#eee_7px)] w-[20px] h-[20px] mr-3"></div>
                <p className="text-white text-xl">Reserved</p>
              </div>
              <div className="flex flex-row items-center">
                <div className="bg-[repeating-linear-gradient(45deg,_#ccc_0px,_#4c4b4d_10px,_#eee_10px,_#4c4b4d_20px)] w-[20px] h-[20px] mr-3"></div>
                <p className="text-white text-xl">Taken</p>
              </div>
            </div>
          </div>
          <div className="py-6 px-20">
            {message && <AlertWithIcon message={message} />}
            <div className="bg-[#606060] rounded-lg p-4">
              <p className="text-white text-2xl font-light mb-2">
                Cinema: {seatData.cinema_name}
              </p>
              <p className="text-white text-xl mb-1">
                Movie: '{seatData.film_name}'
              </p>
              <p className="text-white text-xl">
                Cinema room: {seatData.room_name}
              </p>
            </div>
          </div>
          <div className="pb-6 px-20">
            <div className="bg-[#606060] rounded-lg p-4">
              <p className="text-white text-2xl font-light mb-2">
                Current total:
              </p>
              <p className="text-white text-xl">{data.seatTotalAmount} VND</p>
            </div>
          </div>

          <div className="flex flex-row gap-4 justify-center mb-5">
            <Button
              variant="text"
              className="text-white text-base"
              onClick={() => {
                navigate(`/movie/${createSlug(seatData.film_name)}`);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color="purple"
              className={`text-white text-base ${
                seatTotalAmount > 0 ? "bg-[#875CFF]" : "bg-[#6d5e71]"
              } rounded-lg`}
              onClick={() => {
                if (seatTotalAmount === 0) {
                  setMessage("You need to select a seat or more to continue!");
                }
                else{
                  setNextStep(1);
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
