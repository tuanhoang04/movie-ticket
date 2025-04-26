import { Helmet } from "react-helmet-async";
import { CreateMovieView } from "../sections/movie/view";

// ----------------------------------------------------------------------
export default function CreateMoviePage() {
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Create Movie | Admin Page for NHTT Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <CreateMovieView />
    </>
  );
}
