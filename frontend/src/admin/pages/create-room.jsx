import { Helmet } from "react-helmet-async";
import { CreateRoomView } from "../sections/room/view";

// ----------------------------------------------------------------------
export default function CreateRoomPage() {
  return (
    <>
      <Helmet>
        <title>
          {`Create Room | Admin Page for Starlight Movie Ticket Sales Website`}
        </title>
      </Helmet>

      <CreateRoomView />
    </>
  );
}
