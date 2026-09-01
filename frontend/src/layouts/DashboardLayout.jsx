import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AmbientBackground from "@/components/AmbientBackground";
import {
  LayoutDashboard, Calendar, Users, FileText,
  TrendingUp, StickyNote, Briefcase, Pill,
  Paperclip, Brain, UserCircle, ChevronDown,
  Menu, LogOut
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [maisOpen, setMaisOpen] = useState(false);

  const iconClass = "size-4 shrink-0";
  const activeClass =
    "bg-primary/10 text-primary border border-primary/20 font-medium";
  const idleClass =
    "text-muted-foreground hover:text-foreground hover:bg-muted/60";

  function linkClass({ isActive }) {
    return `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
      isActive ? activeClass : idleClass
    }`;
  }

  const mainItems = [
    { to: "/dashboard", label: "Painel", icon: LayoutDashboard },
    { to: "/consultas", label: "Agenda", icon: Calendar },
    { to: "/pacientes", label: "Pacientes", icon: Users },
    { to: "/prontuario", label: "Prontuário", icon: FileText },
    { to: "/evolucao", label: "Evolução", icon: TrendingUp },
    { to: "/notas", label: "Notas", icon: StickyNote },
  ];

  const maisItems = [
    { to: "/profissionais", label: "Profissionais", icon: Briefcase },
    { to: "/prescricoes", label: "Prescrições", icon: Pill },
    { to: "/anexos", label: "Anexos", icon: Paperclip },
    { to: "/ia", label: "Módulo IA", icon: Brain },
    { to: "/perfil", label: "Perfil", icon: UserCircle },
  ];

  const initials = profile?.nome_completo
    ?.split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <AmbientBackground />
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-40 animate-fade-in-down">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden size-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground active:scale-95 transition-all"><Menu className="size-5" /></button>
          <div className="flex items-center gap-2.5">
            <span className="size-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-bold flex items-center justify-center shadow-sm">iA</span>
            <span className="font-bold text-foreground text-lg tracking-tight">iAssis</span>
          </div>
        </div>
        <NavLink to="/perfil" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
          <div className="size-7 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xs font-bold flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110">{initials}</div>
          <span className="hidden sm:inline">{profile?.nome_completo?.split(" ")[0] || "Usuário"}</span>
        </NavLink>
      </header>
      <div className="flex flex-1 relative z-10">
        <aside className={`fixed md:sticky top-0 left-0 z-30 h-screen w-56 bg-card/90 backdrop-blur-sm border-r border-border pt-4 pb-4 px-3 flex flex-col transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${sidebarOpen ? "" : "md:animate-fade-in-left"}`}>
          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em] px-3 pb-1 pt-2">Visão Geral</p>
            {mainItems.slice(0, 4).map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/dashboard"} className={linkClass} onClick={() => setSidebarOpen(false)}>
                <item.icon className={iconClass} />{item.label}
              </NavLink>
            ))}
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em] px-3 pb-1 pt-4">Acompanhamento</p>
            {mainItems.slice(4).map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
                <item.icon className={iconClass} />{item.label}
              </NavLink>
            ))}
            <div className="pt-2">
              <button onClick={() => setMaisOpen(!maisOpen)} className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 ${idleClass}`}>
                <ChevronDown className={`size-3.5 transition-transform duration-200 ${maisOpen ? "rotate-0" : "-rotate-90"}`} />
                Mais
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${maisOpen ? "max-h-80 mt-1" : "max-h-0"}`}>
                <div className="flex flex-col gap-0.5 pl-4">
                  {maisItems.map((item) => (
                    <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setSidebarOpen(false)}>
                      <item.icon className={iconClass} />{item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </nav>
          <div className="pt-3 border-t border-border mt-2">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50">
              <div className="size-9 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-bold flex items-center justify-center shadow-sm shrink-0">{initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{profile?.nome_completo || "Usuário"}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                  <span className="text-[11px] text-muted-foreground">Em atendimento</span>
                </div>
              </div>
              <button onClick={signOut} title="Sair" className="size-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </aside>
        {sidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fade-in-up">{children}</main>
      </div>
    </div>
  );
}