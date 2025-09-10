// src/components/ShareDropdown.jsx
import React, { useState } from "react";
import {
  FaWhatsapp,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaTelegramPlane,
  FaInstagram,
  FaLink,
} from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

export default function ShareDropdown({ url, title }) {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      link: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: <FaTwitter />,
      link: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      link: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      name: "Telegram",
      icon: <FaTelegramPlane />,
      link: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      link: "#", // Instagram does not allow direct sharing via URL
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
      setOpen(false); // close dropdown after copying
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy link.");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggleDropdown}
        style={{
          background: "#f75815",
          color: "white",
          border: "none",
          padding: "8px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "20px",
        }}
        title="Share"
      >
        <FiShare2 />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minWidth: "160px",
          }}
        >
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#333",
              fontWeight: "500",
              padding: 0,
            }}
          >
            <FaLink /> Copy Link
          </button>

          {/* Other share links */}
          {shareLinks.map((item) => (
            <a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#333",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              {item.icon} {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
