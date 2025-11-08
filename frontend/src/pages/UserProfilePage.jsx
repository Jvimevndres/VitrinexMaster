// src/pages/UserProfilePage.jsx
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/user";

export default function UserProfilePage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProfile();
        setForm((f) => ({
          ...f,
          username: data.username || "",
          email: data.email || "",
        }));
      } catch (err) {
        setError(
          err?.response?.data?.message || "No se pudo cargar tu perfil"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!form.username.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!form.email.trim()) {
      setError("El correo es obligatorio");
      return;
    }
    if (form.password && form.password.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const payload = {
      username: form.username,
      email: form.email,
    };
    if (form.password) payload.password = form.password;

    try {
      await updateProfile(payload);
      setMsg("Perfil actualizado correctamente");
      setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
    } catch (err) {
      setError(
        err?.response?.data?.message || "No se pudo actualizar el perfil"
      );
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 520, margin: "4rem auto" }}>
        <h1>Mi perfil</h1>
        <p>Cargando…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "4rem auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Mi perfil</h1>

      {error && (
        <div style={{ color: "crimson", marginBottom: 10 }}>{error}</div>
      )}
      {msg && <div style={{ color: "green", marginBottom: 10 }}>{msg}</div>}

      <form onSubmit={onSubmit} noValidate>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
          Nombre
        </label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={onChange}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
          Correo
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <hr style={{ margin: "16px 0" }} />

        <p style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>
          Si no quieres cambiar la contraseña, deja estos campos vacíos.
        </p>

        <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
          Nueva contraseña
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <label style={{ display: "block", fontWeight: 600, marginBottom: 4 }}>
          Repetir contraseña
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onChange}
          style={{ width: "100%", padding: 10, marginBottom: 20 }}
        />

        <button type="submit" style={{ padding: "8px 16px" }}>
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
