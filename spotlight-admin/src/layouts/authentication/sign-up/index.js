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

import axiosAdmin from "api/axiosAdmin"; // Axios instance
import useAuthStore from "store/authStore"; // Zustand auth store

function Cover() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Visitor");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedImage(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Terms & Conditions check
    if (!agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", confirmPassword);
    formData.append("role", role);
    if (selectedImage) formData.append("avatar", selectedImage);

    try {
      const res = await axiosAdmin.post("/register", formData);

      // Save author info in store (token null for now)
      setAuth(res.data.author, null);

      alert("Registration successful!");
      navigate("/authentication/sign-in");
    } catch (err) {
      console.error(err.response);
      alert(err.response?.data?.message || "Registration failed");
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </MDBox>

            {/* Role */}
            <MDBox mb={2}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="Visitor">Visitor</option>
                <option value="Admin">Admin</option>
                <option value="Chief Admin">Chief Admin</option>
              </select>
            </MDBox>

            {/* Terms */}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
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
                {selectedImage ? "Change Profile Image" : "Select Profile Image"}
              </MDButton>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              {selectedImage && (
                <MDBox mt={2} textAlign="center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Profile Preview"
                    style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                  />
                </MDBox>
              )}
            </MDBox>

            {/* Submit */}
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Sign Up
              </MDButton>
            </MDBox>

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
