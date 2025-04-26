import { Helmet } from "react-helmet-async";
import { EditShowtimeView } from "../sections/showtime/view";
import { useParams } from "react-router-dom";

// ----------------------------------------------------------------------
export default function EditShowtimePage() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Edit Showtime Information | Admin Page for NHTT Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <EditShowtimeView showtimeId={id} />
    </>
  );
}
