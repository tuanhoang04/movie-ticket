export default function FilmCard({ image, name, date, data }) {
  return (
    <div className="flex w-full flex-col justify-start mb-5">
      <div className="w-full flex flex-col justify-start box-border">
        <img
          src={image || data.film_img}
          className="rounded-lg object-cover w-full"
        />
        <p className="text-[#5D6A81] text-lg w-full">
          {date || data.Release_date.substring(0, 10)}
        </p>
        <p className="text-white font-bold text-xl w-full">
          {name || data.film_name}
        </p>
      </div>
    </div>
  );
}
