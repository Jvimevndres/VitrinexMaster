// src/controllers/store.controller.js
import Store from "../models/store.model.js";

// 🔹 Listar tiendas públicas (para el mapa y el buscador de la página principal)
export const listPublicStores = async (req, res) => {
  try {
    const { comuna, tipoNegocio, mode } = req.query;

    const query = {};
    if (comuna) query.comuna = comuna;
    if (tipoNegocio) query.tipoNegocio = tipoNegocio;
    if (mode) query.mode = mode;
    // Solo activas
    query.isActive = true;

    const stores = await Store.find(query).lean();

    res.json(
      stores.map((s) => ({
        _id: s._id,
        name: s.name,
        description: s.description,
        logoUrl: s.logoUrl,
        comuna: s.comuna,
        tipoNegocio: s.tipoNegocio,
        mode: s.mode,
        lat: s.lat,
        lng: s.lng,
        direccion: s.direccion,
        isActive: s.isActive,
      }))
    );
  } catch (err) {
    console.error("Error listando tiendas públicas:", err);
    res.status(500).json({ message: "Error al listar las tiendas" });
  }
};

// 🔹 Obtener TODAS las tiendas del usuario autenticado
//    Soporta documentos antiguos con campo `user` y nuevos con `owner`
export const getMyStore = async (req, res) => {
  try {
    const userId = req.user.id;

    const stores = await Store.find({
      $or: [{ owner: userId }, { user: userId }],
    }).lean();

    if (!stores || stores.length === 0) {
      return res.status(404).json({ message: "Aún no has creado tiendas" });
    }

    res.json(stores);
  } catch (err) {
    console.error("Error al obtener tiendas:", err);
    res.status(500).json({ message: "Error al obtener tus tiendas" });
  }
};

// 🔹 Crear una nueva tienda o actualizar si se envía un _id existente
export const saveMyStore = async (req, res) => {
  const {
    _id,
    name,
    mode,
    description,
    logoUrl,
    comuna,
    tipoNegocio,
    lat,
    lng,
    direccion,
  } = req.body;

  if (!name) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  const userId = req.user.id;

  try {
    let store;

    if (_id) {
      // Actualizar tienda existente del usuario (por owner O por user)
      store = await Store.findOneAndUpdate(
        {
          _id,
          $or: [{ owner: userId }, { user: userId }],
        },
        {
          name,
          mode: mode === "bookings" ? "bookings" : "products",
          description,
          logoUrl,
          comuna,
          tipoNegocio,
          lat,
          lng,
          direccion,
          isActive: true,
          // normalizamos: de ahora en adelante ambas quedan seteadas
          owner: userId,
          user: userId,
        },
        { new: true }
      );

      if (!store) {
        return res.status(404).json({ message: "Tienda no encontrada" });
      }

      return res.status(200).json(store);
    }

    // Crear nueva tienda
    store = await Store.create({
      owner: userId,
      user: userId,
      name,
      mode: mode === "bookings" ? "bookings" : "products",
      description,
      logoUrl,
      comuna,
      tipoNegocio,
      lat,
      lng,
      direccion,
      isActive: true,
    });

    return res.status(201).json(store);
  } catch (err) {
    console.error("Error al guardar tienda:", err);
    res.status(500).json({ message: "Error al guardar la tienda" });
  }
};
