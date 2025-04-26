import { Helmet } from "react-helmet-async";
import { NotFoundView } from "../sections/error";

// ----------------------------------------------------- -----------------
export default function ErrorPage() {
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Page Not Found! | Error Page of the Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
