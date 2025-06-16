import { Helmet } from "react-helmet-async";
import { CreateCinemaView } from "../sections/cinema/view";

// ----------------------------------------------------------------------
export default function CreateCinemaPage() {
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Create Cinema | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <CreateCinemaView />
    </>
  );
}
