// src/pages/RegisterPage.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");

export default function RegisterPage() {
  const { register, errors: apiErrors } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "cliente", // 👈 por defecto cliente
  });
  const [localErrors, setLocalErrors] = useState([]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
    register(form); // 👈 aquí ya va username, email, password, role
  };

  const allErrors = useMemo(
    () => [
      ...(localErrors || []),
      ...((apiErrors && Array.isArray(apiErrors)) ? apiErrors : []),
    ],
    [localErrors, apiErrors]
  );

  return (
    <div style={{ maxWidth: 520, margin: "4rem auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Crear cuenta</h1>

      {allErrors.length > 0 && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          {allErrors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <input
          type="text"
          name="username"
          placeholder="Nombre"
          value={form.username}
          onChange={onChange}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
          required
          minLength={2}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={onChange}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={onChange}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
          required
          minLength={6}
        />

        {/* 👇 Selector de rol */}
        <div style={{ margin: "10px 0 16px" }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Tipo de cuenta
          </div>
          <label style={{ display: "block", marginBottom: 4 }}>
            <input
              type="radio"
              name="role"
              value="cliente"
              checked={form.role === "cliente"}
              onChange={onChange}
              style={{ marginRight: 6 }}
            />
            Cliente (buscar negocios y reservar/comprar)
          </label>
          <label style={{ display: "block" }}>
            <input
              type="radio"
              name="role"
              value="vendedor"
              checked={form.role === "vendedor"}
              onChange={onChange}
              style={{ marginRight: 6 }}
            />
            Vendedor (crear mi negocio en Vitrinex)
          </label>
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>
          Registrarme
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
