import { Typography } from "@material-tailwind/react";
export default function Footer() {
  return (
    <footer className="bg-[#1C1B21] grid grid-cols-10 px-12 py-12">
      <div className="col-span-5 flex flex-col justify-start">
        <div className="flex flex-row items-center mb-5">
          <img src="/ico.png" className="w-10 mr-1" />
          <Typography
            as="a"
            href="#"
            variant="h3"
            className="mr-4 cursor-pointer py-1.5 font-medium text-white"
          >
            Starlight Cinema
          </Typography>
        </div>
        <p className="text-[#5D6A81] font-normal text-xl">
          Starlight Cinema Co., Ltd.
        </p>
        <p className="text-[#5D6A81] font-normal text-xl">
          Business Registration Number: 0123456789
        </p>
        <p className="text-[#5D6A81] font-normal text-xl mb-5">
          Address: Goldsilk Complex, 430 Cau Am, Van Phuc, Ha Dong, Hanoi,
          Vietnam
        </p>
        <p className="text-[#5D6A81] font-normal text-xl">
          Grab your tickets now and dive into an unforgettable cinematic
          adventure! Whether you crave heart-pounding drama or
          laugh-out-loudcomedy, the perfect movie awaits!
        </p>
      </div>

      <div className="col-span-2 flex flex-col items-center">
        <div className="flex flex-col">
          <Typography
            as="a"
            href="#"
            variant="h3"
            className="mr-4 cursor-pointer py-1.5 font-medium text-white invisible"
          >
            Star
          </Typography>
          <p className="text-white font-medium text-xl inline-flex mb-2 mt-5">
            NAVIGATION
          </p>
          <a
            href="#"
            className="text-[#7f92b3] font-light text-xl inline-flex hover:text-purple-400"
          >
            Homepage
          </a>
          <a
            href="#"
            className="text-[#7f92b3] font-light text-xl inline-flex hover:text-purple-400"
          >
            Buy Tickets
          </a>
          <a
            href="#"
            className="text-[#7f92b3] font-light text-xl inline-flex hover:text-purple-400"
          >
            Theaters
          </a>
          <a
            href="#"
            className="text-[#7f92b3] font-light text-xl inline-flex hover:text-purple-400"
          >
            News
          </a>
        </div>
      </div>
      <div className="col-span-3 flex justify-end">
        <div className="flex flex-col">
          <Typography
            as="a"
            href="#"
            variant="h3"
            className="mr-4 cursor-pointer py-1.5 font-medium text-white invisible"
          >
            Star
          </Typography>
          <p className="text-white font-medium text-xl inline-flex mb-2  mt-5">
            OFFICIAL PARTNERS
          </p>
          <div className="flex flex-row flex-wrap gap-3 mb-7">
            <img src="/beta.png" className="w-12 h-12 rounded-full" />
            <img src="/lotte.png" className="w-12 h-12 rounded-full" />
            <img src="/cgv.jpg" className="w-12 h-12 rounded-full" />
            <img src="/momo.png" className="w-12 h-12 rounded-full" />
          </div>
          <p className="text-white font-medium text-xl inline-flex mb-2">
            CONTACT US
          </p>
          <p href="#" className="text-[#7f92b3] font-light text-xl inline-flex">
            starlightsupport@starlight.com
          </p>
          <p href="#" className="text-[#7f92b3] font-light text-xl inline-flex">
            +84 919 162 299
          </p>
        </div>
      </div>
    </footer>
  );
}
