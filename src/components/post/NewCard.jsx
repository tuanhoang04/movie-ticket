export default function NewCard({ data }) {
  return (
    <div id="card">
      <h1>{data.new_header}</h1>
      <img src={data.new_img} alt="" />
      <div></div>
    </div>
  );
}
