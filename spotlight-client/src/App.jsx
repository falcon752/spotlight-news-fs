// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
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

function App() {
  useTemplateFeatures();

  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Category pages */}
          <Route path="/category/:categorySlug" element={<CategoryPage />} />

          {/* Blog post details */}
          <Route
            path="/category/:categorySlug/:postSlug"
            element={<BlogDetails />}
          />

          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/search-results" element={<SearchResults />} />
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
