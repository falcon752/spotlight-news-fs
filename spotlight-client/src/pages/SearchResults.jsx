import React, { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import VideoCard from "../components/VideoCard";
import { usePostStore } from "../store/usePostStore";
import { useVideoStore } from "../store/useVideoStore";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("query")?.toLowerCase() || "";

  const { posts, fetchPosts, categories } = usePostStore();
  const { videos, fetchVideos } = useVideoStore();

  // Fetch posts and videos on mount
  useEffect(() => {
    fetchPosts();
    fetchVideos();
  }, [fetchPosts, fetchVideos]);

  // Date formatter: show hours/minutes for today, else show full date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  // Month first format: Sep 7, 2025
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};


  // Filter Posts
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return [];
    return posts.filter((post) => {
      const category = categories.find((c) => c.id === post.categoryId);
      const author = post.author;
      return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.desc.toLowerCase().includes(searchTerm) ||
        category?.name?.toLowerCase().includes(searchTerm) ||
        author?.name?.toLowerCase().includes(searchTerm)
      );
    });
  }, [searchTerm, posts, categories]);

  // Filter Videos
  const filteredVideos = useMemo(() => {
    if (!searchTerm) return [];
    return videos.filter((video) => {
      const category = categories.find((c) => c.id === video.categoryId);
      const author = video.author;
      return (
        video.title.toLowerCase().includes(searchTerm) ||
        category?.name?.toLowerCase().includes(searchTerm) ||
        author?.name?.toLowerCase().includes(searchTerm)
      );
    });
  }, [searchTerm, videos, categories]);

  const allResults = [...filteredPosts, ...filteredVideos];

  const pageTitle = searchTerm
    ? `Search results for "${searchTerm}" | Spotlight`
    : "Search | Spotlight";

  return (
    <main className="main">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <div className="page-title">
        <div className="breadcrumbs">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/"><i className="bi bi-house"></i> Home</Link>
              </li>
              <li className="breadcrumb-item active current">Search Results</li>
            </ol>
          </nav>
        </div>

        <div className="title-wrapper">
          <h1>Search Results</h1>
          <p>
            {allResults.length > 0
              ? `We found ${allResults.length} result${allResults.length > 1 ? "s" : ""} for "${searchTerm}"`
              : `No results found for "${searchTerm}"`}
          </p>
        </div>
      </div>

      <section className="search-results-posts section">
        <div className="container">
          <div className="row gy-4">
            {/* Render Posts */}
            {filteredPosts.map((post) => {
              const category = categories.find((c) => c.id === post.categoryId);
              const author = post.author;
              return (
                <div className="col-lg-4" key={`post-${post.id}`}>
                  <article>
                    <div className="post-img">
                      <img src={post.img} alt={post.title} className="img-fluid" />
                    </div>
                    <p className="post-category">{category?.name}</p>
                    <h2 className="title">
                      <Link to={`/category/${category?.slug}/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <div className="d-flex align-items-center">
                      <img
                        src={author?.avatar}
                        alt={author?.name}
                        className="img-fluid post-author-img flex-shrink-0"
                      />
                      <div className="post-meta">
                        <p className="post-author">{author?.name}</p>
                        <p className="post-date"><time dateTime={post.date}>{formatDate(post.date)}</time></p>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}

            {/* Render Videos */}
            {filteredVideos.map((video) => (
              <VideoCard key={`video-${video.id}`} video={video} formatDate={formatDate} />
            ))}

            {allResults.length === 0 && (
              <p className="text-center">Try searching for another keyword.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default SearchResults;
