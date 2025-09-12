// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Spotlight Admin components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Spotlight Admin base styles
import typography from "assets/theme/base/typography";

function Footer({ light }) {
  const { size } = typography;
  const currentYear = new Date().getFullYear();

  return (
    <MDBox position="absolute" width="100%" bottom={0} py={4}>
      <Container>

        {/* Copyright Section */}
        <MDBox
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={2}
        >
          <MDTypography
            variant="button"
            fontWeight="regular"
            color={light ? "white" : "text"}
          >
            © {currentYear} Peter Leks Communications. All Rights Reserved
          </MDTypography>
        </MDBox>
      </Container>
    </MDBox>
  );
}

// Default props
Footer.defaultProps = {
  light: false,
};

// Prop types
Footer.propTypes = {
  light: PropTypes.bool,
};

export default Footer;
