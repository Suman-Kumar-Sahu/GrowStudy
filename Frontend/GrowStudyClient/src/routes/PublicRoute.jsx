import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  if (user) {
    const redirectPath = user.role === "recruiter" ? "/recruiter" : "/student/dashboard";
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};