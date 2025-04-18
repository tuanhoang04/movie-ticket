import { useState } from "react";
import Footer from "../Footer";
import NavBar from "../NavBar";
import BookingTicketProvider from "./BookingTicketProvider";
import BookingSelectSeats from "./BookingSelectSeats";
export default function BookingTicket(){
    const [step, setStep] = useState(0); // 0: Select seats, 1: Buy popcorn, 2: Payment, 3: Ticket details
    const nextStep = () => {
      setStep((prevStep) => Math.min(prevStep + 1, 3)); // upper limit is 3
    };

    const prevStep = () => {
      setStep((prevStep) => Math.max(prevStep - 1, 0)); // bottom limit is 0;
    };
    return (
      <BookingTicketProvider>
        <div className="bg-[#1C1B21] min-h-screen flex flex-col">
          <NavBar />
          <div className="flex flex-grow px-8 lg:px-36">
            <BookingSelectSeats />
          </div>
          <Footer />
        </div>
      </BookingTicketProvider>
    );
}