// src/store/mockData.js

// =====================
// Categories
// =====================
export const categories = [
  { id: 1, name: "Investigation", slug: "investigation" },
  { id: 2, name: "News", slug: "news" },
  { id: 3, name: "Fact Check", slug: "fact-check" },
  { id: 4, name: "Lifestyle", slug: "lifestyle" },
  { id: 5, name: "Impacts", slug: "impacts" },
  { id: 6, name: "Videos", slug: "videos" }, // Video category
];

// =====================
// Authors
// =====================
export const authors = [
  { id: 1, name: "Julia Parker", avatar: "/assets/img/person/person-f-12.webp", slug: "julia-parker" },
  { id: 2, name: "Mark Wilson", avatar: "/assets/img/person/person-m-10.webp", slug: "mark-wilson" },
  { id: 3, name: "Sarah Johnson", avatar: "/assets/img/person/person-f-15.webp", slug: "sarah-johnson" },
];

// =====================
// Posts
// =====================
export const posts = [
  {
    id: 1,
    categoryId: 1, // Investigation
    authorId: 1,
    slug: "uncovering-hidden-scandals",
    img: "/assets/img/blog/blog-post-portrait-1.webp",
    title: "Uncovering Hidden Scandals",
    desc: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
    date: "Jan 15, 2025",
  },
  {
    id: 2,
    categoryId: 2, // News
    authorId: 2,
    slug: "breaking-down-new-education-reforms",
    img: "/assets/img/blog/blog-post-portrait-2.webp",
    title: "Breaking Down New Education Reforms",
    desc: "Maecenas tempus tellus eget condimentum rhoncus quam semper libero sit amet.",
    date: "Jan 18, 2025",
  },
  {
    id: 3,
    categoryId: 3, // Fact Check
    authorId: 3,
    slug: "separating-truth-from-viral-misinformation",
    img: "/assets/img/blog/blog-post-portrait-3.webp",
    title: "Separating Truth From Viral Misinformation",
    desc: "Nullam dictum felis eu pede mollis pretium integer tincidunt. Cras dapibus.",
    date: "Jan 21, 2025",
  },
  {
    id: 4,
    categoryId: 4, // Lifestyle
    authorId: 2,
    slug: "healthy-habits-for-modern-living",
    img: "/assets/img/blog/blog-post-portrait-4.webp",
    title: "Healthy Habits for Modern Living",
    desc: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.",
    date: "Feb 2, 2025",
  },
  {
    id: 5,
    categoryId: 5, // Impacts
    authorId: 1,
    slug: "understanding-global-economic-shifts",
    img: "/assets/img/blog/blog-post-portrait-5.webp",
    title: "Understanding Global Economic Shifts",
    desc: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe.",
    date: "Feb 10, 2025",
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

