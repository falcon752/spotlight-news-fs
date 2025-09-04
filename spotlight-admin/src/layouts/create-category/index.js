import { useState, useEffect } from "react";
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

// Zustand store for categories
import { useCategoryStore } from "store/useCategoryStore"; // adjust path

function CreateCategory() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const MySwal = withReactContent(Swal);

  const [categoryName, setCategoryName] = useState("");

  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Create category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      await createCategory(categoryName.trim());
      MySwal.fire({
        title: "Success!",
        text: `Category "${categoryName}" created successfully!`,
        icon: "success",
        background: isDark ? "#1A2027" : "#fff",
        color: isDark ? "#fff" : "#000",
        confirmButtonColor: theme.palette.info.main,
      });
      setCategoryName(""); // Reset input
    } catch (err) {
      MySwal.fire("Error", err.message, "error");
    }
  };

  // Edit category
  const handleEdit = async (category) => {
    const result = await MySwal.fire({
      title: "Edit Category",
      input: "text",
      inputLabel: "Category Name",
      inputValue: category.name,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputValidator: (value) => (!value?.trim() ? "Category name cannot be empty!" : null),
      background: isDark ? "#1A2027" : "#fff",
      color: isDark ? "#fff" : "#000",
      confirmButtonColor: theme.palette.info.main,
      cancelButtonColor: theme.palette.grey[500],
    });

    if (result.isConfirmed) {
      try {
        await updateCategory(category.id, result.value.trim());
        MySwal.fire({
          title: "Updated!",
          text: "Category name has been updated.",
          icon: "success",
          background: isDark ? "#1A2027" : "#fff",
          color: isDark ? "#fff" : "#000",
          confirmButtonColor: theme.palette.info.main,
        });
      } catch (err) {
        MySwal.fire("Error", err.message, "error");
      }
    }
  };

  // Delete category
  const handleDelete = async (category) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Deleting this category will remove all posts under it!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.grey[500],
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(category.id);
        MySwal.fire({
          title: "Deleted!",
          text: "The category has been deleted.",
          icon: "success",
          background: isDark ? "#1A2027" : "#fff",
          color: isDark ? "#fff" : "#000",
          confirmButtonColor: theme.palette.info.main,
        });
      } catch (err) {
        MySwal.fire("Error", err.message, "error");
      }
    }
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
                  Manage Categories
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
                              Actions
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell>
                              <MDTypography variant="body2">{category.name}</MDTypography>
                            </TableCell>
                            <TableCell align="right">
                              <MDButton
                                variant="outlined"
                                color="info"
                                size="small"
                                onClick={() => handleEdit(category)}
                                sx={{ mr: 1 }}
                              >
                                Edit
                              </MDButton>
                              <MDButton
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleDelete(category)}
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
