import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const role = localStorage.getItem("role");

  if (role !== "1") {
    // Redirect non-admin users to the home page
    return <Navigate to="/home" replace />;
  }

  return children;
}
