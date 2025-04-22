import { Typography } from "@material-tailwind/react";

export default function TicketCard({ data }) {
  const titleClassName = "text-xl mb-3";
  const keyClassName = "text-md opacity-50";
  const valueClassName = "text-md";

  const date = data.show_date.substring(0, 10); // Lấy ngày đúng
  const time = data.show_time.substring(0, 5);

  return (
    <div className="w-full h-fit flex flex-nowrap items-center gap-8 text-white hover:outline outline-gray-600 p-2 rounded-md">
      <div className="grid  place-items-center rounded-lg overflow-hidden">
        <img
          src={data.film_img}
          className="w-full h-[160px] object-cover"
          alt=""
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <h1 className={titleClassName}>{data.film_name}</h1>

        <div className="grid grid-cols-3 gap-5 text-xl">
          <div className="flex flex-col gap-2">
            <h1 className={keyClassName}>Order date</h1>
            <p className={valueClassName}>
              {data.order_date.substring(11, 16) +
                " - " +
                data.order_date.substring(0, 10)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className={keyClassName}>Cinema</h1>
            <p className={valueClassName}>{data.cinema_name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className={keyClassName}>Showtime</h1>
            <p className={valueClassName}>{time + " - " + date}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className={keyClassName}>Room</h1>
            <p className={valueClassName}>{data.room_name.substring(5)}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className={keyClassName}>Seat</h1>
            <div className={valueClassName}>
              {data.tickets.map((seats) => (
                <span key={seats.seat} style={{ marginLeft: "3px" }}>
                  {seats.seat}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className={keyClassName}>Popcorn + Drink</h1>
            <div className={valueClassName}>
              {data.popcorn.length > 0 ? (
                <>
                  {data.popcorn.map((pop) => (
                    <p key={pop.name}>
                      Combo {pop.name} x{pop.quantity}
                    </p>
                  ))}
                </>
              ) : (
                <p>No</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
