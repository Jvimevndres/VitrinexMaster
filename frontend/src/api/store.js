// src/api/store.js
import axios from "axios";

// Usa la misma URL base que AuthContext
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ necesario para enviar el token de sesión
});

/* ===========================
   📦 FUNCIONES DE TIENDAS
   =========================== */

// 🔹 Listar tiendas públicas (para el mapa y la exploración general)
export const listPublicStores = (filters = {}) =>
  client.get("/stores", { params: filters });

// 🔹 Listar todas las tiendas del usuario autenticado
export const listMyStores = async () => {
  const res = await client.get("/stores/my");
  return res;
};

// 🔹 Crear nueva tienda
export const saveMyStore = (payload) => client.post("/stores/my", payload);

// 🔹 Actualizar tienda existente
export const updateMyStore = (payload) => client.put("/stores/my", payload);

// 🔹 Obtener información de la(s) tienda(s) del usuario
export const getMyStore = () => client.get("/stores/my");
