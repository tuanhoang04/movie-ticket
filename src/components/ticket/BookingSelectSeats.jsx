import { useTicketContext } from "./BookingTicketProvider";

export default function BookingSelectSeats() {
  const data = useTicketContext();
  const seatData = data.seatData;
  console.log(seatData);
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
        <div className="flex justify-center">
          <div className="w-[38%] p-7 rounded-2xl flex flex-col items-center justify-center bg-[#232323]">
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
            <div className="bg-white w-[50%] h-[5px] mb-8"></div>
            <div className=" w-full aspect-[12/10] grid grid-cols-12 grid-rows-10 gap-4">
              {seatData.seats.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={()=>{console.log(item.seat_location)}}
                    className={`col-span-1 row-span-1  ${
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
        </div>
      )}
    </div>
  );
}
