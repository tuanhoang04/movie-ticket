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
          console.log(data);
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
    <div className="bg-[#606060] my-5 p-8 rounded-2xl lg:w-[35%] w-[75%] self-start flex flex-col">
      <p className="text-white text-2xl mb-1">
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
        className="[&>span>svg]:w-9 [&>span>svg]:h-9 [&>span>svg]:transition-all mb-2"
      />
      <Textarea
        placeholder="Add your comment..."
        onChange={(e) => {
          textChange(e);
        }}
        size="lg"
        rows={7}
        className="border-none after:border-none before:border-none !rounded-xl !text-lg bg-white placeholder:text-black placeholder:text-lg placeholder:opacity-100 focus:placeholder-opacity-0 mb-2"
      />

      <div className="self-end">
        <Button
          variant="text"
          onClick={handleOpen}
          className="text-white text-base w-auto mr-3"
        >
          Cancel
        </Button>
        <Button
          color="purple"
          className="text-white bg-[#b152b1] text-base w-auto"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
