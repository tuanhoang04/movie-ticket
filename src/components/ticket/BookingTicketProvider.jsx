import { createContext, useContext, useState } from "react";

const TicketContext = createContext();
export default function BookingTicketProvider({children}) {
  const [seatData, setSeatData] = useState(null);
  const [seatLoading, setSeatLoading] = useState(true);

  const [popcornData, setPopcornData] = useState(null);
  const [popcornLoading, setPopcornLoading] = useState(true);

  

  const fetchSeatData = async () => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/muaVe/showtime_id=${showtime_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        setSeatData(responseData);
        setSeatLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching seat data:", error);
        setSeatLoading(false);
      });
  };

  const fetchPopcornData = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/muaVe/popcornInfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setPopcornData(responseData);
        setSeatLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching popcorn data:", error);
        setPopcornLoading(false);
      });
  };

  useEffect(() => {
    // Fetch seat data
  }, [showtime_id]);

  return (
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
  );
}

export function useTicketContext() {
  return useContext(TicketContext);
}
