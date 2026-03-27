'use client'
import ClientDashboardPage from "../_components/pages/ClientDashboardPage";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["client", "admin"]}>
      <ClientDashboardPage />
    </ProtectedRoute>
  );
}
