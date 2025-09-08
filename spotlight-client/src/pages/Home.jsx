import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BsPerson, BsClock, BsArrowRight } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Store
import { usePostStore } from "../store/usePostStore";

const Home = () => {
  const { posts, fetchPosts, fetchCategories, loading } = usePostStore();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  // Remove HTML tags
  const stripHtml = (html) => (html ? html.replace(/<[^>]*>/g, "") : "");

  // Truncate after N words
  const truncateWords = (html, wordLimit = 10) => {
    const text = stripHtml(html);
    const words = text.split(/\s+/).slice(0, wordLimit);
    return words.join(" ") + (words.length >= wordLimit ? "..." : "");
  };

  // Format backend date to readable string
  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown Date";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Enrich posts with author + first category + formatted date
  const enrichedPosts = posts.map((post) => ({
    ...post,
    categoryName: post.categories[0]?.name || "Uncategorized",
    categorySlug: post.categories[0]?.slug || "uncategorized",
    authorName: post.author?.name || "Unknown",
    authorImg: post.author?.avatar || "",
    formattedDate: formatDate(post.date),
  }));

  const featuredPostsData = enrichedPosts.slice(0, 3);
  const listPosts = enrichedPosts.slice(3);

  return (
    <>
      {/* BLOG HERO */}
      <section id="blog-hero" className="blog-hero section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="blog-grid">
            {enrichedPosts[0] && (
              <article className="blog-item featured" data-aos="fade-up">
                <img
                  src={enrichedPosts[0].img}
                  alt={enrichedPosts[0].title}
                  className="img-fluid"
                />
                <div className="blog-content">
                  <div className="post-meta">
                    <span className="date">{enrichedPosts[0].formattedDate}</span>
                    <span className="category">{enrichedPosts[0].categoryName}</span>
                  </div>
                  <h2 className="post-title">
                    <Link
                      to={`/category/${enrichedPosts[0].categorySlug}/${enrichedPosts[0].slug}`}
                    >
                      {enrichedPosts[0].title}
                    </Link>
                  </h2>
                  
                </div>
              </article>
            )}

            {enrichedPosts.slice(1, 5).map((post, idx) => (
              <article
                className="blog-item"
                data-aos="fade-up"
                data-aos-delay={100 * (idx + 1)}
                key={post.id}
              >
                <img src={post.img} alt={post.title} className="img-fluid" />
                <div className="blog-content">
                  <div className="post-meta">
                    <span className="date">{post.formattedDate}</span>
                    <span className="category">{post.categoryName}</span>
                  </div>
                  <h3 className="post-title">
                    <Link to={`/category/${post.categorySlug}/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED POSTS */}
      <section id="featured-posts" className="featured-posts section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Featured Posts</h2>
          <div>
            <span>Check Our</span>{" "}
            <span className="description-title">Featured Posts</span>
          </div>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            loop={true}
            speed={800}
            autoplay={{ delay: 5000 }}
            slidesPerView={3}
            spaceBetween={30}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1200: { slidesPerView: 3, spaceBetween: 30 },
            }}
          >
            {featuredPostsData.map((post) => (
              <SwiperSlide key={post.id}>
                <div className="blog-post-item">
                  <img src={post.img} alt={post.title} />
                  <div className="blog-post-content">
                    <div className="post-meta">
                      <span>
                        <BsPerson /> {post.authorName}
                      </span>
                      <span>
                        <BsClock /> {post.formattedDate}
                      </span>
                    </div>
                    <h2>
                      <Link to={`/category/${post.categorySlug}/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <p>{truncateWords(post.desc, 10)}</p>
                    <Link
                      to={`/category/${post.categorySlug}/${post.slug}`}
                      className="read-more"
                    >
                      Read More <BsArrowRight />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section id="category-section" className="category-section section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Category Section</h2>
          <div>
            <span className="description-title">Category Section</span>
          </div>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4 mb-4">
            {featuredPostsData.map((post) => (
              <div className="col-lg-4" key={post.id}>
                <article className="featured-post">
                  <div className="post-img">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="img-fluid"
                      loading="lazy"
                    />
                  </div>
                  <div className="post-content">
                    <div className="category-meta">
                      <span className="post-category">{post.categoryName}</span>
                      <div className="author-meta">
                        <img
                          src={post.authorImg}
                          alt={post.authorName}
                          className="author-img"
                        />
                        <span className="author-name">{post.authorName}</span>
                        <span className="post-date">{post.formattedDate}</span>
                      </div>
                    </div>
                    <h2 className="title">
                      <Link to={`/category/${post.categorySlug}/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <p>{truncateWords(post.desc, 10)}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <div className="row">
            {listPosts.map((post) => (
              <div className="col-xl-4 col-lg-6" key={post.id}>
                <article className="list-post">
                  <div className="post-img">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="img-fluid"
                      loading="lazy"
                    />
                  </div>
                  <div className="post-content">
                    <div className="category-meta">
                      <span className="post-category">{post.categoryName}</span>
                    </div>
                    <h3 className="title">
                      <Link to={`/category/${post.categorySlug}/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <div className="post-meta">
                      <span className="read-time">{post.readTime}</span>
                      <span className="post-date">{post.formattedDate}</span>
                    </div>
                    <p>{truncateWords(post.desc, 10)}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST POSTS */}
      <section id="latest-posts" className="latest-posts section">
        <div className="container section-title" data-aos="fade-up">
          <h2>Latest Posts</h2>
          <div>
            <span>Check Our</span>{" "}
            <span className="description-title">Latest Posts</span>
          </div>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">
            {enrichedPosts.slice(-3).map((post) => (
              <div className="col-lg-4" key={post.id}>
                <article>
                  <div className="post-img">
                    <img src={post.img} alt={post.title} className="img-fluid" />
                  </div>
                  <p className="post-category">{post.categoryName}</p>
                  <h2 className="title">
                    <Link to={`/category/${post.categorySlug}/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <div className="d-flex align-items-center">
                    <img
                      src={post.authorImg}
                      alt={post.authorName}
                      className="img-fluid post-author-img flex-shrink-0"
                    />
                    <div className="post-meta">
                      <p className="post-author">{post.authorName}</p>
                      <p className="post-date">
                        <time dateTime={post.date}>{post.formattedDate}</time>
                      </p>
                    </div>
                  </div>
                  <p>{truncateWords(post.desc, 10)}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
