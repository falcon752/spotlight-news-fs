import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useVideoStore } from "../store/useVideoStore";
import SideBar from "../components/SideBar";
import VideoCard from "../components/VideoCard"; //  shared VideoCard

export default function VideosPage() {
  const { videos = [], fetchVideos, loading } = useVideoStore();

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown Date";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="category-page">
      <Helmet>
        <title>Videos | Spotlight</title>
      </Helmet>

      <main className="main">
        {/* Page Title */}
        <div className="page-title position-relative">
          <div className="breadcrumbs">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="bi bi-house"></i> Home
                  </Link>
                </li>
                <li className="breadcrumb-item active current">Videos</li>
              </ol>
            </nav>
          </div>
          <div className="title-wrapper">
            <h1>Videos</h1>
          </div>
        </div>

        {/* Content */}
        <div className="container">
          <div className="row">
            {/* Left column: videos */}
            <div className="col-lg-8">
              <section className="category-postst section">
                <div
                  className="container"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="row gy-4">
                    {loading ? (
                      <p>Loading videos...</p>
                    ) : videos && videos.length > 0 ? (
                      videos.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={{
                            ...video,
                            date: formatDate(video.created_at),
                          }}
                        />
                      ))
                    ) : (
                      <p>No videos available.</p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Right column: sidebar */}
            <SideBar />
          </div>
        </div>
      </main>
    </div>
  );
}
