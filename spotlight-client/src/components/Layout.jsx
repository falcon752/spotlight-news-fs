// src/components/Layout.jsx
import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";
import { getPageTitle } from "../utils/title";

const Layout = ({ children }) => {
  const location = useLocation();
  const params = useParams();
  const title = getPageTitle(location.pathname, params);

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
