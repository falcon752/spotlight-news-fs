import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import axiosClient from "../api/axiosClient"; // axios instance
import "sweetalert2/dist/sweetalert2.min.css";

const Donate = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call Laravel backend to initialize Paystack payment
      const res = await axiosClient.post("/paystack/init", {
        email: formData.email,
        amount: formData.amount,
      });

      console.log("Paystack init response:", res);

      const authorization_url = res?.authorization_url;

      if (!authorization_url) {
        throw new Error("No authorization URL returned from server");
      }

      // Send email via EmailJS (optional, can remove if not needed before redirect)
      await emailjs.send(
        "service_j9mfpsh",
        "template_zyh1zr8",
        formData,
        "81DRQwHkVH-_0ocLL"
      );

      // Redirect to Paystack payment page
      window.location.href = authorization_url;
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Unable to process donation.",
        confirmButtonColor: "#f75815",
      });
      console.error("Donation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Donate | Spotlight</title>
      </Helmet>

      <main className="main">
        <div className="page-title">
          <div className="breadcrumbs">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="bi bi-house"></i> Home
                  </Link>
                </li>
                <li className="breadcrumb-item active current">Donate</li>
              </ol>
            </nav>
          </div>
          <div className="title-wrapper">
            <h1>Donate</h1>
            <p>Fill out the form below to make a donation.</p>
          </div>
        </div>

        <section id="donate" className="donate section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="form-wrapper">
                  <form onSubmit={handleDonate}>
                    <div className="form-group mt-2">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Your Name*"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mt-2">
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Email Address*"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mt-2">
                      <input
                        type="number"
                        name="amount"
                        className="form-control"
                        placeholder="Donation Amount (NGN)*"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mt-2">
                      <textarea
                        name="message"
                        className="form-control"
                        rows="5"
                        placeholder="Leave a message (optional)"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <div className="text-center mt-3">
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          backgroundColor: "#f75815",
                          color: "#fff",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "10px",
                          cursor: loading ? "not-allowed" : "pointer",
                        }}
                      >
                        {loading ? "Processing..." : "Donate Now"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Donate;
