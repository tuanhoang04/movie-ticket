import { Helmet } from "react-helmet-async";
import { EditCinemaView } from "../sections/cinema/view";
import { useParams } from "react-router-dom";

export default function EditCinemaPage() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Edit Cinema Information | Starlight Movie Admin Panel`}
        </title>
      </Helmet>

      <EditCinemaView cinemaId={id} />
    </>
  );
}
