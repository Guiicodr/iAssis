import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Interceptor to attach Supabase session token to FastAPI requests
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data?.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  return config;
});

export default api;