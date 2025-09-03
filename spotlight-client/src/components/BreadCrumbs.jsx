// components/Breadcrumbs.jsx
import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { categories, posts } from "../store/mockData";

const Breadcrumbs = ({ pageTitle }) => {
  const location = useLocation();
  const params = useParams(); // e.g., { categorySlug, postSlug }

  const category = params.categorySlug
    ? categories.find(c => c.slug === params.categorySlug)
    : null;

  const post = params.postSlug
    ? posts.find(p => p.slug === params.postSlug)
    : null;

  // Helper to shorten a string to first 3 words
  const shorten = (str, wordLimit = 3) => {
    if (!str) return "";
    const words = str.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : str;
  };

  const crumbs = [
    { name: "Home", link: "/" },
    ...(category ? [{ name: category.name, link: `/category/${category.slug}` }] : []),
    ...(post ? [{ name: shorten(post.title), link: location.pathname }] : []),
  ];

  return (
    <div className="breadcrumbs">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          {crumbs.map((crumb, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${index === crumbs.length - 1 ? "active current" : ""}`}
              aria-current={index === crumbs.length - 1 ? "page" : undefined}
            >
              {index === crumbs.length - 1 ? (
                crumb.name
              ) : (
                <Link to={crumb.link}>{crumb.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {pageTitle && (
        <div className="title-wrapper">
          <h1>{pageTitle}</h1>
        </div>
      )}
    </div>
  );
};

export default Breadcrumbs;
