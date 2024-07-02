import React from "react";
import ReactDOM from "react-dom/client";

import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "mantine-datatable/styles.layer.css";
import "./index.css";

import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout.tsx";
import PrivateRoutes from "./privateRoutes.tsx";
import Login from "./routes/Login/Login.tsx";
import NotFound from "./routes/NotFound/NotFound.tsx";

const Inventory = React.lazy(() => import("./routes/Inventory/Inventory.tsx"));
const Dashboard = React.lazy(() => import("./routes/Dashboard/Dashboard.tsx"));
const Account = React.lazy(() => import("./routes/Account/Account.tsx"));
const ManageUsers = React.lazy(
  () => import("./routes/ManageUsers/ManageUsers.tsx")
);
const Security = React.lazy(() => import("./routes/Security/Security.tsx"));

const queryClient = new QueryClient();

const customDefaultProps = {
  defaultProps: {
    size: "md",
  },
};

const theme = createTheme({
  primaryColor: "teal",
  components: {
    Button: customDefaultProps,
    TextInput: customDefaultProps,
    PasswordInput: customDefaultProps,
    Select: customDefaultProps,
    Autocomplete: customDefaultProps,
    NumberInput: customDefaultProps,
    Card: {
      defaultProps: {
        radius: "md",
        shadow: "sm",
        withBorder: "true",
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: "",
    element: <PrivateRoutes />,
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Inventory />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "account",
            element: <Account />,
          },
          {
            path: "users",
            element: <ManageUsers />,
          },
          {
            path: "security",
            element: <Security />,
          },
        ],
        errorElement: <NotFound />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    children: [],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <Notifications />
        <ModalsProvider>
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
