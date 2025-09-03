// Spotlight Admin layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import CreateForm from "layouts/create-form";
import CreateCategory from "layouts/create-category";
import UsersTable from "layouts/users-table";
import EditUsers from "layouts/edit-users";

import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    roles: ["Chief Admin", "Admin"],
    protected: true, // ✅
  },
  {
    type: "collapse",
    name: "Posts",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
    roles: ["Chief Admin", "Admin"],
    protected: true, // ✅
  },
  {
    type: "collapse",
    name: "Create News",
    key: "create-form",
    route: "/create-form",
    icon: <Icon>note_add</Icon>,
    component: <CreateForm />,
    roles: ["Chief Admin", "Admin"],
    protected: true, // ✅
  },
  {
    type: "collapse",
    name: "Create Category",
    key: "create-category",
    route: "/create-category",
    icon: <Icon>category</Icon>,
    component: <CreateCategory />,
    roles: ["Chief Admin", "Admin"],
    protected: true, // ✅
  },
  {
    type: "collapse",
    name: "Users Table",
    key: "users-table",
    route: "/users-table",
    icon: <Icon>people</Icon>,
    component: <UsersTable />,
    roles: ["Chief Admin"],
    protected: true, // ✅
  },
  {
    type: "collapse",
    name: "Edit Users",
    key: "edit-users",
    route: "/edit-users",
    icon: <Icon>edit</Icon>,
    component: <EditUsers />,
    roles: ["Chief Admin"],
    protected: true, // ✅
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    roles: ["Chief Admin", "Admin", "Visitor"],
    protected: true, // ✅ everyone logged in
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    public: true, // ✅
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
    public: true, // ✅
  },
];

export default routes;
