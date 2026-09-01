import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const baseLinkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_-4px_rgba(52,211,153,0.15)]"
        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 hover:scale-[1.02]"
    }`;

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "H" },
    { to: "/pacientes", label: "Pacientes", icon: "P" },
    { to: "/profissionais", label: "Profissionais", icon: "M" },
    { to: "/consultas", label: "Consultas", icon: "C" },
    { to: "/prontuario", label: "Prontuario", icon: "R" },
    { to: "/prescricoes", label: "Prescricoes", icon: "X" },
    { to: "/anexos", label: "Exames", icon: "E" },
    { to: "/ia", label: "Modulo IA", icon: "I" },
    { to: "/perfil", label: "Perfil", icon: "U" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* 🌟 Header com fade-in-down */}
      <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40 animate-fade-in-down">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden size-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 active:scale-95 transition-all">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex items-center gap-2.5">
            <span className="bg-emerald-600 text-white text-xs font-black px-2 py-1 rounded animate-glow">IA</span>
            <span className="font-bold text-zinc-100 text-lg tracking-tight">iAssis</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NavLink to="/perfil" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-all duration-200 hover:scale-[1.02]">
            <div className="size-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-xs font-bold flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110">
              {profile?.nome_completo?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden sm:inline">{profile?.nome_completo?.split(" ")[0] || "Usuario"}</span>
          </NavLink>
          <button onClick={signOut} className="text-xs font-medium text-zinc-500 hover:text-red-400 transition-all duration-200 hover:scale-105">Sair</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 🌀 Sidebar com fade-in-left */}
        <aside className={`fixed md:sticky top-0 left-0 z-30 h-screen w-56 bg-zinc-900/90 backdrop-blur-sm border-r border-zinc-800 pt-4 pb-6 px-3 transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${sidebarOpen ? "" : "md:animate-fade-in-left"}`}>
          <nav className="flex flex-col gap-1 stagger-rows" onClick={() => setSidebarOpen(false)}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={baseLinkClass}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />}
        {/* 📄 Conteúdo principal com fade-in-up */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in-up">{children}</main>
      </div>
    </div>
  );
}