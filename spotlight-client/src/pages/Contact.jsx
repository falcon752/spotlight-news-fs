import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await emailjs.sendForm(
        "service_j9mfpsh", // your service ID
        "template_zyh1zr8", // replace with your EmailJS template ID
        e.target,
        "81DRQwHkVH-_0ocLL" // your public key
      );

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Your message has been sent successfully.",
        confirmButtonColor: "#f75815",
      });

      e.target.reset();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#f75815",
      });
      console.error("EmailJS Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact | Spotlight</title>
      </Helmet>

      <main className="main">
        {/* Page Title */}
        <div className="page-title">
          <div className="breadcrumbs">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="bi bi-house"></i> Home
                  </Link>
                </li>
                <li className="breadcrumb-item active current">Contact</li>
              </ol>
            </nav>
          </div>

          <div className="title-wrapper">
            <h1>Contact</h1>
            <p>
              We’d love to hear from you! You can reach out to us directly using
              the form below, and we’ll get back to you as soon as possible.
            </p>
          </div>
        </div>
        {/* End Page Title */}

        {/* Contact Section */}
        <section id="contact" className="contact section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row justify-content-center gy-4 mb-5">
              <div className="col-lg-4">
                <div className="info-card text-center">
                  <div className="icon-box">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <h3>Contact Email</h3>
                  <p>
                    <a
                      href="mailto:contact@spotlightonline.ng"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      contact@spotlightonline.ng
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="form-wrapper" data-aos="fade-up" data-aos-delay="400">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 form-group">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-person"></i>
                          </span>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Your name*"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6 form-group">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email address*"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group mt-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-chat-dots"></i>
                        </span>
                        <textarea
                          name="message"
                          className="form-control"
                          rows="6"
                          placeholder="Write a message*"
                          required
                        ></textarea>
                      </div>
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
                          cursor: loading ? "not-allowed" : "pointer",
                        }}
                      >
                        {loading ? "Sending..." : "Submit Message"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Contact Section */}
      </main>
    </>
  );
};

export default Contact;
