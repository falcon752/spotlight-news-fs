// src/layouts/edit-users/index.js

import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { authors as mockAuthors } from "store/mockData";

const MySwal = withReactContent(Swal);
const rolesList = ["Admin", "Visitor"];

function EditUsers() {
  const [users, setUsers] = useState(mockAuthors);

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    const user = users.find((u) => u.id === userId);
    if (user) {
      MySwal.fire({
        icon: "success",
        title: `Role updated`,
        text: `${user.name} is now ${newRole}`,
        showConfirmButton: true,
      });
    }
  };

  const handleDelete = (user) => {
    if (user.role === "Chief Admin") return;
    MySwal.fire({
      icon: "warning",
      title: `Delete ${user.name}?`,
      text: "This action cannot be undone!",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        MySwal.fire({
          icon: "success",
          title: `${user.name} deleted`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const columns = [
    { Header: "ID", accessor: "id", align: "center" },
    { Header: "Profile", accessor: "profile", align: "center" },
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Role", accessor: "role", align: "center" },
    { Header: "Actions", accessor: "actions", align: "center" },
  ];

  const rows = users.map((user) => ({
    id: user.id,
    profile: <MDAvatar src={user.avatar} name={user.name} size="sm" />,
    name: <MDTypography variant="button" fontWeight="medium">{user.name}</MDTypography>,
    email: <MDTypography variant="caption">{user.slug}@example.com</MDTypography>,
    role:
      user.role === "Chief Admin" ? (
        <MDTypography variant="caption" fontWeight="medium">{user.role}</MDTypography>
      ) : (
        <Select
          value={user.role}
          onChange={(e) => handleRoleChange(user.id, e.target.value)}
          size="small"
        >
          {rolesList.map((r) => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </Select>
      ),
    actions: (
      <MDBox display="flex" justifyContent="center" gap={1}>
        {user.role !== "Chief Admin" && (
          <MDButton
            size="small"
            variant="gradient"
            color="error"
            onClick={() => handleDelete(user)}
          >
            Delete
          </MDButton>
        )}
      </MDBox>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
                <MDTypography variant="h6" color="white">Edit User Roles</MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default EditUsers;
