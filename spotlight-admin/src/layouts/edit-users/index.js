import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
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

import axiosAdmin from "api/axiosAdmin";

const MySwal = withReactContent(Swal);
const rolesList = ["Admin", "Visitor"];

// Hardcoded credentials (hashed password)
const ALLOWED_USERS = [
  { email: "olalekanakindoju@gmail.com", password: "spotlightng234" },
  { email: "atikuquadrisegun@gmail.com", password: "jumbomax2003" },
];

// Hash of 'spotlightng234'

export default function EditUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fetch authors
  const fetchUsers = async () => {
    try {
      const res = await axiosAdmin.get("/authors");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      MySwal.fire({ icon: "error", title: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchUsers();
  }, [isLoggedIn]);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    const user = ALLOWED_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setIsLoggedIn(true);
      MySwal.fire({ icon: "success", title: "Login successful" });
    } else {
      MySwal.fire({ icon: "error", title: "Invalid credentials" });
    }
  };

  // Update role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await axiosAdmin.put(`/authors/${userId}`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? res.data : u)));
      MySwal.fire({
        icon: "success",
        title: `Role updated`,
        text: `${res.data.name} is now ${res.data.role}`,
      });
    } catch (err) {
      console.error(err);
      MySwal.fire({ icon: "error", title: "Failed to update role" });
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    if (user.role === "Chief Admin") return;
    const result = await MySwal.fire({
      icon: "warning",
      title: `Delete ${user.name}?`,
      text: "This action cannot be undone!",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosAdmin.delete(`/authors/${user.id}`);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        MySwal.fire({
          icon: "success",
          title: `${user.name} deleted`,
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        MySwal.fire({ icon: "error", title: "Failed to delete user" });
      }
    }
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
    profile: <MDAvatar src={user.avatar_url} name={user.name} size="sm" />,
    name: (
      <MDTypography variant="button" fontWeight="medium">
        {user.name}
      </MDTypography>
    ),
    email: <MDTypography variant="caption">{user.email}</MDTypography>,
    role:
      user.role === "Chief Admin" ? (
        <MDTypography variant="caption" fontWeight="medium">
          {user.role}
        </MDTypography>
      ) : (
        <Select
          value={user.role}
          onChange={(e) => handleRoleChange(user.id, e.target.value)}
          size="small"
        >
          {rolesList.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
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
            {!isLoggedIn ? (
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
                  <MDTypography variant="h6" color="white">
                    Login Required
                  </MDTypography>
                </MDBox>
                <MDBox pt={3} px={3} pb={3}>
                  <form onSubmit={handleLogin}>
                    <MDBox mb={2}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </MDBox>
                    <MDBox mb={2}>
                      <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </MDBox>
                    <MDButton
                      type="submit"
                      variant="gradient"
                      color="info"
                      fullWidth
                    >
                      Login
                    </MDButton>
                  </form>
                </MDBox>
              </Card>
            ) : (
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
                  <MDTypography variant="h6" color="white">
                    Edit User Roles
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  {loading ? (
                    <MDTypography variant="button">Loading...</MDTypography>
                  ) : (
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={false}
                      noEndBorder
                    />
                  )}
                </MDBox>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
