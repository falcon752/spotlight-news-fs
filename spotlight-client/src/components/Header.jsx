import React, { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  BsFacebook,
  BsTwitter,
  BsInstagram,
  BsSearch,
  BsChevronDown,
  BsList
} from "react-icons/bs";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

const handleSearchSubmit = (e) => {
  e.preventDefault();
  if (searchTerm.trim()) {
    navigate(`/search-results?query=${encodeURIComponent(searchTerm.trim())}`);
  }
};


  // Dropdown categories
  const categorySlugs = ["investigation", "lifestyle", "fact-check", "videos"];
  const isCategoryActive = categorySlugs.some(
    (slug) => location.pathname === `/category/${slug}`
  );

  return (
    <header id="header" className="header position-relative">
      <div className="container-fluid container-xl position-relative">
        <div className="top-row d-flex align-items-center justify-content-between">
          <NavLink to="/" className="logo d-flex align-items-end">
            <h1 className="sitename">Spotlight</h1>
            <span>.</span>
          </NavLink>

          <div className="d-flex align-items-center">
            <div className="social-links d-flex align-items-center">
              <a
                href="https://web.facebook.com/profile.php?id=61559480481152"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2"
              >
                <BsFacebook />
              </a>

              <a
                href="https://x.com/Spotlightngr"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2"
              >
                <BsTwitter />
              </a>

              <a
                href="https://www.instagram.com/spotlightngr/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2"
              >
                <BsInstagram />
              </a>

              <a
                href="https://www.tiktok.com/search?q=Spotlightngr&t=1720187038652"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-2"
              >
                <i className="bi bi-tiktok"></i>
              </a>
            </div>

            {/* 🔎 Updated Search Form */}
            <form className="search-form ms-4" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn">
                <BsSearch />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="nav-wrap">
        <div className="container d-flex justify-content-center position-relative">
          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                  end
                >
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/category/news"
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  News
                </NavLink>
              </li>

              <li className={`dropdown ${isCategoryActive ? "active" : ""}`}>
                <NavLink to="#" className={() => undefined}>
                  <span>Categories</span>
                  <BsChevronDown className="toggle-dropdown" />
                </NavLink>
                <ul>
                  {categorySlugs.map((slug) => (
                    <li key={slug}>
                      <NavLink
                        to={`/category/${slug}`}
                        className={({ isActive }) =>
                          isActive ? "active" : undefined
                        }
                      >
                        {slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ")}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              <li>
                <NavLink
                  to="/category/impacts"
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  Impacts
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/category/videos"
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  Videos
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  Contact
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/donate"
                  className={({ isActive }) => (isActive ? "active" : undefined)}
                >
                  Donate
                </NavLink>
              </li>
            </ul>

            <span className="mobile-nav-toggle d-xl-none">
              <BsList />
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
