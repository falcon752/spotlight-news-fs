// src/pages/BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import SideBar from "../components/SideBar";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../components/BreadCrumbs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { usePostStore } from "../store/usePostStore";

const MySwal = withReactContent(Swal);

const BlogDetails = () => {
  const { postSlug } = useParams();
  const { posts, fetchPosts, categories, fetchCategories, loading } =
    usePostStore();

  const [post, setPost] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-in-out", once: true });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!categories || categories.length === 0) await fetchCategories();
      if (!posts || posts.length === 0) await fetchPosts();
    };
    fetchData();
  }, [categories, posts, fetchCategories, fetchPosts]);

  useEffect(() => {
    if (!posts) return;
    const foundPost = posts.find((p) => p.slug === postSlug);
    setPost(foundPost || null);
  }, [posts, postSlug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!post) return <p className="text-center mt-10">Post not found.</p>;

  const author = post.author;
  const category = post.categories?.[0];
  const isVideo = post.type === "video";

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, ""); // removes all HTML tags
  };

  const openVideo = () => {
    if (!post.videoUrl) return;

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

    const embedUrl = getEmbedUrl(post.videoUrl);

    MySwal.fire({
      title: post.title,
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
    });
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | Spotlight</title>
      </Helmet>

      <main className="main">
        <div className="page-title">
          <Breadcrumbs />
          <div className="title-wrapper">
            <h1>{post.title}</h1>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <section className="blog-details section">
                <div className="container" data-aos="fade-up">
                  <article className="article">
                    {/* Hero Image */}
                    <div
                      className="hero-img"
                      style={{
                        position: "relative",
                        cursor: isVideo ? "pointer" : "default",
                      }}
                      onClick={isVideo ? openVideo : undefined}
                      data-aos="zoom-in"
                    >
                      <img
                        src={post.img || post.thumbnail}
                        alt={post.title}
                        className="img-fluid"
                        style={{
                          width: "100%",
                          height: "500px",
                          objectFit: "cover",
                        }}
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
                    </div>

                    {/* Post Content */}
                    <div
                      className="article-content"
                      data-aos="fade-up"
                      data-aos-delay="100"
                      style={{ marginTop: "20px" }}
                    >
                      <div className="content-header d-flex align-items-center mb-4">
                        <img
                          src={author?.avatar}
                          alt={author?.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginRight: "15px",
                          }}
                        />
                        <div>
                          <h4>{author?.name}</h4>
                          <p style={{ margin: 0 }}>
                            <i className="bi bi-calendar3"></i> {post.date}
                          </p>
                        </div>
                      </div>

                      {/* CKEditor content */}
                      {post.desc.split(/<\/?p>/).map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        if (trimmed.includes("<img")) {
                          // Extract src from img tag
                          const srcMatch =
                            trimmed.match(/src=["']([^"']+)["']/);
                          const src = srcMatch ? srcMatch[1] : null;
                          return src ? (
                            <img
                              key={idx}
                              src={src}
                              alt={post.title}
                              style={{
                                width: "100%",
                                height: "500px",
                                objectFit: "cover",
                                margin: "20px 0",
                              }}
                            />
                          ) : null;
                        }
                        return <p key={idx}>{stripHtml(trimmed)}</p>; // ✅ fixed here
                      })}
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
