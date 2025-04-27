import {
  Button,
  Input,
  rating,
  Rating,
  Textarea,
} from "@material-tailwind/react";
import { useRef, useState } from "react";
import AlertWithIcon from "../Alert";

export default function RatingForm({ handleOpen, handleOpenSignIn }) {
  const [ratingData, setRatingData] = useState({
    film_id: localStorage.getItem("film_id"),
    comments: "",
    star: 0,
    jwt: localStorage.getItem("jwt"),
  });

  const ratingRef = useRef(null);
  const [okMessage, setOkMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [comment, setComment] = useState(null);
  const [stars, setStars] = useState(0);

  const textChange = (e) => {
    setComment(e.target.value);
    setRatingData((prev) => ({ ...prev, comments: e.target.value }));
  };

  const starChange = (value) => {
    setStars(value);
    setRatingData((prev) => ({ ...prev, star: value }));
  };

  const handleSubmit = async () => {
    if (!comment || !comment.trim() || !stars || stars === 0) {
      setErrorMessage(
        "Your rating is invalid, a rating must consist of at least one star and some text comment!"
      );
    } else if (stars && stars > 0 && comment.trim()) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/film/filmInfo/postComment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ratingData),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.message === "User not logged in") {
            setErrorMessage("You must sign in to continue!");
            handleOpenSignIn();
          } else if (data.success) {
            setErrorMessage("");
            setOkMessage("You have rated this movie successfully!");
            setTimeout(() => window.location.reload(), 2000);
          } else {
            setErrorMessage("You can rate a movie only one time!");
          }
        } else {
          console.error("Internal error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.log(stars);
      console.log(comment);
    }
  };

  return (
    <div className="bg-[#606060] my-6 lg:p-6 p-4 rounded-xl w-full self-start flex flex-col shadow-lg border border-[#707070]">
      <p className="text-white text-xl mb-4 font-semibold tracking-normal">
        Share your experience watching this movie
      </p>
      {okMessage && <AlertWithIcon type={"positive"} message={okMessage} />}
      {errorMessage && (
        <AlertWithIcon type={"negative"} message={errorMessage} />
      )}
      <Rating
        onChange={(value) => {
          starChange(value);
        }}
        unratedColor="white"
        ratedColor="yellow"
        className="[&>span>svg]:w-8 [&>span>svg]:h-8 [&>span>svg]:transition-all [&>span>svg]:hover:scale-110 mb-4"
      />
      <Textarea
        placeholder="Add your comment..."
        onChange={(e) => {
          textChange(e);
        }}
        size="lg"
        rows={5}
        className="border-none after:border-none before:border-none !rounded-lg !text-base bg-white text-black placeholder:text-black placeholder:text-base placeholder:opacity-100 focus:placeholder-opacity-50 focus:ring-2 focus:ring-[#b152b1] mb-4 transition-all"
      />

      <div className="self-end flex gap-3">
        <Button
          variant="text"
          onClick={handleOpen}
          className="text-white text-sm w-auto hover:text-gray-300 transition-colors"
        >
          Cancel
        </Button>
        <Button
          color="purple"
          className="text-white bg-gradient-to-r from-[#b152b1] to-[#d67ed6] text-sm w-auto px-4 py-2 rounded-lg hover:from-[#9f46a0] hover:to-[#c571c5] transition-all shadow-md"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}