import { Helmet } from "react-helmet-async";
import { CreateShowtimeView } from "../sections/showtime/view";

// ----------------------------------------------------------------------
export default function CreateShowtimePage() {
  return (
    <>
      <Helmet>
        <title>
          {`Create Screening | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <CreateShowtimeView />
    </>
  );
}
