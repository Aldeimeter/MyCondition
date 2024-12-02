import { Routes, Route, Navigate } from "react-router-dom";
import {
  SignUp,
  Login,
  Methods,
  Measures,
  Advertisement,
  Users,
} from "@/pages";
import { AdminRoute, PrivateRoute } from "@/features/auth";
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
        <Route path="methods" element={<Methods />} />
        <Route path="measures" element={<Measures />} />

        {/* Admin protected routes wrapped in AdminRoute */}
        <Route
          path="admin/*"
          element={
            <AdminRoute>
              <Routes>
                <Route path="users" element={<Users />} />
                <Route path="advertisements" element={<Advertisement />} />
              </Routes>
            </AdminRoute>
          }
        ></Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/measures" replace />} />
    </Routes>
  );
};

export default AppRouter;
