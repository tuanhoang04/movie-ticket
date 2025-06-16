import { useNavigate } from "react-router-dom";
import { useTicketContext } from "./BookingTicketProvider";
import { useEffect, useState } from "react";
import AlertWithIcon from "../Alert";
import { Button } from "@material-tailwind/react";

export default function BookingSelectPopcorn({ setNextStep, setPrevStep }) {
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

  const popcornData = data.popcornData;
  const popcornLength = popcornData.length;
  const numFormat = new Intl.NumberFormat("de-DE");
  const [message, setMessage] = useState("");

  const updatePopcornQuantity = (id, change) => {
    setSelectedCombos((prev) => {
      const currentQuantity = prev[id]?.quantity || 0;
      const newQuantity = currentQuantity + change;

      if (newQuantity < 0) return prev;

      const popcornInfo = popcornData.find((c) => c.combo_id === id);
      if (!popcornInfo) return prev;

      if (newQuantity === 0) {
        const { [id]: remove, ...rest } = prev;
        return rest;
      }

      //   console.log({
      //     ...prev,
      //     [id]: {
      //       quantity: newQuantity,
      //       price: popcornInfo.combo_price,
      //       combo_name: popcornInfo.combo_name,
      //     },
      //   });
      return {
        ...prev,
        [id]: {
          quantity: newQuantity,
          price: popcornInfo.combo_price,
          combo_name: popcornInfo.combo_name,
        },
      };
    });
  };

  useEffect(() => {
    let total = 0;
    for (const combo of Object.values(selectedCombos)) {
      total += combo.quantity * combo.price;
      console.log(total);
    }
    setPopcornTotalAmount(total);
  }, [selectedCombos]);

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
          <img src="/icons/shopping-white.png" className="w-9 mb-[4px]" />
          <p className="hidden text-white lg:block font-medium text-lg">
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

      <div className="py-6 px-4 sm:px-6 md:px-10">
        {message && <AlertWithIcon type={"negative"} message={message} />}
        <div className={`grid grid-cols-12 grid-rows-${popcornLength + 1}`}>
          <div className="bg-[#606060] rounded-t-lg col-span-12 row-span-1 grid grid-cols-12 grid-rows-1 border-gray-700 border-t-2 border-l-2 border-r-2">
            <div className="col-span-5 lg:col-span-8 flex flex-row items-center row-span-1 ml-8 py-5">
              <p className="text-white text-base lg:text-xl font-light">
                Snack name
              </p>
            </div>
            <div className="col-span-4 lg:col-span-2 row-span-1 flex items-center justify-center border-l-[1px] border-r-[1px] border-gray-600 py-5">
              <p className="text-white  text-base lg:text-xl font-light">
                Price
              </p>
            </div>
            <div className="col-span-3 lg:col-span-2 row-span-1 flex items-center justify-center py-5">
              <p className="text-white text-base lg:text-xl font-light">
                Quantity
              </p>
            </div>
          </div>

          {popcornData.map((item, index) => {
            return (
              <div
                key={index}
                className="col-span-12 row-span-1 grid grid-cols-12 grid-rows-1 border-gray-700 border-l-[1px] border-r-[1px] border-b-[1px]"
              >
                <div className="col-span-5 lg:col-span-8 flex flex-row items-center row-span-1 ml-8 py-5">
                  <p className="text-white text-base lg:text-xl font-light">
                    {item.combo_name}
                  </p>
                </div>
                <div className="col-span-4 lg:col-span-2 row-span-1 border-l-[1px] border-r-[1px] border-gray-700 flex items-center justify-center py-5">
                  <p className="text-white text-base lg:text-xl font-light">
                    {numFormat.format(parseInt(item.combo_price)) + "đ"}
                  </p>
                </div>
                <div className="col-span-3 lg:col-span-2 row-span-1 flex items-center justify-center py-5">
                  <div className="flex flex-row w-full justify-around items-center">
                    {/* <Button
                      size="sm"
                      variant="outlined"
                      color="white"
                      className="text-sm rounded-full p-1"
                      onClick={() => {
                        updatePopcornQuantity(item.combo_id, -1);
                      }}
                    >
                      -
                    </Button> */}
                    <img
                      className="w-5 h-5 lg:w-10 lg:h-10 cursor-pointer"
                      src="/icons/minus.png"
                      onClick={() => {
                        updatePopcornQuantity(item.combo_id, -1);
                      }}
                    />
                    <span className="text-sm lg:text-xl font-medium text-white">
                      {selectedCombos[item.combo_id]?.quantity || 0}
                    </span>
                    <img
                      className="w-5 h-5 lg:w-10 lg:h-10 cursor-pointer"
                      src="/icons/plus.png"
                      onClick={() => {
                        updatePopcornQuantity(item.combo_id, 1);
                      }}
                    />

                    {/* <Button
                      size="sm"
                      variant="outlined"
                      color="white"
                      className="text-sm rounded-full"
                      onClick={() => {
                        updatePopcornQuantity(item.combo_id, 1);
                      }}
                    >
                      +
                    </Button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="py-2 px-4 sm:px-6 md:px-10">
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
            setPrevStep();
          }}
        >
          Go Back
        </Button>
        <Button
          variant="filled"
          color="purple"
          className={`text-white lg:text-base ${
            seatTotalAmount > 0 ? "bg-[#7b427b]" : "bg-[#6d5e71]"
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
