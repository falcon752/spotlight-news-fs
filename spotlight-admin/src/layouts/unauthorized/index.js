import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BasicLayout from "layouts/authentication/components/BasicLayout";

import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Unauthorized() {
  return (
    <BasicLayout image={bgImage}>
      <Card>
        {/* Oops card header */}
        <MDBox
          variant="gradient"
          bgColor="error" // same as DefaultNavbar effect
          borderRadius="lg"
          coloredShadow="error"
          mx={2}
          mt={-3}
          p={4}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h1" fontWeight="bold" color="white" mt={1}>
            OOPS! 🚫
          </MDTypography>
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={2}>
            You’re not authorized
          </MDTypography>
          <MDTypography variant="body1" fontWeight="light" color="white" mt={1}>
            Looks like someone tried to sneak in. Let’s get you back on track.
          </MDTypography>
        </MDBox>

        {/* Card body */}
        <MDBox pt={6} pb={6} px={3} textAlign="center">
          <MDTypography variant="h5" color="text">
            Go back to{" "}
            <MDTypography
              component="a"
              href="/"
              variant="h5"
              color="info"
              fontWeight="medium"
              textGradient
              sx={{ cursor: "pointer" }}
            >
              Home
            </MDTypography>
          </MDTypography>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Unauthorized;
