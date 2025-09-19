import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";

import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import axiosAdmin from "api/axiosAdmin";
import useAuthStore from "store/useAuthStore";

import Swal from "sweetalert2";   // ✅ SweetAlert2

function Basic() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // store validation errors

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const res = await axiosAdmin.post("/login", { email, password });

      // Save author and token
      setAuth(res.data.author, res.data.access_token);

      // ✅ SweetAlert success
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${res.data.author.name}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect based on role
      const role = res.data.author.role;
      setTimeout(() => {
        if (role === "Admin" || role === "Chief Admin") {
          navigate("/dashboard"); // protected admin dashboard
        } else {
          navigate("/unauthorized"); // non-admin users
        }
      }, 2000);

    } catch (err) {
      if (err.response?.status === 422) {
        // Validation errors from backend
        setErrors(err.response.data.errors || {});
      } else {
        // ✅ SweetAlert error
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err.response?.data?.message || "Something went wrong",
        });
      }
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={!!errors.email}
                helperText={errors.email && errors.email[0]}
              />
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={!!errors.password}
                helperText={errors.password && errors.password[0]}
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Sign In
              </MDButton>
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
