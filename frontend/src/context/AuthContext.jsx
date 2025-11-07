// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { listMyStores } from "../api/store";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);        // array de strings
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Normaliza errores del backend a un array de strings
  const toArray = (err) => {
    const res = err?.response?.data;
    if (Array.isArray(res?.errors)) return res.errors;
    if (typeof res?.message === "string") return [res.message];
    return ["Ocurrió un error. Intenta nuevamente."];
  };

  // Carga el perfil actual y devuelve el usuario
  const loadProfile = async () => {
    try {
      const { data } = await api.get("/auth/profile");
      setUser(data);
      setIsAuthenticated(true);
      return data; // 👈 importante para saber el rol después de login/register
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Decide a dónde mandar según si el usuario ya tiene tiendas o no (solo vendedores)
  const redirectByStores = async () => {
    try {
      const { data } = await listMyStores();
      const stores = Array.isArray(data) ? data : [];
      if (stores.length > 0) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch {
      // Si falla la carga de tiendas, por seguridad lo mandamos a onboarding
      navigate("/onboarding");
    }
  };

  const login = async (values) => {
    setErrors([]);
    try {
      await api.post("/auth/login", values);

      const profile = await loadProfile(); // 👈 obtenemos el usuario con su rol

      if (profile?.role === "vendedor") {
        // VENDEDOR → flujo de tiendas
        await redirectByStores();
      } else {
        // CLIENTE (o cualquier otro) → a la home pública
        navigate("/");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "No se pudo iniciar sesión";
      setErrors([msg]);
    }
  };

  const register = async (values) => {
    setErrors([]);
    try {
      await api.post("/auth/register", values);

      const profile = await loadProfile(); // 👈 usuario recién creado con rol

      if (profile?.role === "vendedor") {
        // VENDEDOR → onboarding/dashboard según tenga tiendas
        await redirectByStores();
      } else {
        // CLIENTE → directo a explorar negocios
        navigate("/");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || "No se pudo completar el registro";
      setErrors([msg]);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const value = useMemo(
    () => ({
      user,
      errors,
      isAuthenticated,
      loadingProfile,
      login,
      register,
      logout,
      setErrors,
    }),
    [user, errors, isAuthenticated, loadingProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
