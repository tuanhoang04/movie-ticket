import { Helmet } from "react-helmet-async";
import { EditUserView } from "../sections/user/view";
import { useParams } from "react-router-dom";

// ----------------------------------------------------------------------
export default function EditUserPage() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Edit User Information | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <EditUserView userId={id} />
    </>
  );
}
