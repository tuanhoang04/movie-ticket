import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  // Theo dõi vị trí cuộn
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    visible && (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          type="button" // RẤT QUAN TRỌNG nếu dùng trong form
          onClick={scrollToTop}
          className=" p-3 rounded-2xl flex flex-col items-center gap-3 w-20  bg-blue-500 hover:bg-blue-700 shadow-lg"
        >
          <ArrowUpIcon className="h-6 w-6 text-white" />
          Scroll to top
        </Button>
      </div>
    )
  );
};

export default BackToTopButton;
