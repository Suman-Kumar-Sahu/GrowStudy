import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../layout/Layout";

export const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/user/login" replace />;
  }
  
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};