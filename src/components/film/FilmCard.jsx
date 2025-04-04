export default function FilmCard({ image, name, date }) {
  return (
    <div className="flex w-[16%] flex-col justify-start mb-5">
      <div className="w-full flex flex-col justify-start box-border">
        <img
          src={image}
          className="rounded-lg object-cover w-full"
        />
        <p className="text-[#5D6A81] text-lg w-full">{date}</p>
        <p className="text-white font-bold text-xl w-full">{name}</p>
      </div>
    </div>
  );
}
