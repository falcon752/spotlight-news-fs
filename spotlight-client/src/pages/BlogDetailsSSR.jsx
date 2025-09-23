// src/pages/BlogDetailsSSR.jsx
import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { getThumbnail, getEmbedUrl } from "../utils/videoUtils";

// Optional: Only import ShareDropdown if rendering in browser
let ShareDropdown;
if (typeof window !== "undefined") {
  ShareDropdown = require("../components/ShareDropdown").default;
}

const BlogDetailsSSR = ({ ssrItem }) => {
  const [item, setItem] = useState(ssrItem || null);
  const viewRef = useRef(false);

  useEffect(() => {
    // Only run client-side increment view if SSR data exists
    if (item && !viewRef.current) {
      // Call your API to increment view if needed
      // Example: fetch(`/api/posts/${item.id}/increment-view`);
      viewRef.current = true;
    }
  }, [item]);

  if (!item) return <p>Not found.</p>;

  const isVideo = item.type === "video";
  const stripHtml = (html) => (html ? html.replace(/<[^>]*>/g, "") : "");

  // Safe URL for sharing
  const url = typeof window !== "undefined" ? window.location.href : `https://spotlightonline.ng/${item.type}/${item.slug}`;

  return (
    <>
      <Helmet>
        <title>{item.title} | Spotlight</title>
        <meta property="og:title" content={item.title} />
        <meta property="og:description" content={stripHtml(item.desc).substring(0, 150)} />
        <meta property="og:image" content={item.img || item.thumbnail} />
        <meta property="og:type" content={isVideo ? "video.other" : "article"} />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={item.title} />
        <meta name="twitter:description" content={stripHtml(item.desc).substring(0, 150)} />
        <meta name="twitter:image" content={item.img || item.thumbnail} />
      </Helmet>

      <article>
        <h1>{item.title}</h1>
        {item.img && <img src={item.img || item.thumbnail} alt={item.title} style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }} />}
        <p>{stripHtml(item.desc)}</p>

        {/* Render ShareDropdown only on client */}
        {typeof window !== "undefined" && ShareDropdown && <ShareDropdown url={url} title={item.title} />}
      </article>
    </>
  );
};

export default BlogDetailsSSR;
