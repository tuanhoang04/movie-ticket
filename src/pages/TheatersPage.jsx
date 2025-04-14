import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Dropdown from "../components/Dropdown";
export default function TheatersPage() {
  const options = ["Theater 1", "Theater 2", "Theater 3"];
  return (
    <div className="bg-[#1C1B21] h-screen">
      <NavBar />
      <div id="body" className="">
        <div className="m-auto w-fit mt-10 flex items-center gap-10 bg-gray-800 px-5 p-2 rounded-lg">
          <h1 className="text-white text-xl font-bold">Location</h1>
          <Dropdown label="Select a theater" options={options} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
