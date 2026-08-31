import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import ProtectedRoute, { PublicOnlyRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import Dashboard from "@/pages/Dashboard";
import Pacientes from "@/pages/Pacientes";
import Profissionais from "@/pages/Profissionais";
import Consultas from "@/pages/Consultas";
import IA from "@/pages/IA";
import Perfil from "@/pages/Perfil";

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          style: { fontSize: "14px" },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/cadastro" element={<PublicOnlyRoute><Cadastro /></PublicOnlyRoute>} />

          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>}
          />
          <Route
            path="/pacientes"
            element={<ProtectedRoute><DashboardLayout><Pacientes /></DashboardLayout></ProtectedRoute>}
          />
          <Route
            path="/profissionais"
            element={<ProtectedRoute><DashboardLayout><Profissionais /></DashboardLayout></ProtectedRoute>}
          />
          <Route
            path="/consultas"
            element={<ProtectedRoute><DashboardLayout><Consultas /></DashboardLayout></ProtectedRoute>}
          />
          <Route
            path="/ia"
            element={<ProtectedRoute><DashboardLayout><IA /></DashboardLayout></ProtectedRoute>}
          />
          <Route
            path="/perfil"
            element={<ProtectedRoute><DashboardLayout><Perfil /></DashboardLayout></ProtectedRoute>}
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}