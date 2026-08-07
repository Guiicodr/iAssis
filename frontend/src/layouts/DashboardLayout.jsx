import { NavLink, useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    const linkClass = ({ isActive }) =>
        `px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${isActive
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        }`;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            {/* Header Dark */}
            <header className="bg-slate-900 border-b border-slate-800 px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2.5">
                        <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2 py-1 rounded">IA</span>
                        <span className="font-bold text-slate-100 text-lg tracking-tight">IAssis</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-2">
                        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                        <NavLink to="/pacientes" className={linkClass}>Pacientes</NavLink>
                        <NavLink to="/profissionais" className={linkClass}>Profissionais</NavLink>
                        <NavLink to="/consultas" className={linkClass}>Consultas</NavLink>
                        <NavLink to="/ia" className={linkClass}>Módulo IA</NavLink>
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors"
                >
                    Sair
                </button>
            </header>

            {/* Main Container preenchendo melhor a área útil */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-6">
                {children}
            </main>
        </div>
    );
}