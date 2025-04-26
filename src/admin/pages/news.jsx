import { Helmet } from "react-helmet-async";
import { NewsView } from "../sections/news/view";

export default function NewsPage() {
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Manage Posts | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <NewsView />
    </>
  );
}
