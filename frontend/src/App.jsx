import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import Profissionais from "./pages/Profissionais";
import Consultas from "./pages/Consultas";
import IA from "./pages/IA";
import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Páginas do sistema envelopadas pelo Layout */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/pacientes"
          element={
            <DashboardLayout>
              <Pacientes />
            </DashboardLayout>
          }
        />
        <Route
          path="/profissionais"
          element={
            <DashboardLayout>
              <Profissionais />
            </DashboardLayout>
          }
        />
        <Route
          path="/consultas"
          element={
            <DashboardLayout>
              <Consultas />
            </DashboardLayout>
          }
        />
        <Route
          path="/ia"
          element={
            <DashboardLayout>
              <IA />
            </DashboardLayout>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}