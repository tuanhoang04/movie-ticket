import { createContext, useContext, useEffect, useState } from "react";

const TicketContext = createContext();
export default function BookingTicketProvider({ children }) {
  const showtime_id = localStorage.getItem("showtime_id");
  const [seatData, setSeatData] = useState(null);
  const [seatLoading, setSeatLoading] = useState(true);

  const [popcornData, setPopcornData] = useState(null);
  const [popcornLoading, setPopcornLoading] = useState(true);

  const [seatTotalAmount, setSeatTotalAmount] = useState(0);
  const [popcornTotalAmount, setPopcornTotalAmount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  if (showtime_id === null) {
    return <div>Not found.</div>;
  }

  const fetchSeatData = () => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/muaVe/showtime_id=${showtime_id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSeatData(data);
        setSeatLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching seat data:", error);
        setSeatLoading(false);
      });
  };
  const fetchPopcornData = () => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/muaVe/popcornInfo`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPopcornData(data);
        setPopcornLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching seat data:", error);
      });
  };

  useEffect(() => {
    fetchSeatData();
    fetchPopcornData();
  }, [showtime_id]);

  return (
    seatData &&
    popcornData && (
      <TicketContext.Provider
        value={{
          showtime_id,
          seatTotalAmount,
          setSeatTotalAmount,
          popcornTotalAmount,
          setPopcornTotalAmount,
          selectedSeats,
          setSelectedSeats,
          selectedCombos,
          setSelectedCombos,
          seatData,
          setSeatData,
          popcornData,
          setPopcornData,
        }}
      >
        {children}
      </TicketContext.Provider>
    )
  );
}

export function useTicketContext() {
  return useContext(TicketContext);
}
