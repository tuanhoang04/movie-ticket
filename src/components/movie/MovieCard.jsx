export default function MovieCard({ image, name, date, data }) {
  return (
    <div className="flex flex-col justify-start hover:cursor-pointer hover:outline outline-gray-600 rounded-md p-4">
      <img
        src={image || data.film_img}
        className="rounded-2xl object-cover w-full"
      />
      <p className="text-[#5D6A81] lg:text-xl md:text-lg w-full">
        {date || data.Release_date.substring(0, 10)}
      </p>
      <p className="text-white lg:text-2xl md:text-lg  overflow-hidden text-ellipsis break-words [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] lg:h-[4.1rem] md:h-[3.6rem]">
        {name || data.film_name}
      </p>
    </div>
  );
}
