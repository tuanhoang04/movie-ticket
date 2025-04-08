export default function MovieCard({ image, name, date, data }) {
  return (
    <div className="flex flex-col justify-start w-[100%]">
      <img
        src={image || data.film_img}
        className="rounded-2xl object-cover w-full"
      />
      <p className="text-[#5D6A81] text-lg w-full">
        {date || data.Release_date.substring(0, 10)}
      </p>
      <p className="text-white font-bold overflow-hidden text-ellipsis break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] h-[3.12rem]">
        {name || data.film_name}
      </p>
    </div>
  );
}
