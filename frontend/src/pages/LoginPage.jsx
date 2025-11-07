// src/pages/LoginPage.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainHeader from "../components/MainHeader";

export default function LoginPage() {
  const { login, errors: apiErrors, setErrors } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [localErrors, setLocalErrors] = useState([]);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setLocalErrors([]);
    setErrors?.([]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = [];

    if (!form.email) errs.push("Ingresa tu correo electrónico.");
    if (!form.password) errs.push("Ingresa tu contraseña.");

    if (errs.length) {
      setLocalErrors(errs);
      return;
    }

    setLocalErrors([]);
    login(form);
  };

  const allErrors = useMemo(
    () => [
      ...(localErrors || []),
      ...((apiErrors && Array.isArray(apiErrors)) ? apiErrors : []),
    ],
    [localErrors, apiErrors]
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <MainHeader subtitle="Ingresa para gestionar tus negocios" />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Iniciar sesión
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Accede a tu panel de Vitrinex con tu correo y contraseña.
            </p>
          </div>

          {allErrors.length > 0 && (
            <div className="text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 space-y-1">
              {allErrors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2 transition"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Crear una cuenta
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
