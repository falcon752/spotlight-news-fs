import { useState, useEffect } from "react";
import PropTypes from "prop-types";

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
import breakpoints from "assets/theme/base/breakpoints";

// Context for opening configurator
import { useMaterialUIController, setOpenConfigurator } from "context";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";

function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [avatar, setAvatar] = useState(burceMars); // state for avatar image
  const [controller, dispatch] = useMaterialUIController();

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  // Handle file input change
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result); // update avatar temporarily
      reader.readAsDataURL(file);
    }
  };

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          {/* Avatar with Camera Overlay */}
          <Grid item sx={{ position: "relative" }}>
            <MDAvatar src={avatar} alt="profile-image" size="xl" shadow="sm" />

            <input
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
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
              >
                <Icon fontSize="small">camera_alt</Icon>
              </MDBox>
            </label>
          </Grid>

          {/* Profile Name and Role */}
          <Grid item xs={12}>
            <MDBox height="100%" mt={1} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                Richard Davis
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                CEO / Co-Founder
              </MDTypography>
            </MDBox>
          </Grid>

          {/* Logout & Settings Buttons */}
          <Grid
            item
            xs={12}
            md={8}
            lg={6}
            sx={{ mt: 2, textAlign: "center", display: "flex", justifyContent: "center", gap: 2 }}
          >
            {/* Logout Button */}
            <Button
              variant="contained"
              color="info"
              startIcon={<Icon fontSize="small">login</Icon>}
              sx={{
                textTransform: "none",
                color: "#000",
                "&:hover": {
                  backgroundColor: "info.dark",
                  color: "#fff",
                },
                "&.Mui-active, &:active": {
                  color: "#fff",
                },
              }}
              onClick={() => {
                console.log("Logout clicked");
                // Add your logout logic here
              }}
            >
              Logout
            </Button>

            {/* Settings Button */}
            <Button
              variant="contained"
              color="info"
              startIcon={<Icon fontSize="small">settings</Icon>}
              sx={{
                textTransform: "none",
                color: "#000",
                "&:hover": {
                  backgroundColor: "info.dark",
                  color: "#fff",
                },
                "&.Mui-active, &:active": {
                  color: "#fff",
                },
              }}
              onClick={() => {
                // Open the dashboard configurator
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

Header.defaultProps = {
  children: "",
};

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
