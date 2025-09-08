import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePostStore } from "../store/usePostStore";
import SideBar from "../components/SideBar";
import VideoCard from "../components/VideoCard";
import VideoModal from "../components/VideoModal";
import { Helmet } from "react-helmet-async";
import NotFound from "./404";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const { categories, posts, fetchCategories, fetchPosts, loading } = usePostStore();

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Utility: strip HTML
  const stripHtml = (html) => (html ? html.replace(/<[^>]*>/g, "") : "");

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown Date";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Fetch categories and posts
  useEffect(() => {
    const fetchData = async () => {
      if (!categories || categories.length === 0) await fetchCategories();
      if (!posts || posts.length === 0) await fetchPosts();
    };
    fetchData();
  }, [categories, posts, fetchCategories, fetchPosts]);

  // Filter category and items
  useEffect(() => {
    if (!categories || !posts) return;

    const cat = categories.find((c) => c.slug === categorySlug);
    if (!cat) {
      setCategory(null);
      setItems([]);
      return;
    }
    setCategory(cat);

    const filteredItems = posts.filter((p) => p.categories?.some((c) => c.id === cat.id));
    setItems(filteredItems);
  }, [categorySlug, categories, posts]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!category) return <NotFound />;

  const pageTitle = `${category.name} | Spotlight`;
  const isVideoCategory = categorySlug === "videos";

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
                <li className="breadcrumb-item active current">{category.name}</li>
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
              <section className="category-posts section">
                <div className="container" data-aos="fade-up" data-aos-delay="100">
                  <div className="row gy-4">
                    {items.length > 0 ? (
                      isVideoCategory ? (
                        items.map((video) => (
                          <VideoCard
                            key={video.id}
                            video={{
                              ...video,
                              date: formatDate(video.created_at),
                              author: video.author,
                            }}
                            onPlay={(vid) => setSelectedVideo(vid)}
                          />
                        ))
                      ) : (
                        items.map((post) => {
                          const author = post.author;
                          return (
                            <div className="col-lg-6" key={post.id}>
                              <article>
                                <Link
                                  to={`/category/${category.slug}/${post.slug}`}
                                  style={{ textDecoration: "none", color: "inherit" }}
                                >
                                  <div className="post-img">
                                    <img src={post.img} alt={post.title} className="img-fluid" />
                                  </div>
                                  <p className="post-category">{category.name}</p>
                                  <h2 className="title">{stripHtml(post.title)}</h2>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={author?.avatar}
                                      alt={author?.name}
                                      className="post-author-img"
                                    />
                                    <div>
                                      <p className="post-author">{author?.name}</p>
                                      <p className="post-date">{formatDate(post.created_at)}</p>
                                    </div>
                                  </div>
                                </Link>
                              </article>
                            </div>
                          );
                        })
                      )
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
