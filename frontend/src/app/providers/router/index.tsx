import { Routes, Route, Navigate } from "react-router-dom";
import { SignUp, Login, Dashboard, Methods, Measures } from "@/pages";
import { PrivateRoute } from "@/features/auth";
import { Layout } from "@/app/Layout";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      {/* Routes inside the Layout */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="methods" element={<Methods />} />
        <Route path="measures" element={<Measures />} />
        <Route path="users" element={<Dashboard />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
