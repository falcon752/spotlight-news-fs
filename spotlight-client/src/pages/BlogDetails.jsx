import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SideBar from "../components/SideBar";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../components/BreadCrumbs";

import { posts, videos, categories, authors } from "../store/mockData";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const BlogDetails = () => {
  const { categorySlug, postSlug } = useParams();

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  // Merge posts and videos
  const allItems = [...posts, ...videos];

  const item = allItems.find((i) => i.slug === postSlug);

  if (!item) {
    return (
      <main className="main">
        <div className="container">
          <h2>Content not found</h2>
          <Link to="/">Go back home</Link>
        </div>
      </main>
    );
  }

  const author = authors.find((a) => a.id === item.authorId);
  const category = categories.find((c) => c.id === item.categoryId);

  const isVideo = item.type === "video";

  // Function to open video in SweetAlert modal
  const openVideo = () => {
    if (!item.videoUrl) return;

    const getEmbedUrl = (url) => {
      try {
        if (url.includes("youtu.be")) {
          const videoId = url.split("youtu.be/")[1].split("?")[0];
          return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes("watch?v=")) {
          const videoId = new URL(url).searchParams.get("v");
          return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
      } catch (e) {
        console.error("Invalid video URL:", url);
        return url;
      }
    };

    const embedUrl = getEmbedUrl(item.videoUrl);

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
              <section id="blog-details" className="blog-details section">
                <div className="container" data-aos="fade-up">
                  <article className="article">
                    {/* Hero Image */}
                    <div
                      className="hero-img"
                      style={{ position: "relative", cursor: isVideo ? "pointer" : "default" }}
                      onClick={isVideo ? openVideo : undefined}
                      data-aos="zoom-in"
                    >
                      <img
                        src={item.img || item.thumbnail}
                        alt={item.title}
                        className="img-fluid"
                        loading="lazy"
                      />

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

                      {/* Meta overlay */}
                      <div className="meta-overlay">
                        <div className="meta-categories">
                          <Link to={`/${category?.slug}`} className="category">
                            {category?.name}
                          </Link>
                          <span className="divider">•</span>
                          {item.readTime && (
                            <span className="reading-time">
                              <i className="bi bi-clock"></i> {item.readTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="article-content" data-aos="fade-up" data-aos-delay="100">
                      <div className="content-header">
                        <div className="author-info">
                          <div className="author-details">
                            <img src={author?.avatar} alt={author?.name} className="author-img" />
                            <div className="info">
                              <h4>{author?.name}</h4>
                            </div>
                          </div>
                          <div className="post-meta">
                            <span className="date">
                              <i className="bi bi-calendar3"></i> {item.date}
                            </span>
                            {item.comments && (
                              <>
                                <span className="divider">•</span>
                                <span className="comments">
                                  <i className="bi bi-chat-text"></i> {item.comments} Comments
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {item.desc && <p className="lead">{item.desc}</p>}
                    </div>
                  </article>
                </div>
              </section>
            </div>

            <SideBar />
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogDetails;
