import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    function fazerLoginSimulado(e) {
        e.preventDefault();

        // 1. Gera um token fake para simular o backend
        const fakeToken = "token_de_teste_123456";
        localStorage.setItem("token", fakeToken);

        // 2. Redireciona direto para o Dashboard
        navigate("/dashboard");
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <form onSubmit={fazerLoginSimulado} style={{ display: "flex", flexDirection: "column", width: "320px", gap: "12px" }}>
                <h1>IAssis</h1>
                <p style={{ fontSize: "12px", color: "#666" }}>Modo de desenvolvimento (Mock ativo)</p>

                <input
                    type="email"
                    placeholder="E-mail (digite qualquer um)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Senha (digite qualquer uma)"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />

                <button type="submit">Entrar no Dashboard</button>
            </form>
        </div>
    );
}

export default Login;