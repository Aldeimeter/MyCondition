import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/measures" replace />;
  }

  return <>{children}</>;
};
