// src/layouts/users-table/index.js

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { authors } from "store/mockData";

function UsersTable() {
  const columns = [
    { Header: "ID", accessor: "id", align: "center" },
    { Header: "Profile", accessor: "profile", align: "center" },
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Role", accessor: "role", align: "center" },
  ];

  const rows = authors.map((user) => ({
    id: user.id,
    profile: <MDAvatar src={user.avatar} name={user.name} size="sm" />,
    name: <MDTypography variant="button" fontWeight="medium">{user.name}</MDTypography>,
    email: <MDTypography variant="caption">{user.slug}@example.com</MDTypography>,
    role: <MDTypography variant="caption" fontWeight="medium">{user.role}</MDTypography>,
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info">
                <MDTypography variant="h6" color="white">Users Table</MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable table={{ columns, rows }} isSorted={false} entriesPerPage={false} showTotalEntries={false} noEndBorder />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default UsersTable;
