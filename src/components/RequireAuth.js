import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Send user to /login and remember where they tried to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

