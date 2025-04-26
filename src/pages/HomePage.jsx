import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import Movies from "../components/movie/Movies";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-[#1C1B21] to-[#141316] min-h-screen flex flex-col">
      <NavBar currentPage="Home"/>
      <div className="flex-grow">
        <Movies />
      </div>
      <Footer />
    </div>
  );
}
