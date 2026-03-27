'use client'
import EditorDashboardPage from "../_components/pages/EditorDashboardPage";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["editor", "admin"]}>
      <EditorDashboardPage />
    </ProtectedRoute>
  );
}
