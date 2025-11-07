// src/pages/RegisterPage.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainHeader from "../components/MainHeader";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

export default function RegisterPage() {
  const { register, errors: apiErrors, setErrors } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "cliente",
  });
  const [localErrors, setLocalErrors] = useState([]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setLocalErrors([]);
    setErrors?.([]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = [];

    if (!form.username || form.username.trim().length < 2)
      errs.push("Ingresa un nombre válido (mínimo 2 caracteres).");

    if (!isEmail(form.email))
      errs.push("Ingresa un correo electrónico válido.");

    if ((form.password || "").length < 6)
      errs.push("La contraseña debe tener al menos 6 caracteres.");

    if (!["cliente", "vendedor"].includes(form.role)) {
      errs.push("Selecciona un tipo de cuenta válido.");
    }

    if (errs.length) {
      setLocalErrors(errs);
      return;
    }

    setLocalErrors([]);
    register(form);
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
      <MainHeader subtitle="Crea tu cuenta para comenzar" />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Crear cuenta
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Regístrate como cliente o vendedor en Vitrinex.
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
                Nombre
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tu nombre"
                required
                minLength={2}
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <div>
              <p className="block text-sm font-medium text-slate-700 mb-1">
                Tipo de cuenta
              </p>
              <div className="space-y-1 text-sm text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="cliente"
                    checked={form.role === "cliente"}
                    onChange={onChange}
                    className="accent-blue-600"
                  />
                  <span>
                    Cliente{" "}
                    <span className="text-xs text-slate-500">
                      (buscar negocios y reservar/comprar)
                    </span>
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="vendedor"
                    checked={form.role === "vendedor"}
                    onChange={onChange}
                    className="accent-blue-600"
                  />
                  <span>
                    Vendedor{" "}
                    <span className="text-xs text-slate-500">
                      (crear y gestionar mis negocios)
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg py-2 transition"
            >
              Registrarme
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
