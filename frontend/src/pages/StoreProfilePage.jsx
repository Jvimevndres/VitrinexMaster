// src/pages/StoreProfilePage.jsx
import { useEffect, useState } from "react";
import { getMyStore, updateMyStore } from "../api/store";

export default function StoreProfilePage() {
  const [form, setForm] = useState({
    name: "",
    mode: "products",
    description: "",
    logoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyStore();
        setForm({
          name: data.name || "",
          mode: data.mode || "products",
          description: data.description || "",
          logoUrl: data.logoUrl || "",
        });
      } catch (err) {
        if (err?.response?.status === 404) {
          setError(
            "Aún no has creado tu tienda. Puedes crearla desde el onboarding."
          );
        } else {
          setError(
            err?.response?.data?.message || "No se pudo cargar la tienda"
          );
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!form.name.trim()) {
      setError("El nombre de la tienda es obligatorio");
      return;
    }

    try {
      await updateMyStore(form);
      setMsg("Tienda actualizada correctamente");
    } catch (err) {
      setError(
        err?.response?.data?.message || "No se pudo actualizar la tienda"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil del negocio</h1>

      {loading && <p>Cargando…</p>}

      {!loading && (
        <>
          {error && <p className="text-red-600 mb-3">{error}</p>}
          {msg && <p className="text-green-600 mb-3">{msg}</p>}

          {/* Si hay error de que no existe tienda, no mostramos el formulario */}
          {!(error && error.includes("Aún no has creado tu tienda")) && (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Nombre de la tienda
                </label>
                <input
                  className="border rounded w-full p-2"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Tipo de tienda
                </label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mode"
                      value="products"
                      checked={form.mode === "products"}
                      onChange={onChange}
                    />
                    Productos (catálogo/ventas)
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="mode"
                      value="bookings"
                      checked={form.mode === "bookings"}
                      onChange={onChange}
                    />
                    Agendamiento de horas
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Descripción (opcional)
                </label>
                <textarea
                  className="border rounded w-full p-2"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Logo (URL opcional)
                </label>
                <input
                  className="border rounded w-full p-2"
                  name="logoUrl"
                  value={form.logoUrl}
                  onChange={onChange}
                  placeholder="https://…"
                />
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Guardar cambios
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
