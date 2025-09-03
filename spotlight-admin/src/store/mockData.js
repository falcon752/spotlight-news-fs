// src/store/mockData.js

// =====================
// Imports (images)
// =====================
import team1 from "../assets/images/team-1.jpg";
import team2 from "../assets/images/team-2.jpg";
import team3 from "../assets/images/team-3.jpg";
import team4 from "../assets/images/team-4.jpg";

import homeDecor1 from "../assets/images/home-decor-1.jpg";
import homeDecor2 from "../assets/images/home-decor-2.jpg";
import homeDecor3 from "../assets/images/home-decor-3.jpg";
import homeDecor4 from "../assets/images/home-decor-4.jpeg";

// =====================
// Categories
// =====================
export const categories = [
  { id: 1, name: "News", slug: "news" },
  { id: 2, name: "Investigation", slug: "investigation" },
  { id: 3, name: "Fact Check", slug: "fact-check" },
  { id: 4, name: "Lifestyle", slug: "lifestyle" },
  { id: 5, name: "Impacts", slug: "impacts" },
  { id: 6, name: "Videos", slug: "videos" },
];

// =====================
// Authors (Users)
// =====================
export const authors = [
  { id: 1, name: "John Michael", avatar: team1, slug: "john-michael", role: "Chief Admin" },
  { id: 2, name: "Alexa Liras", avatar: team2, slug: "alexa-liras", role: "Admin" },
  { id: 3, name: "Laurent Perrier", avatar: team3, slug: "laurent-perrier", role: "Visitor" },
  { id: 4, name: "Richard Davis", avatar: team4, slug: "richard-davis", role: "Admin" },
];

// =====================
// Posts
// =====================
export const posts = [
  {
    id: 1,
    categoryId: 1,
    authorId: 1,
    slug: "breaking-news",
    img: homeDecor1,
    title: "Breaking News",
    desc: "This is a detailed description of the breaking news post for demonstration purposes.",
    date: "Jan 10, 2025",
  },
  {
    id: 2,
    categoryId: 2,
    authorId: 2,
    slug: "investigation-report",
    img: homeDecor2,
    title: "Investigation Report",
    desc: "An in-depth look into the latest investigation conducted by the team today.",
    date: "Jan 15, 2025",
  },
];

// =====================
// Videos
// =====================
export const videos = [
  {
    id: 1,
    categoryId: 6,
    authorId: 1,
    title: "Amazing Space Exploration",
    videoUrl: "https://youtu.be/oTIJunBa6MA?si=AHNRyt-ThDQk1gBf",
    thumbnail: "https://img.youtube.com/vi/oTIJunBa6MA/maxresdefault.jpg",
    date: "Aug 25, 2025",
    slug: "amazing-space-exploration",
    type: "video",
    desc: "Explore the latest discoveries in space and learn about the missions pushing the boundaries of human knowledge beyond Earth."
  },
  {
    id: 2,
    categoryId: 6,
    authorId: 2,
    title: "The Future of AI",
    videoUrl: "https://youtu.be/bzNKQ2FkEJI?si=gOawPPL6LcZEgSUz",
    thumbnail: "https://img.youtube.com/vi/bzNKQ2FkEJI/maxresdefault.jpg",
    date: "Aug 27, 2025",
    slug: "the-future-of-ai",
    type: "video",
    desc: "A deep dive into emerging AI technologies, their potential impact on industries, and ethical considerations for the future."
  },
  {
    id: 3,
    categoryId: 6,
    authorId: 3,
    title: "Exploring the Deep Ocean",
    videoUrl: "https://youtu.be/kX34-IAiapA?si=vEtegkF4rrSvkTwv",
    thumbnail: "https://img.youtube.com/vi/kX34-IAiapA/maxresdefault.jpg",
    date: "Aug 28, 2025",
    slug: "exploring-the-deep-ocean",
    type: "video",
    desc: "Dive into the mysteries of the deep sea, uncovering unique marine life and the technologies enabling underwater exploration."
  },
];
