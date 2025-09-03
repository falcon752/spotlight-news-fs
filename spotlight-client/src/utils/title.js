// src/utils/title.js
export const getPageTitle = (pathname, params = {}) => {
  const { categorySlug, postSlug } = params;

  if (pathname === "/") return "Home | Spotlight";
  if (pathname === "/contact") return "Contact | Spotlight";
  if (pathname === "/search-results") return "Search Results | Spotlight";

  if (categorySlug && postSlug) {
    // Blog post
    return `${postSlug.replace(/-/g, " ")} | Spotlight`;
  }

  if (categorySlug) {
    // Category page
    return `${categorySlug.replace(/-/g, " ")} | Spotlight`;
  }

  return "Spotlight";
};
