// frontend/src/api/user.js
import axios from "axios";

// Cliente Axios configurado
const client = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // importante para que se envíe la cookie con el token
});

/* ===========================
   👤 FUNCIONES DE USUARIO
   =========================== */

// Obtener perfil del usuario autenticado
export const getProfile = () => client.get("/auth/profile");

// Actualizar perfil del usuario autenticado
export const updateProfile = (payload) => client.put("/auth/profile", payload);
