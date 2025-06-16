import { Helmet } from "react-helmet-async";
import { CinemaView } from "../sections/cinema/view";

// ----------------------------------------------------------------------
export default function CinemaPage() {
  return (
    <>
      <Helmet>
        <title>
          {`Cinema Management | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <CinemaView />
    </>
  );
}
