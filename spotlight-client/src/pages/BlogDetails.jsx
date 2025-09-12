// src/pages/BlogDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { usePostStore } from "../store/usePostStore";
import { useVideoStore } from "../store/useVideoStore";
import SideBar from "../components/SideBar";
import Breadcrumbs from "../components/BreadCrumbs";
import ShareDropdown from "../components/ShareDropdown";
import { getThumbnail, getEmbedUrl } from "../utils/videoUtils";

const MySwal = withReactContent(Swal);

const BlogDetails = () => {
  const { postSlug, videoSlug } = useParams();
  const {
    posts,
    fetchPosts,
    categories,
    fetchCategories,
    postsLoading,
    incrementPostView,
  } = usePostStore();

  const { videos, fetchVideos, loading: videosLoading } = useVideoStore();

  const [item, setItem] = useState(null);
  const viewRef = useRef(false); //  to track if view was incremented

  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-in-out", once: true });
  }, []);

  // Fetch posts, categories, videos if not loaded
  useEffect(() => {
    const fetchData = async () => {
      if (!categories || categories.length === 0) await fetchCategories();
      if (!posts || posts.length === 0) await fetchPosts();
      if (!videos || videos.length === 0) await fetchVideos();
    };
    fetchData();
  }, [categories, posts, videos, fetchCategories, fetchPosts, fetchVideos]);

  // Set the current post/video item and increment view only once
  useEffect(() => {
    if (postSlug && posts.length) {
      const foundPost = posts.find((p) => p.slug === postSlug);
      setItem(foundPost || null);

      if (foundPost && !viewRef.current) {
        incrementPostView(foundPost.id);
        viewRef.current = true; // mark as incremented
      }
    } else if (videoSlug && videos.length) {
      const foundVideo = videos.find((v) => v.slug === videoSlug);
      setItem(foundVideo || null);
    }
  }, [postSlug, videoSlug, posts, videos, incrementPostView]);

  if (postsLoading || videosLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!item) {
    return <p className="text-center mt-10">Not found.</p>;
  }

  const author = item.author;
  const isVideo = item.type === "video";

  // Helpers
  const stripHtml = (html) => (html ? html.replace(/<[^>]*>/g, "") : "");
  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown Date";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const openVideo = (videoUrl) => {
    if (!videoUrl) return;
    const embedUrl = getEmbedUrl(videoUrl);

    MySwal.fire({
      title: item.title,
      html: `
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
          <iframe 
            src="${embedUrl}?autoplay=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style="position:absolute;top:0;left:0;width:100%;height:100%;">
          </iframe>
        </div>
      `,
      width: 800,
      showCloseButton: true,
      showConfirmButton: false,
      background: "#000",
      customClass: { title: "swal2-video-title" },
    });
  };

  return (
    <>
      <Helmet>
        <title>{item.title} | Spotlight</title>
      </Helmet>

      <main className="main">
        <div className="page-title">
          <Breadcrumbs />
          <div className="title-wrapper">
            <h1>{item.title}</h1>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <section className="blog-details section">
                <div className="container" data-aos="fade-up">
                  <article className="article">
                    {/* Hero Image / Video */}
                    <div
                      className="hero-img"
                      style={{
                        position: "relative",
                        cursor: isVideo ? "pointer" : "default",
                      }}
                      onClick={isVideo ? () => openVideo(item.video_url) : undefined}
                      data-aos="zoom-in"
                    >
                      <img
                        src={isVideo ? getThumbnail(item.video_url) : item.img || item.thumbnail}
                        alt={item.title}
                        className="img-fluid"
                        style={{ width: "100%", height: "500px", objectFit: "cover" }}
                      />

                      {/* Share Button */}
                      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                        <ShareDropdown url={window.location.href} title={item.title} />
                      </div>

                      {isVideo && (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "48px",
                            color: "white",
                            pointerEvents: "none",
                          }}
                        >
                          ►
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="article-content" data-aos="fade-up" data-aos-delay="100" style={{ marginTop: "20px" }}>
                      {/* Author Info */}
                      <div className="content-header d-flex align-items-center mb-4">
                        <img
                          src={author?.avatar}
                          alt={author?.name}
                          style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", marginRight: "15px" }}
                        />
                        <div>
                          <h4>{author?.name}</h4>
                          <p style={{ margin: 0 }}>
                            <i className="bi bi-calendar3"></i> {formatDate(item.date || item.created_at)}
                          </p>
                          {/* {item.views !== undefined && <p style={{ fontStyle: "italic" }}>Views: {item.views}</p>} */}
                        </div>
                      </div>

                      {/* CKEditor content handling */}
                      {item.desc
                        ?.split(/<\/?p>|<\/?figure>/)
                        .map((line, idx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;

                          // Handle <img>
                          if (trimmed.includes("<img")) {
                            const srcMatch = trimmed.match(/src=["']([^"']+)["']/);
                            const src = srcMatch ? srcMatch[1] : null;
                            return src ? (
                              <img
                                key={idx}
                                src={src}
                                alt={item.title}
                                style={{ width: "100%", height: "500px", objectFit: "cover", margin: "20px 0" }}
                              />
                            ) : null;
                          }

                          // Handle <oembed> videos
                          if (trimmed.includes("<oembed")) {
                            const urlMatch = trimmed.match(/url=["']([^"']+)["']/);
                            const videoUrl = urlMatch ? urlMatch[1] : null;
                            if (!videoUrl) return null;

                            return (
                              <div
                                key={idx}
                                style={{ position: "relative", cursor: "pointer", margin: "20px 0" }}
                                onClick={() => openVideo(videoUrl)}
                              >
                                <img
                                  src={getThumbnail(videoUrl)}
                                  alt="Video Thumbnail"
                                  style={{ width: "100%", height: "500px", objectFit: "cover" }}
                                />
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    fontSize: "48px",
                                    color: "white",
                                    pointerEvents: "none",
                                  }}
                                >
                                  ►
                                </div>
                              </div>
                            );
                          }

                          // Fallback: plain text
                          return <p key={idx}>{stripHtml(trimmed)}</p>;
                        })}
                    </div>
                  </article>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <SideBar />
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogDetails;
