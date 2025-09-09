import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsTwitter, BsFacebook, BsInstagram } from "react-icons/bs";
import { usePostStore } from "../store/usePostStore";
import { useVideoStore } from "../store/useVideoStore";

const Footer = () => {
  const { categories, fetchCategories } = usePostStore();
  const { videos, fetchVideos } = useVideoStore();
  const [dynamicCategories, setDynamicCategories] = useState([]);

  // Fetch categories and videos
  useEffect(() => {
    fetchCategories();
    fetchVideos();
  }, [fetchCategories, fetchVideos]);

  // Filter dynamic categories (exclude "videos")
  useEffect(() => {
    const filtered = categories.filter((cat) => cat.slug !== "videos");
    setDynamicCategories(filtered);
  }, [categories]);

  return (
    <footer id="footer" className="footer">
      <div className="container footer-top">
        <div className="row gy-4">

          {/* Left Column: Logo + Socials */}
          <div className="col-lg-4 col-md-12 footer-about text-center mb-4">
            <a href="/" className="logo d-block mb-3">
              <img src="/assets/img/spotlight.png" alt="Spotlight" className="footer-logo" />
            </a>

            <div className="social-links d-flex justify-content-center mt-3">
              <a href="https://web.facebook.com/profile.php?id=61559480481152" target="_blank" rel="noopener noreferrer"><BsFacebook /></a>
              <a href="https://x.com/Spotlightngr" target="_blank" rel="noopener noreferrer"><BsTwitter /></a>
              <a href="https://www.instagram.com/spotlightngr/" target="_blank" rel="noopener noreferrer"><BsInstagram /></a>
              <a href="https://www.tiktok.com/search?q=Spotlightngr&t=1720187038652" target="_blank" rel="noopener noreferrer"><i className="bi bi-tiktok"></i></a>
            </div>
          </div>

          {/* Middle Column: Quick Access */}
          <div className="col-lg-4 col-md-6 footer-links-card mb-4">
            <h4>Quick Access</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/donate">Donate</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/videos">Videos</Link></li>
            </ul>
          </div>

          {/* Right Column: Categories */}
          <div className="col-lg-4 col-md-6 footer-links-card mb-4">
            <h4>Categories</h4>
            <ul>
              {dynamicCategories.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="container copyright text-center mt-4">
        <p>
          © {new Date().getFullYear()} Copyright{" "}
          <strong className="px-1 sitename">Peter Leks Communications</strong>. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
