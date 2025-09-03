import React from "react";

export default function NotFound() {
  return (
    <main className="main">
      {/* Error 404 Section */}
      <section id="error-404" className="error-404 section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="text-center">
            <div
              className="error-icon mb-4"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <i className="bi bi-exclamation-circle"></i>
            </div>

            <h1
              className="error-code mb-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              404
            </h1>

            <h2
              className="error-title mb-3"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Oops! Page Not Found
            </h2>

            <p
              className="error-text mb-4"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>

            <div
              className="search-box mb-4"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <form action="#" className="search-form">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for pages..."
                    aria-label="Search"
                  />
                  <button className="btn search-btn" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>

            <div
              className="error-action"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <a href="/" className="btn btn-primary">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* /Error 404 Section */}
    </main>
  );
}
