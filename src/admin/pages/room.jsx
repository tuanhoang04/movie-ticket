import { Helmet } from "react-helmet-async";
import { RoomView } from "../sections/room/view/room-view";

export default function RoomPage() {
  return (
    <>
      <Helmet>
        <title>
          {" "}
          {`Theater Room Management | Admin Page for Starlight Movie Ticket Booking Website`}
        </title>
      </Helmet>

      <RoomView />
    </>
  );
}
