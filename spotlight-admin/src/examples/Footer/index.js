import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <MDBox
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      py={2}
    >
      <MDTypography variant="button" fontWeight="regular" color="text">
        © {currentYear} Copyright Peter Leks Communications. All Rights Reserved
      </MDTypography>
    </MDBox>
  );
}

export default Footer;
