import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTemplateFeatures } from "./hooks/useTemplateFeatures";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CategoryPage from "./pages/Category";
import BlogDetails from "./pages/BlogDetails";
import Contact from "./pages/Contact";
import NotFound from "./pages/404";
import SearchResults from "./pages/SearchResults";
import Donate from "./pages/Donate";
import Loader from "./components/Loader";
import VideosPage from "./pages/VideoPage";
import axiosClient, { BASE_URL } from "./api/axiosClient";

function App() {
  useTemplateFeatures();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  // Initial loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top handler
  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Record page visit on every route change
  useEffect(() => {
    const recordPageVisit = async () => {
      try {
        await axiosClient.post("/page-visit", { page: location.pathname });
      } catch (error) {
        console.error("Failed to record page visit:", error);
      }
    };

    recordPageVisit();
  }, [location]);

  if (loading) return <Loader />;

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Category pages */}
          <Route path="/category/:categorySlug" element={<CategoryPage />} />

          {/* Blog post details */}
          <Route path="/post/:postSlug" element={<BlogDetails />} />

          {/* Standalone videos page */}
          <Route path="/videos" element={<VideosPage />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/videos/:videoSlug" element={<BlogDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />

      {/* Scroll to Top Button */}
      <a
        href="#"
        id="scroll-top"
        className="scroll-top d-flex align-items-center justify-content-center"
        onClick={handleScrollTop}
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}

export default App;
