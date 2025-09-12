// src/routes.js

// Spotlight Admin layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import CreateForm from "layouts/create-form";
import CreateCategory from "layouts/create-category";
import UsersTable from "layouts/users-table"; // Users Table
import EditUsers from "layouts/edit-users";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";

// Auth wrapper
import PrivateRoute from "components/PrivateRoute";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <PrivateRoute roles={["Admin", "Chief Admin"]}>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Manage Posts",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: (
      <PrivateRoute roles={["Admin", "Chief Admin"]}>
        <Tables />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Create News",
    key: "create-form",
    route: "/create-form",
    icon: <Icon>note_add</Icon>,
    component: (
      <PrivateRoute roles={["Admin", "Chief Admin"]}>
        <CreateForm />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Manage Post Categories",
    key: "create-category",
    route: "/create-category",
    icon: <Icon>category</Icon>,
    component: (
      <PrivateRoute roles={["Admin", "Chief Admin"]}>
        <CreateCategory />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Users Table",
    key: "users-table",
    route: "/users-table",
    icon: <Icon>people</Icon>,
    component: (
      <PrivateRoute roles={["Chief Admin", "Admin"]}>
        <UsersTable />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Edit Users",
    key: "edit-users",
    route: "/edit-users", // <-- URL for edit roles
    icon: <Icon>edit</Icon>,
    component: (
      <PrivateRoute roles={["Chief Admin", "Admin"]}>
        <EditUsers />
      </PrivateRoute>
    ),
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: (
      <PrivateRoute roles={["Admin", "Chief Admin", "Visitor"]}>
        <Profile />
      </PrivateRoute>
    ),
  },
  // Public routes
// Keep sign-in and sign-up routes
{
  type: "auth", // not "collapse"
  name: "Sign In",
  key: "sign-in",
  icon: <Icon fontSize="small">login</Icon>,
  route: "/authentication/sign-in",
  component: <SignIn />,
  hidden: true, // <-- custom property
},
{
  type: "auth",
  name: "Sign Up",
  key: "sign-up",
  icon: <Icon fontSize="small">assignment</Icon>,
  route: "/authentication/sign-up",
  component: <SignUp />,
  hidden: true, // <-- custom property
},

];

export default routes;
