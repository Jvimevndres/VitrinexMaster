// src/routes/store.routes.js
import { Router } from "express";
import { authRequired } from "../middlewares/authRequired.js";
import {
  listPublicStores,
  getMyStore,
  saveMyStore,
} from "../controllers/store.controller.js";

const router = Router();

// 🔹 Ruta pública: listar tiendas para el mapa / explorador
router.get("/", listPublicStores);

// 🔹 Rutas protegidas: tiendas del usuario autenticado
router.get("/my", authRequired, getMyStore);
router.post("/my", authRequired, saveMyStore);
router.put("/my", authRequired, saveMyStore);

export default router;
