import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Donate = () => {
  return (
    <>
      {/* Helmet for dynamic page title */}
      <Helmet>
        <title>Donate | Spotlight</title>
      </Helmet>

      <main className="main">
        {/* Page Title */}
        <div className="page-title">
          <div className="breadcrumbs">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/"><i className="bi bi-house"></i> Home</Link>
                </li>

                <li className="breadcrumb-item active current">Donate</li>
              </ol>
            </nav>
          </div>

          <div className="title-wrapper">
            <h1>Donate</h1>
            <p>
              Your generosity helps us continue our mission. Please fill out the form 
              below to make a donation.
            </p>
          </div>
        </div>
        {/* End Page Title */}

        {/* Donate Section */}
        <section id="donate" className="donate section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row">
              <div className="col-lg-12">
                <div className="form-wrapper" data-aos="fade-up" data-aos-delay="200">
                  <form
                    action="#"
                    method="post"
                    role="form"
                    className="php-email-form"
                  >
                    <div className="row">
                      {/* Name */}
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

                      {/* Email */}
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

                    <div className="row mt-3">
                      {/* Phone (optional) */}
                      <div className="col-md-6 form-group">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-phone"></i>
                          </span>
                          <input
                            type="text"
                            name="phone"
                            className="form-control"
                            placeholder="Phone number (optional)"
                          />
                        </div>
                      </div>

                      {/* Donation Amount */}
                      <div className="col-md-6 form-group">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-cash"></i>
                          </span>
                          <input
                            type="number"
                            name="amount"
                            className="form-control"
                            placeholder="Donation amount (USD)*"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="row mt-3">
                      <div className="col-md-12 form-group">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-credit-card"></i>
                          </span>
                          <select name="paymentMethod" className="form-control" required>
                            <option value="">Select payment method*</option>
                            <option value="card">Credit/Debit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank">Bank Transfer</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="form-group mt-3">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-chat-dots"></i>
                        </span>
                        <textarea
                          name="message"
                          className="form-control"
                          rows="5"
                          placeholder="Leave a message (optional)"
                        ></textarea>
                      </div>
                    </div>

                    {/* Status messages */}
                    <div className="my-3">
                      <div className="loading">Processing donation...</div>
                      <div className="error-message"></div>
                      <div className="sent-message">
                        Thank you for your donation!
                      </div>
                    </div>

                    {/* Submit button */}
                    <div className="donate text-center">
                      <button type="submit" style={{ backgroundColor: "#f75815", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px" }}>Donate Now</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Donate Section */}
      </main>
    </>
  );
};

export default Donate;
