import { Helmet } from "react-helmet-async";
import { OrderDetailsView } from "../sections/order/view";
import { useParams } from "react-router-dom";

export default function OrderDetailsPage() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Order Details | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <OrderDetailsView orderId={id} />
    </>
  );
}
