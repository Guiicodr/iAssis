import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    // Estilo base para os links da navegação
    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
            ? "bg-blue-600 text-white font-semibold"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between p-4 shadow-lg">
            <div>
                {/* Logo / Título */}
                <div className="px-4 py-4 mb-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold tracking-wide text-blue-400">IAssis</h1>
                    <p className="text-xs text-slate-400 mt-1">Gestão Inteligente</p>
                </div>

                {/* Links de Navegação */}
                <nav className="flex flex-col gap-1">
                    <NavLink to="/dashboard" className={linkClass}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/pacientes" className={linkClass}>
                        Pacientes
                    </NavLink>
                    <NavLink to="/profissionais" className={linkClass}>
                        Profissionais
                    </NavLink>
                    <NavLink to="/consultas" className={linkClass}>
                        Consultas
                    </NavLink>
                    <NavLink to="/ia" className={linkClass}>
                        Módulo IA
                    </NavLink>
                </nav>
            </div>

            {/* Botão de Logout */}
            <div className="pt-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    Sair do Sistema
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;