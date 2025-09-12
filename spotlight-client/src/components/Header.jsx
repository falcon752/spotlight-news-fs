import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  BsFacebook,
  BsTwitter,
  BsInstagram,
  BsSearch,
  BsChevronDown,
  BsList,
} from "react-icons/bs";
import { usePostStore } from "../store/usePostStore";

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { categories, fetchCategories } = usePostStore();
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const [isSticky, setIsSticky] = useState(false);

  // Fetch categories only once on mount
  useEffect(() => {
    const loadCategories = async () => {
      await fetchCategories();
    };
    loadCategories();
  }, [fetchCategories]);

  // Update dynamicCategories when categories change
  useEffect(() => {
    if (categories && categories.length > 0) {
      const filtered = categories.filter(
        (cat) => !["videos", "contact", "donate", "home"].includes(cat.slug)
      );
      setDynamicCategories(filtered);
    }
  }, [categories]);

  // Sticky nav on scroll
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const firstSix = dynamicCategories.slice(0, 6);
  const remaining = dynamicCategories.slice(6);

  return (
    <header id="header" className="header position-relative">
      <div className="container-fluid container-xl position-relative">
        <div className="top-row d-flex align-items-center justify-content-between">
          <NavLink to="/" className="logo d-flex align-items-end">
            <img
              src="/assets/img/spotlight.png"
              alt="Spotlight"
              style={{ transform: "scale(2)", transformOrigin: "left center" }}
            />
          </NavLink>

          <div className="d-flex align-items-center">
            <div className="social-links d-flex align-items-center">
              <a href="https://web.facebook.com/profile.php?id=61559480481152" target="_blank" rel="noopener noreferrer" className="mx-2">
                <BsFacebook />
              </a>
              <a href="https://x.com/Spotlightngr" target="_blank" rel="noopener noreferrer" className="mx-2">
                <BsTwitter />
              </a>
              <a href="https://www.instagram.com/spotlightngr/" target="_blank" rel="noopener noreferrer" className="mx-2">
                <BsInstagram />
              </a>
              <a href="https://www.tiktok.com/search?q=Spotlightngr&t=1720187038652" target="_blank" rel="noopener noreferrer" className="mx-2">
                <i className="bi bi-tiktok"></i>
              </a>
            </div>

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

      <div className={`nav-wrap ${isSticky ? "sticky" : ""}`}>
        <div className="container d-flex justify-content-center position-relative">
          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : undefined} end>
                  Home
                </NavLink>
              </li>

              {firstSix.map((cat) => (
                <li key={cat.id}>
                  <NavLink
                    to={`/category/${cat.slug}`}
                    className={({ isActive }) => isActive ? "active" : undefined}
                  >
                    {cat.name}
                  </NavLink>
                </li>
              ))}

              {remaining.length > 0 && (
                <li className="dropdown">
                  <NavLink to="#" className={() => undefined}>
                    <span>More</span> <BsChevronDown className="toggle-dropdown" />
                  </NavLink>
                  <ul>
                    {remaining.map((cat) => (
                      <li key={cat.id}>
                        <NavLink
                          to={`/category/${cat.slug}`}
                          className={({ isActive }) => isActive ? "active" : undefined}
                        >
                          {cat.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              )}

              <li>
                <NavLink to="/videos" className={({ isActive }) => isActive ? "active" : undefined}>
                  Videos
                </NavLink>
              </li>

              <li>
                <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : undefined}>
                  Contact
                </NavLink>
              </li>

              <li>
                <NavLink to="/donate" className={({ isActive }) => isActive ? "active" : undefined}>
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
