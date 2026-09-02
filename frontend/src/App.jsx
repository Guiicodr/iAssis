import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { PublicOnlyRoute, ProfissionalRoute, PacienteRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import Login from "@/pages/Login";
import Cadastro from "@/pages/Cadastro";
import Dashboard from "@/pages/Dashboard";
import Pacientes from "@/pages/Pacientes";
import Profissionais from "@/pages/Profissionais";
import Consultas from "@/pages/Consultas";
import ProntuarioEletronico from "@/pages/ProntuarioEletronico";
import Anexos from "@/pages/Anexos";
import PrescricaoDigital from "@/pages/PrescricaoDigital";
import Evolucao from "@/pages/Evolucao";
import Notas from "@/pages/Notas";
import RecuperarSenha from "@/pages/RecuperarSenha";
import PoliticaAcesso from "@/pages/PoliticaAcesso";
import IA from "@/pages/IA";
import Perfil from "@/pages/Perfil";
import PortalPaciente from "@/pages/PortalPaciente";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors closeButton
        toastOptions={{ style: { fontSize: "14px" } }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/cadastro" element={<PublicOnlyRoute><Cadastro /></PublicOnlyRoute>} />
          <Route path="/recuperar-senha" element={<PublicOnlyRoute><RecuperarSenha /></PublicOnlyRoute>} />
          <Route path="/politica-acesso" element={<PoliticaAcesso />} />

          {/* Rotas para Profissionais */}
          <Route path="/dashboard" element={<ProfissionalRoute><DashboardLayout><Dashboard /></DashboardLayout></ProfissionalRoute>} />
          <Route path="/pacientes" element={<ProfissionalRoute><DashboardLayout><Pacientes /></DashboardLayout></ProfissionalRoute>} />
          <Route path="/profissionais" element={<ProfissionalRoute><DashboardLayout><Profissionais /></DashboardLayout></ProfissionalRoute>} />
          <Route path="/consultas" element={<ProfissionalRoute><DashboardLayout><Consultas /></DashboardLayout></ProfissionalRoute>} />
          <Route path="/prontuario" element={<ProfissionalRoute><DashboardLayout><ProntuarioEletronico /></DashboardLayout></ProfissionalRoute>} />
          <Route path="/anexos" element={<ProfissionalRoute><DashboardLayout><Anexos /></DashboardLayout></ProfissionalRoute>} />
          <Route path="/prescricoes" element={<ProfissionalRoute><DashboardLayout><PrescricaoDigital /></DashboardLayout></ProfissionalRoute>} />
          <Route path="/evolucao" element={<ProfissionalRoute><DashboardLayout><Evolucao /></DashboardLayout></ProfissionalRoute>} />
          <Route path="/notas" element={<ProfissionalRoute><DashboardLayout><Notas /></DashboardLayout></ProfissionalRoute>} />
          <Route path="/ia" element={<ProfissionalRoute><DashboardLayout><IA /></DashboardLayout></ProfissionalRoute>} />
          <Route path="/perfil" element={<ProfissionalRoute><DashboardLayout><Perfil /></DashboardLayout></ProfissionalRoute>} />

          {/* Rota para Pacientes */}
          <Route path="/portal" element={<PacienteRoute><DashboardLayout><PortalPaciente /></DashboardLayout></PacienteRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}