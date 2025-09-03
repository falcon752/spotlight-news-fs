import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BsPerson, BsClock, BsChatDots, BsArrowRight } from "react-icons/bs";

const FeaturedSwiper = ({ posts }) => {
  return (
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
      {posts.map((post, index) => (
        <SwiperSlide key={index}>
          <div className="blog-post-item">
            <img src={post.img} alt={post.title} />
            <div className="blog-post-content">
              <div className="post-meta">
                <span><BsPerson /> {post.author}</span>
                <span><BsClock /> {post.date}</span>
                {/* <span><BsChatDots /> {post.comments} Comments</span> */}
              </div>
              <h2><a href="#">{post.title}</a></h2>
              <p>{post.desc}</p>
              <a href="#" className="read-more">Read More <BsArrowRight /></a>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FeaturedSwiper;
