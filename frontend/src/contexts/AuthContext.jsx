import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error && data) setProfile(data);
    else setProfile(null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription?.unsubscribe();
  }, [fetchProfile]);

  const signUp = async ({ email, senha, nome_completo, papel }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome_completo, papel } },
    });

    if (error) {
      if (error.message.includes("already")) {
        throw new Error("Este e-mail já está cadastrado");
      }
      if (error.message.includes("password")) {
        throw new Error("Senha muito fraca. Use ao menos 6 caracteres, números e maiúsculas");
      }
      throw new Error(error.message);
    }

    if (data?.user?.identities?.length === 0) {
      throw new Error("Este e-mail já está cadastrado");
    }

    if (data.session) {
      setSession(data.session);
      await fetchProfile(data.user.id);
    }

    return data;
  };

  const signIn = async ({ email, senha }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      if (error.message.includes("Invalid login")) {
        throw new Error("E-mail ou senha inválidos");
      }
      throw new Error(error.message);
    }

    setSession(data.session);
    await fetchProfile(data.user.id);
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.user.id);
    if (error) throw new Error(error.message);
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const value = {
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    user: session?.user ?? null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}