'use client'
import AdminDashboarPage from "../_components/pages/AdminDashboarPage";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboarPage />
    </ProtectedRoute>
  );
}
