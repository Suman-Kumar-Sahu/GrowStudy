import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const RoleRoute = ({ role }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/user/login" replace />;
  }
  
  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};