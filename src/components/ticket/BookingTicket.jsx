import BookingTicketProvider from "./BookingTicketProvider";
export default function BookingTicket(){
    const [step, setStep] = useState(0); // 0: Select seats, 1: Buy popcorn, 2: Payment, 3: Ticket details
    const nextStep = () => {
      setStep((prevStep) => Math.min(prevStep + 1, 3)); // upper limit is 3
    };

    const prevStep = () => {
      setStep((prevStep) => Math.max(prevStep - 1, 0)); // bottom limit is 0;
    };
    return (<BookingTicketProvider>

        
    </BookingTicketProvider>);
}