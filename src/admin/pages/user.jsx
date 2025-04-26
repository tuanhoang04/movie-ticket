import { Helmet } from "react-helmet-async";
import { UserView } from "../sections/user/view";

// ----------------------------------------------------------------------
export default function UserPage() {
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`User Management | Admin Page for Starlight Movie Ticket Booking Website`}
        </title>
      </Helmet>

      <UserView />
    </>
  );
}
