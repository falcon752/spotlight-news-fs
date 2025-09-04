  import { useState } from "react";
  import Grid from "@mui/material/Grid";
  import Card from "@mui/material/Card";
  import Table from "@mui/material/Table";
  import TableBody from "@mui/material/TableBody";
  import TableCell from "@mui/material/TableCell";
  import TableContainer from "@mui/material/TableContainer";
  import TableHead from "@mui/material/TableHead";
  import TableRow from "@mui/material/TableRow";
  import Paper from "@mui/material/Paper";
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

    // Initial hardcoded categories
    const [categories, setCategories] = useState([
      "Investigations",
      "Sports",
      "News",
      "Lifestyle",
    ]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!categoryName.trim()) return;

      setCategories([...categories, categoryName.trim()]);

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

    // Edit category using SweetAlert modal
    const handleEdit = (index) => {
      MySwal.fire({
        title: "Edit Category",
        input: "text",
        inputLabel: "Category Name",
        inputValue: categories[index],
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value || !value.trim()) {
            return "Category name cannot be empty!";
          }
        },
        background: isDark ? "#1A2027" : "#fff",
        color: isDark ? "#fff" : "#000",
        confirmButtonColor: theme.palette.info.main,
        cancelButtonColor: theme.palette.grey[500],
      }).then((result) => {
        if (result.isConfirmed) {
          const updated = [...categories];
          updated[index] = result.value.trim();
          setCategories(updated);
          MySwal.fire({
            title: "Updated!",
            text: "Category name has been updated.",
            icon: "success",
            background: isDark ? "#1A2027" : "#fff",
            color: isDark ? "#fff" : "#000",
            confirmButtonColor: theme.palette.info.main,
          });
        }
      });
    };

    const handleDelete = (index) => {
      MySwal.fire({
        title: "Are you sure?",
        text: "Deleting this category will remove all posts under it!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: theme.palette.error.main,
        cancelButtonColor: theme.palette.grey[500],
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const updated = categories.filter((_, i) => i !== index);
          setCategories(updated);
          MySwal.fire({
            title: "Deleted!",
            text: "The category has been deleted.",
            icon: "success",
            background: isDark ? "#1A2027" : "#fff",
            color: isDark ? "#fff" : "#000",
            confirmButtonColor: theme.palette.info.main,
          });
        }
      });
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

                  {/* Categories Table */}
                  <MDBox mt={4}>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <MDTypography variant="subtitle1" fontWeight="medium">
                                All Categories
                              </MDTypography>
                            </TableCell>
                            <TableCell align="right">
                              <MDTypography variant="subtitle1" fontWeight="medium">
                                {/* Actions */}
                              </MDTypography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {categories.map((category, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <MDTypography variant="body2">{category}</MDTypography>
                              </TableCell>
                              <TableCell align="right">
                                <MDButton
                                  variant="outlined"
                                  color="info"
                                  size="small"
                                  onClick={() => handleEdit(index)}
                                  sx={{ mr: 1 }}
                                >
                                  Edit
                                </MDButton>
                                <MDButton
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => handleDelete(index)}
                                >
                                  Delete
                                </MDButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </MDBox>
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
