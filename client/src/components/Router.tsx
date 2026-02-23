import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import Login from "../pages/auth/Login";
import AddPost from "../pages/posts/AddPost";
import EditPost from "../pages/posts/EditPost";
import ManagePosts from "../pages/posts/ManagePost";
import AddRole from "../pages/roles/AddRole";
import EditRole from "../pages/roles/EditRole";
import ManageRoles from "../pages/roles/ManageRole";
import AddUser from "../pages/users/AddUser";
import EditUser from "../pages/users/EditUser";
import ManageUsers from "../pages/users/ManageUser";
import CreatePost from "../modules/posts/CreatePost";

export default function AppRouter() {
  const routeConfig = [
    { path: "/login", element: <Login />, protected: false },

    // Posts module
    {
      path: "/posts",
      element: <ManagePosts />,
      protected: true,
      module: "posts",
      action: "read",
    },
    {
      path: "/posts/add",
      element: <AddPost />,
      protected: true,
      module: "posts",
      action: "create",
    },
    {
      path: "/posts/create",
      element: <CreatePost />,
      protected: true,
      module: "posts",
      action: "create",
    },
    {
      path: "/posts/edit/:id",
      element: <EditPost />,
      protected: true,
      module: "posts",
      action: "update",
    },

    // Users module
    {
      path: "/users",
      element: <ManageUsers />,
      protected: true,
      module: "users",
      action: "read",
    },
    {
      path: "/users/add",
      element: <AddUser />,
      protected: true,
      module: "users",
      action: "create",
    },
    {
      path: "/users/:id",
      element: <EditUser />,
      protected: true,
      module: "users",
      action: "update",
    },

    // Roles module
    {
      path: "/roles",
      element: <ManageRoles />,
      protected: true,
      module: "roles",
      action: "read",
    },
    {
      path: "/roles/add",
      element: <AddRole />,
      protected: true,
      module: "roles",
      action: "create",
    },
    {
      path: "/roles/:id",
      element: <EditRole />,
      protected: true,
      module: "roles",
      action: "update",
    },
    // Default route
    {
      path: "/",
      element: <ManagePosts />,
      protected: true,
      module: "posts",
      action: "read",
    },
  ];

  return (
    <Routes>
      {routeConfig.map((r) => {
        if (!r.protected) {
          return <Route key={r.path} path={r.path} element={r.element} />;
        }

        const child = React.cloneElement(r.element, {
          module: r.module,
          action: r.action,
        });

        return (
          <Route
            key={r.path}
            path={r.path}
            element={<ProtectedRoute>{child}</ProtectedRoute>}
          />
        );
      })}
    </Routes>
  );
}
