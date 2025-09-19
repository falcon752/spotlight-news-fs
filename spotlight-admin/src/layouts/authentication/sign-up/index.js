import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

import axiosAdmin from "api/axiosAdmin";
import useAuthStore from "store/useAuthStore";
import Swal from "sweetalert2";

function Cover() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/svg+xml",
      ];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire("Invalid file", "Please upload a JPG, PNG, or SVG", "error");
        setSelectedImage(null);
      } else {
        setSelectedImage(file);
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name) {
      return Swal.fire("Missing field", "Name is required", "warning");
    }
    if (!formData.email) {
      return Swal.fire("Missing field", "Email is required", "warning");
    }
    if (!formData.password) {
      return Swal.fire("Missing field", "Password is required", "warning");
    }
    if (formData.password !== formData.confirmPassword) {
      return Swal.fire("Password mismatch", "Passwords do not match", "error");
    }
    if (!formData.agreeTerms) {
      return Swal.fire(
        "Terms required",
        "You must agree to the terms and conditions",
        "warning"
      );
    }

    // Prepare FormData for backend
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("password_confirmation", formData.confirmPassword);
    payload.append("role", "Visitor");
    if (selectedImage) payload.append("avatar", selectedImage);

    try {
      await axiosAdmin.post("/register", payload);

      Swal.fire({
        title: "Success!",
        text: "Registration complete. Redirecting...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/unauthorized");
      });
    } catch (err) {
      Swal.fire(
        "Registration failed",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {/* Name */}
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </MDBox>

            {/* Email */}
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </MDBox>

            {/* Password */}
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
            </MDBox>

            {/* Confirm Password */}
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Confirm Password"
                variant="standard"
                fullWidth
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                required
              />
            </MDBox>

            {/* Terms */}
            <MDBox display="flex" alignItems="center" ml={-1} mb={2}>
              <Checkbox
                checked={formData.agreeTerms}
                onChange={(e) => handleChange("agreeTerms", e.target.checked)}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>

            {/* Profile Image */}
            <MDBox mt={3} mb={2} textAlign="center">
              <MDButton
                variant="outlined"
                color="info"
                onClick={triggerFileSelect}
                fullWidth
              >
                {selectedImage
                  ? "Change Profile Image"
                  : "Select Profile Image"}
              </MDButton>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.svg,.JPG,.JPEG,.PNG,.SVG"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              {selectedImage && (
                <MDBox mt={2} textAlign="center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Profile Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                </MDBox>
              )}
            </MDBox>

            {/* Submit */}
            <MDButton
              type="submit"
              variant="gradient"
              color="info"
              fullWidth
              sx={{ position: "relative", zIndex: 20 }}
            >
              Sign Up
            </MDButton>

            {/* Login link */}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
