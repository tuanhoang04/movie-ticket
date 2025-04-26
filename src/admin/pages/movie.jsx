import { Helmet } from "react-helmet-async";
import { MovieView } from "../sections/movie/view";

// ----------------------------------------------------------------------
export default function MoviePage() {
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Manage Movies | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <MovieView />
    </>
  );
}
