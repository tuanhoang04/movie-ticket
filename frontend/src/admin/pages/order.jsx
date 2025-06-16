import { Helmet } from "react-helmet-async";
import { OrderView } from "../sections/order/view";

export default function OrderPage() {
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Manage Orders | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <OrderView />
    </>
  );
}
