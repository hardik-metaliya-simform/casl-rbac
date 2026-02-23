import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, getLocalAbilities } from "./auth";

/**
 * ProtectedRoute component that renders a child component only if the user is authenticated
 * and has the required permissions based on cached abilities.
 *
 * The route will:
 * - Check if the user is authenticated by verifying the presence of a valid token.
 * - Check if the child component specifies any required permissions (either via `module` and `action`
 *   or through the `requiredPermission` prop).
 * - Render the child component only if the user's abilities (cached locally) permit the required action.
 *
 * If any of these conditions are not met, the user will be redirected to appropriate pages:
 * - If no token is found (i.e., the user is not authenticated), the user is redirected to the login page (`/login`).
 * - If the user lacks the required permissions, they will be redirected to the home page (`/`).
 *
 * @param {React.ReactNode} children - The child components to be conditionally rendered.
 *
 * @returns {React.ReactNode} - The rendered child component if the user is authenticated and authorized,
 *                               otherwise, a `Navigate` component to redirect the user.
 */
export default function ProtectedRoute({ children }: { children: any }) {
  // Check if the user has a valid token (i.e., is authenticated)
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  // Ensure only one child is provided and check for permission requirements
  const child = React.Children.only(children) as React.ReactElement | null;
  const req =
    child?.props?.requiredPermission ||
    (child?.props?.module && child?.props?.action
      ? { module: child.props.module, action: child.props.action }
      : null);

  // If no permissions are required, render the child as usual
  if (!req) return children;

  // Get the local abilities from cache
  const abilities = getLocalAbilities();

  // Check if the user has the necessary ability for the given module and action
  const allowed = (abilities[req.module] || []).includes(req.action);

  // If the user lacks permission, redirect to the home page
  if (!allowed) return <Navigate to="/" replace />;

  // If all conditions are met, render the child component
  return children;
}
