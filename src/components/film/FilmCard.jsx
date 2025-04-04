export default function FilmCard({ image, name, date }) {
  return (
    <div className="col-span-1 row-span-1 flex flex-col items-center content-center justify-center">
      <img src={image} className="rounded-lg w-64" />
      <p className="text-white w-56">{name}</p>
    </div>
  );
}
