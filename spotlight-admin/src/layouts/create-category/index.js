import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Spotlight Admin components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Spotlight Admin example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function CreateCategory() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const MySwal = withReactContent(Swal);

  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    MySwal.fire({
      title: "Success!",
      text: `Category "${categoryName}" created successfully!`,
      icon: "success",
      background: isDark ? "#1A2027" : "#fff",
      color: isDark ? "#fff" : "#000",
      confirmButtonColor: theme.palette.info.main,
    });

    setCategoryName(""); // Reset input
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card>
              {/* Header */}
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Create New Category
                </MDTypography>
              </MDBox>

              {/* Form */}
              <MDBox p={3}>
                <form onSubmit={handleSubmit}>
                  <MDBox mb={2}>
                    <MDInput
                      label="Category Name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      fullWidth
                    />
                  </MDBox>

                  <MDBox mt={3}>
                    <MDButton type="submit" variant="gradient" color="info" fullWidth>
                      Save Category
                    </MDButton>
                  </MDBox>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CreateCategory;
