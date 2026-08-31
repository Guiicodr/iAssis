import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-[#8ba888] border-t-transparent animate-spin" />
          <p className="text-sm text-[#6b7280] font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed]">
        <div className="size-8 rounded-full border-2 border-[#8ba888] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}