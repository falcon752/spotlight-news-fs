// src/components/Loader.jsx
import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({ loading }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f0f2f5"
    }}>
      <ClipLoader size={80} color="#f75815" loading={loading} />
    </div>
  );
};

export default Loader;
