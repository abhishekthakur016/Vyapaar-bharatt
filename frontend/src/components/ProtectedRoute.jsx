import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  // ==========================================
  // GET LOGIN DATA
  // ==========================================

  const token = localStorage.getItem("vyapaar_token");
  const userData = localStorage.getItem("vyapaar_user");

  // ==========================================
  // USER NOT LOGGED IN
  // ==========================================

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // PARSE USER
  // ==========================================

  let user = null;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    console.error("Invalid user data:", error);

    localStorage.removeItem("vyapaar_token");
    localStorage.removeItem("vyapaar_user");

    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // USER DATA NOT FOUND
  // ==========================================

  if (!user) {
    localStorage.removeItem("vyapaar_token");
    localStorage.removeItem("vyapaar_user");

    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // ROLE CHECK
  // ==========================================

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // ACCESS GRANTED
  // ==========================================

  return <Outlet />;
};

export default ProtectedRoute;
