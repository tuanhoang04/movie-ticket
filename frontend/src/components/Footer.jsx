import { Typography } from "@material-tailwind/react";
export default function Footer() {
  return (
    <footer className="bg-[#1C1B21] grid grid-cols-11 px-8 lg:px-36 py-12">
      <div className="lg:col-span-4 col-span-11 flex flex-col justify-start">
        <div className="flex flex-row items-center mb-5">
          <img src="/ico.png" className="w-10 mr-3" />
          <p className="text-white font-medium text-2xl lg:text-3xl">
            Starlight Cinema
          </p>
        </div>
        <p className="text-[#8da1c5] font-normal text-lg lg:text-xl">
          Starlight Cinema Co., Ltd.
        </p>
        <p className="text-[#8da1c5] font-normal text-lg lg:text-xl">
          Business Registration Number: 0123456789
        </p>
        <p className="text-[#8da1c5] font-normal text-lg lg:text-xl mb-5">
          Address: Goldsilk Complex, 430 Cau Am, Van Phuc, Ha Dong, Hanoi,
          Vietnam
        </p>
        {/* <p className="lg:block lg:text-xl text-[#8da1c5] font-normal hidden">
          Grab your tickets now and dive into an unforgettable cinematic
          adventure! Whether you crave heart-pounding drama or laugh-out-loud
          comedy, the perfect movie awaits!
        </p> */}
      </div>

      <div className="lg:col-span-3 col-span-11 lg:flex flex-col lg:items-center hidden">
        <div className="flex flex-col gap-[2px]">
          <div className="lg:flex lg:flex-row mb-5 lg:invisible hidden">
            <img src="/ico.png" className="w-10 mr-3" />
            <p className="text-white font-medium text-3xl">S</p>
          </div>
          <p className="text-white font-medium text-xl inline-flex mb-4">
            NAVIGATION
          </p>
          <a
            href="/home"
            className="text-[#8da1c5] font-light text-xl inline-flex hover:text-purple-400 mb-1"
          >
            Homepage
          </a>
          <a
            href="/movie/filter"
            className="text-[#8da1c5] font-light text-xl inline-flex hover:text-purple-400 mb-1"
          >
            Movies
          </a>
          <a
            href="/theater-movie"
            className="text-[#8da1c5] font-light text-xl inline-flex hover:text-purple-400 mb-1"
          >
            Buy Tickets
          </a>
          <a
            href="/theaters"
            className="text-[#8da1c5] font-light text-xl inline-flex hover:text-purple-400 mb-1"
          >
            Cinemas
          </a>
          <a
            href="/news"
            className="text-[#8da1c5] font-light text-xl inline-flex hover:text-purple-400 mb-5 mb-1"
          >
            News
          </a>
        </div>
      </div>
      <div className="lg:col-span-4 col-span-11 flex lg:justify-end">
        <div className="flex flex-col">
          <div className="lg:flex lg:flex-row mb-5 lg:invisible hidden">
            <img src="/ico.png" className="w-10 mr-3" />
            <p className="text-white font-medium text-3xl">S</p>
          </div>
          <p className="text-white font-medium text-xl mb-2">
            OFFICIAL PARTNERS
          </p>
          <div className="flex flex-row flex-wrap gap-3 mb-7">
            <img
              src="/beta.png"
              className="lg:w-12 lg:h-12 w-9 h-9 rounded-full"
            />
            <img
              src="/lotte.png"
              className="lg:w-12 lg:h-12 w-9 h-9 rounded-full"
            />
            <img
              src="/cgv.jpg"
              className="lg:w-12 lg:h-12 w-9 h-9 rounded-full"
            />
            <img
              src="/momo.png"
              className="lg:w-12 lg:h-12 w-9 h-9 rounded-full"
            />
          </div>
          <p className="text-white font-medium text-xl mb-2">CONTACT US</p>
          <p
            href="#"
            className="text-[#8da1c5] text-base lg:text-xl font-light"
          >
            starlightsupport@starlight.com
          </p>
          <p
            href="#"
            className="text-[#8da1c5] text-base lg:text-xl font-light"
          >
            +84 919 162 299
          </p>
        </div>
      </div>
    </footer>
  );
}
