// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BsTwitter, BsFacebook, BsInstagram } from "react-icons/bs";
import { categories } from "../store/mockData"; // ✅ import categories

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="container footer-top">
        <div className="row gy-4">
          {/* About Section */}
          <div className="col-lg-4 col-md-6 footer-about">
            <a href="/" className="logo d-flex align-items-center">
              <span className="sitename">Spotlight</span>
            </a>
            <div className="footer-contact pt-3">
              <p>A108 Adam Street</p>
              <p>New York, NY 535022</p>
              <p className="mt-3">
                <strong>Phone:</strong> <span>+1 5589 55488 55</span>
              </p>
              <p>
                <strong>Email:</strong> <span>info@example.com</span>
              </p>
            </div>

            {/* ✅ Social Links */}
            <div className="social-links d-flex mt-4">
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
          </div>

          {/* ✅ Quick Access */}
          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Quick Access</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/donate">Donate</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* ✅ Categories */}
          <div className="col-lg-2 col-md-3 footer-links">
            <h4>Categories</h4>
            <ul>
              <li>
                <Link to="/category/news">News</Link>
              </li>
              <li>
                <Link to="/category/impacts">Impact</Link>
              </li>
              <li>
                <Link to="/category/investigation">Investigations</Link>
              </li>
              <li>
                <Link to="/category/fact-check">Fact-check</Link>
              </li>
              <li>
                <Link to="/category/lifestyle">Lifestyle</Link>
              </li>
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
