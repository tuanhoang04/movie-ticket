import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import TicketFilms from "../components/film/TicketFilms";

export default function HomePage() {
  return (
    <div className="bg-[#1C1B21] min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow">
        <TicketFilms />
        {/* <NewNews /> */}
      </div>
      <Footer />
    </div>
  );
}
