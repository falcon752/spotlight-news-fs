import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const VideoCard = ({ video }) => {
  const author = video.author;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";

    const date = new Date(dateStr); // backend UTC
    const now = new Date();

    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEmbedUrl = (url) => {
    try {
      if (url.includes("youtu.be")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes("watch?v=")) {
        const videoId = new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const getThumbnail = (url) => {
    try {
      if (url.includes("youtu.be")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0];
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      if (url.includes("watch?v=")) {
        const videoId = new URL(url).searchParams.get("v");
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
      return "/default-thumbnail.jpg";
    } catch {
      return "/default-thumbnail.jpg";
    }
  };

  const openVideo = () => {
    const embedUrl = getEmbedUrl(video.video_url);

    MySwal.fire({
      title: video.title,
      html: `
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
          <iframe 
            src="${embedUrl}?autoplay=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style="position:absolute;top:0;left:0;width:100%;height:100%;">
          </iframe>
        </div>
      `,
      width: 800,
      showCloseButton: true,
      showConfirmButton: false,
      background: "#000",
      customClass: { title: "swal2-video-title" },
    });
  };

  return (
    <div className="col-lg-6">
      <article>
        <div
          className="post-img video-thumb"
          style={{ position: "relative", cursor: "pointer" }}
          onClick={openVideo}
        >
          <img
            src={getThumbnail(video.video_url)}
            alt={video.title}
            className="img-fluid"
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "48px",
              color: "white",
              pointerEvents: "none",
            }}
          >
            ►
          </div>
        </div>

        <p className="post-category">Videos</p>

        <Link
          to={`/videos/${video.slug}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h2 className="title">{video.title}</h2>
        </Link>

        <div className="d-flex align-items-center">
          <img
            src={author?.avatar || "/default-avatar.png"}
            alt={author?.name}
            className="img-fluid post-author-img flex-shrink-0"
          />
          <div className="post-meta">
            <p className="post-author">{author?.name}</p>
            <p className="post-date">{formatDate(video.created_at)}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default VideoCard;
