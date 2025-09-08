// src/utils/videoUtils.js
export const getThumbnail = (url) => {
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

export const getEmbedUrl = (url) => {
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
  } catch (e) {
    console.error("Invalid video URL:", url);
    return url;
  }
};
