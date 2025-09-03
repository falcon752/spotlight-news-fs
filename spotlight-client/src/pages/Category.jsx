import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { posts, categories, authors, videos } from "../store/mockData";
import SideBar from "../components/SideBar";
import VideoCard from "../components/VideoCard";
import VideoModal from "../components/VideoModal";
import { Helmet } from "react-helmet-async";
import NotFound from "./404";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return <NotFound />;
  }

  const pageTitle = `${category.name} | Spotlight`;
  const isVideoCategory = categorySlug === "videos";
  const items = isVideoCategory
    ? videos.filter((v) => v.categoryId === category.id)
    : posts.filter((p) => p.categoryId === category.id);

  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="category-page">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <main className="main">
        <div className="page-title position-relative">
          <div className="breadcrumbs">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/"><i className="bi bi-house"></i> Home</Link>
                </li>
                <li className="breadcrumb-item active current">
                  {category.name}
                </li>
              </ol>
            </nav>
          </div>
          <div className="title-wrapper">
            <h1>{category.name}</h1>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <section className="category-postst section">
                <div className="container" data-aos="fade-up" data-aos-delay="100">
                  <div className="row gy-4">
{items.length > 0 ? (
  isVideoCategory
    ? items.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onPlay={(vid) => setSelectedVideo(vid)}
        />
      ))
    : items.map((post) => {
        const author = authors.find((a) => a.id === post.authorId);
        return (
          <div className="col-lg-6" key={post.id}>
            {/* Wrap the entire article in Link */}
            <Link
              to={`/category/${category.slug}/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article>
                <div className="post-img">
                  <img src={post.img} alt={post.title} className="img-fluid" />
                </div>
                <p className="post-category">{category.name}</p>
                <h2 className="title">{post.title}</h2>
                <div className="d-flex align-items-center">
                  <img
                    src={author?.avatar}
                    alt={author?.name}
                    className="img-fluid post-author-img flex-shrink-0"
                  />
                  <div className="post-meta">
                    <p className="post-author">{author?.name}</p>
                    <p className="post-date">
                      <time dateTime={post.date}>{post.date}</time>
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        );
      })
) : (
  <p>No items found in this category.</p>
)}

                  </div>
                </div>
              </section>
            </div>

            <SideBar />
          </div>
        </div>
      </main>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
}
