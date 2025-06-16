import { Helmet } from "react-helmet-async";
import { ShowtimeView } from "../sections/showtime/view";

// ----------------------------------------------------------------------
export default function ShowtimePage() {
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Manage Showtimes | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <ShowtimeView />
    </>
  );
}
