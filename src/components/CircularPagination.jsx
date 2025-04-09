import {useState} from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function CircularPagination({ pagesNumber, handleChange, currentPage }) {
  const getItemProps = (index) => ({
    variant: currentPage === index ? "filled" : "text",
    color: "white",
    onClick: () => {
      handleChange(index);
    },
    className: "rounded-full",
  });

  const next = () => {
    if (currentPage < pagesNumber) {
      handleChange(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      handleChange(currentPage - 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-3">
      <Button
        variant="text"
        className="flex items-center gap-2 rounded-full text-white text-base"
        onClick={prev}
        disabled={currentPage === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" color="white" />
        Previous
      </Button>
      <div className="flex items-center gap-2">
        {Array.from({ length: pagesNumber }, (_, i) => (
          <IconButton key={i + 1} {...getItemProps(i + 1)}>
            {i + 1}
          </IconButton>
        ))}
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2 rounded-full text-white text-base"
        onClick={next}
        disabled={currentPage === pagesNumber}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" color="white" />
      </Button>
    </div>
  );
}