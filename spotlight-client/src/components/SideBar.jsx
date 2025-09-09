import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePostStore } from "../store/usePostStore";
import { useVideoStore } from "../store/useVideoStore";

const Sidebar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [dynamicCategories, setDynamicCategories] = useState([]);

  const { categories, posts, fetchCategories, fetchPosts, loading } = usePostStore();
  const { videos, fetchVideos } = useVideoStore();

  // Fetch data on mount
  useEffect(() => {
    if (!categories || categories.length === 0) fetchCategories();
    if (!posts || posts.length === 0) fetchPosts();
    fetchVideos();
  }, [categories, posts, fetchCategories, fetchPosts, fetchVideos]);

  // Filter out static categories for dynamic display
  useEffect(() => {
    const filtered = categories.filter(
      (cat) => !["videos"].includes(cat.slug)
    );
    setDynamicCategories(filtered);
  }, [categories]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const getCategoryCount = (catId) => {
    const postCount = posts.filter((p) =>
      p.categories?.some((c) => c.id === catId)
    ).length;

    const videoCount = videos.filter((v) => v.categoryId === catId).length;

    return postCount + videoCount;
  };

  if (loading) return <p>Loading sidebar...</p>;

  return (
    <div className="col-lg-4">
      <aside className="sticky-sidebar">
        <div className="widgets-container" data-aos="fade-up" data-aos-delay="200">
          {/* Search Widget */}
          <div className="search-widget widget-item">
            <h3 className="widget-title">Search</h3>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" title="Search">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          {/* Categories Widget */}
          <div className="categories-widget widget-item">
            <h3 className="widget-title">Categories</h3>
            <ul className="mt-3">
              {/* Dynamic categories */}
              {dynamicCategories.map((cat) => {
                const count = getCategoryCount(cat.id);
                if (count === 0) return null; // skip categories with no posts/videos
                return (
                  <li key={cat.id}>
                    <Link to={`/category/${cat.slug}`}>
                      {cat.name} <span>({count})</span>
                    </Link>
                  </li>
                );
              })}

              {/* Static Videos category */}
              <li>
                <Link to="/videos">
                  Videos <span>({videos.length})</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
