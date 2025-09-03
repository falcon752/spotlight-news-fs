import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";

// Spotlight Admin components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Spotlight Admin base styles
import backgroundImage from "assets/images/bg-profile.jpeg";

// Context
import { useMaterialUIController, setOpenConfigurator } from "context";

// Store
import useAuthStore from "store/authStore";

function Header({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const author = useAuthStore((state) => state.author);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const logout = useAuthStore((state) => state.logout);
  const updateAvatar = useAuthStore((state) => state.updateAvatar);

  const [avatarPreview, setAvatarPreview] = useState(author?.avatar || "");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    setAvatarPreview(author?.avatar || "");
  }, [author]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Preview instantly
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);

      try {
        await updateAvatar(file);

        // ✅ SweetAlert2 modal
        Swal.fire({
          title: "Profile Updated!",
          text: "Your profile picture has been changed successfully.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error uploading avatar:", error);

        // ❌ Error alert
        Swal.fire({
          title: "Oops!",
          text: "Something went wrong while updating your avatar.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "Try Again",
        });
      }
    }
  };

  return (
    <MDBox position="relative" mb={5}>
      {/* Background Image */}
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({
            functions: { rgba, linearGradient },
            palette: { gradients },
          }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />

      <Card sx={{ position: "relative", mt: -8, mx: 3, py: 2, px: 2 }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          {/* Avatar */}
          <Grid item sx={{ position: "relative" }}>
            <MDAvatar
              src={avatarPreview || "/default-avatar.png"}
              alt={author?.name || "profile-image"}
              size="xl"
              shadow="sm"
              onClick={handleAvatarClick}
              sx={{ cursor: "pointer" }}
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ display: "none" }}
              accept="image/*"
            />

            <MDBox
              component="span"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "info.main",
                color: "#fff",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: 3,
                "&:hover": { backgroundColor: "info.dark" },
              }}
              onClick={handleAvatarClick}
            >
              <Icon fontSize="small">camera_alt</Icon>
            </MDBox>
          </Grid>

          {/* Name + Email */}
          <Grid item xs={12}>
            <MDBox height="100%" mt={1} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {author?.name || "Your Name"}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {author?.email || "email@example.com"}
              </MDTypography>
            </MDBox>
          </Grid>

          {/* Logout + Settings */}
          <Grid
            item
            xs={12}
            md={8}
            lg={6}
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="info"
              startIcon={<Icon fontSize="small">login</Icon>}
              sx={{
                textTransform: "none",
                color: "#000",
                "&:hover": { backgroundColor: "info.dark", color: "#fff" },
              }}
              onClick={() => {
                logout();
                window.location.href = "/authentication/sign-in";
              }}
            >
              Logout
            </Button>

            <Button
              variant="contained"
              color="info"
              startIcon={<Icon fontSize="small">settings</Icon>}
              sx={{
                textTransform: "none",
                color: "#000",
                "&:hover": { backgroundColor: "info.dark", color: "#fff" },
              }}
              onClick={() => {
                setOpenConfigurator(dispatch, true);
              }}
            >
              Settings
            </Button>
          </Grid>
        </Grid>

        {children}
      </Card>
    </MDBox>
  );
}

Header.defaultProps = { children: "" };
Header.propTypes = { children: PropTypes.node };

export default Header;
