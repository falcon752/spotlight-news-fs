import React from "react";
import { FaTimes } from "react-icons/fa";

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="video-modal-overlay">
      <div className="video-modal">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="video-wrapper">
          <iframe
            width="100%"
            height="480"
            src={video.url.replace("watch?v=", "embed/")}
            title={video.title}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
