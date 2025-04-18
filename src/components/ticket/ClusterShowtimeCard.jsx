import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const sample = {
  "Beta Cinemas": {
    "Beta Thanh Xuân": {
      address:
        "Tầng hầm B1, tòa nhà Golden West, Số 2, Lê Văn Thiêm, Thanh Xuân, Hà Nội",
      show_time: [
        {
          show_time: "07:30:00",
          showtime_id: 73,
          seatPrice: 45000,
        },
      ],
    },
  },
};

function createSlug(name) {
  return name
    .trim()
    .replace(/\s*:\s*/g, "-") // Thay thế dấu ":" và các khoảng trắng trước và sau nó bằng dấu gạch ngang
    .replace(/\s+/g, "-") // Thay thế tất cả khoảng trắng còn lại bằng dấu gạch ngang
    .replace(/-+/g, "-"); // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang
}

export default function ClusterShowtimeCard({ data, movieName }) {
  const navigate = useNavigate();
  let iconSrc = "";
  const theater = Object.keys(data)[0];
  if (theater === "Beta Cinemas" || theater === "Cinemax") {
    iconSrc = "/beta.png";
  } else if (theater === "CGV Cinemas") {
    iconSrc = "/cgv.jpg";
  } else if (theater === "Lotte Cinemas") {
    iconSrc = "/lotte.png";
  } else if (theater === "Cinestar") {
    iconSrc = "/cinestar.png";
  } else if (theater === "Mega GS Cinemas") {
    iconSrc = "/megags.png";
  } else if (theater === "Dcine") {
    iconSrc = "/dcine.png";
  } else if (theater === "Starlight") {
    iconSrc = "/starlight.png";
  } else if (theater === "Rio Cinemas") {
    iconSrc = "/riocinema.png";
  } else if (theater === "Touch Cinema") {
    iconSrc = "/touchcinema.webp";
  } else if (theater === "Đống Đa Cinema") {
    iconSrc = "/dongda.png";
  }

  const handleSelectShowtime = (showtime_id) => {
    localStorage.setItem("showtime_id", showtime_id);
    navigate(`/movie/bookTicket/${createSlug(movieName)}`);
  };

  const allSubCinemas = Object.keys(data[theater]);
  return (
    <div className="bg-[#606060] rounded-lg mb-8">
      <div className="flex flex-row gap-2 items-center p-2 rounded-t-lg bg-[#65438d]">
        <img src={iconSrc} className="w-8 rounded-full" />
        <p className="text-white text-2xl font-light">{theater}</p>
      </div>

      <div className="flex flex-row gap-2 p-2">
        <img src="/riocinema.png" className="invisible w-8 rounded-full" />
        <div>
          {allSubCinemas.map((item, index) => {
            return (
              <div className="pb-3" key={index}>
                <p className="text-white font-light text-xl">{item}</p>
                <p className="text-white text-xl font-medium">
                  {data[theater][item].address}
                </p>
                {data[theater][item].show_time.map((item, index) => {
                  return (
                    <Button
                      key={index}
                      className="text-gray-400 bg-black w-fit py-1 text-base px-2 mr-2 mt-1 rounded-xl"
                      onClick={() => {
                        handleSelectShowtime(item.showtime_id);
                      }}
                    >
                      {formatTimeToAMPM(item.show_time)}
                    </Button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatTimeToAMPM(timeStr) {
  const [hourStr, minute] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12; // convert to 12-hour format, 0 becomes 12

  return `${hour}:${minute} ${ampm}`;
}
