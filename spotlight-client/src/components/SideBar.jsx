// components/Sidebar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { posts, categories, videos } from "../store/mockData";

const Sidebar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const getCategoryCount = (catId, slug) => {
    if (slug === "videos") {
      return videos.filter((v) => v.categoryId === catId).length;
    }
    return posts.filter((p) => p.categoryId === catId).length;
  };

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
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`}>
                    {cat.name}{" "}
                    <span>({getCategoryCount(cat.id, cat.slug)})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
    </aside>
    </div >
  );
};

export default Sidebar;
