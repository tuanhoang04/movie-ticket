export default function FirstScreen() {
  return (
    <>
      <div className="grid grid-cols-7 bg-[#1C1B21]">
        <div className="col-span-3 flex flex-col justify-center items-center h-screen">
          <div>
            <p className="text-7xl text-white font-bold">Movie Ticket</p>
            <p className="text-7xl text-white font-bold mb-5">Order App</p>
            <button className=" border focus:outline-none focus:ring-4 font-medium text-2xl flex items-center rounded-full px-6 py-3 me-2 mb-2 bg-[#1A191F] text-white border-gray-600 hover:bg-gray-800 hover:border-gray-600 focus:ring-gray-700">
              <img src="/icons/star.png" className="h-6 w-auto pr-2" />
              <p>Explore</p>
            </button>
          </div>
        </div>
        <div className="col-span-4 flex justify-end items-end overflow-hidden">
          <div class="relative flex justify-center items-center">
            <div class="absolute w-[865px] h-[390px] bg-[#2E1239] rounded-full blur-[120px] opacity-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 rotate-[-141.1deg] z-0"></div>

            <div class="absolute w-[530px] h-[410px] bg-[#11CEDA] rounded-full blur-[180px] opacity-60 bottom-[-100px] left-1/2 transform -translate-x-1/2 z-1"></div>

            <div class="relative z-2">  
              <img
                src="/popcorn.png"
                width="600"
                height="600"
                alt="popcorn image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
