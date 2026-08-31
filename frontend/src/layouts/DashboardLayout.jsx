import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({ children }) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-[#8ba888]/10 text-[#8ba888] border border-[#8ba888]/20"
        : "text-[#6b7280] hover:text-[#374151] hover:bg-[#f3f4f6]"
    }`;

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/pacientes", label: "Pacientes", icon: "👤" },
    { to: "/profissionais", label: "Profissionais", icon: "👨‍⚕️" },
    { to: "/consultas", label: "Consultas", icon: "📅" },
    { to: "/ia", label: "Módulo IA", icon: "🤖" },
    { to: "/perfil", label: "Perfil", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#1f2937] flex flex-col">
      {/* Top header */}
      <header className="bg-white border-b border-[#e5e7eb] px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden size-8 flex items-center justify-center rounded-lg hover:bg-[#f3f4f6] text-[#6b7280]"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5">
            <span className="bg-[#8ba888] text-white text-xs font-black px-2 py-1 rounded">IA</span>
            <span className="font-bold text-[#1f2937] text-lg tracking-tight">iAssis</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NavLink to="/perfil" className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#374151]">
            <div className="size-7 rounded-full bg-[#8ba888] text-white text-xs font-bold flex items-center justify-center">
              {profile?.nome_completo?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden sm:inline">{profile?.nome_completo?.split(" ")[0] || "Usuário"}</span>
          </NavLink>
          <button
            onClick={signOut}
            className="text-xs font-medium text-[#9ca3af] hover:text-[#dc2626] transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-0 md:top-0 left-0 z-30 h-screen w-56 bg-white border-r border-[#e5e7eb] pt-4 pb-6 px-3
            transition-transform duration-200
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <nav className="flex flex-col gap-1" onClick={() => setSidebarOpen(false)}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}