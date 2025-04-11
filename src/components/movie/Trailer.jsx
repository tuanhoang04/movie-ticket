export default function Trailer({ youtubeLink }) {
  youtubeLink = convertYouTubeLinkToEmbed(youtubeLink);
  return (
    <div
      style={{
        position: "relative",
        paddingTop: "56.25%" /* 16:9 aspect ratio (9/16 = 0.5625) */,
        width: "100%",
      }}
    >
      <iframe
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        src={youtubeLink}
        allow="accelerometer; clipboard-write; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
}

function convertYouTubeLinkToEmbed(link) {
  if (link.includes("youtu.be")) {
    const videoId = link.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (link.includes("youtube.com/watch?v=")) {
    const videoId = link.split("v=")[1].split("&")[0]; // Tách VIDEO_ID và bỏ các tham số khác nếu có
    const startTime = link.includes("t=")
      ? link.split("t=")[1].replace("s", "")
      : 0; // Lấy thời gian bắt đầu nếu có
    return `https://www.youtube.com/embed/${videoId}?start=${startTime}`;
  }
  return link;
}
