import { Helmet } from "react-helmet-async";
import { EditMovieView } from "../sections/movie/view";
import { useParams } from "react-router-dom";

// ----------------------------------------------------------------------
export default function EditMoviePage() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Edit Movie Information | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <EditMovieView movieId={id} />
    </>
  );
}
