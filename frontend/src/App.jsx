// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import TaskFormPage from "./pages/TaskFormPage";
import OnboardingPage from "./pages/OnboardingPage";
import ExploreStoresPage from "./pages/ExploreStoresPage";
import UserProfilePage from "./pages/UserProfilePage";
import StoreProfilePage from "./pages/StoreProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      {/* Página pública: explorador de negocios */}
      <Route path="/" element={<ExploreStoresPage />} />

      {/* Autenticación pública */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas protegidas con layout principal (panel interno) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/new" element={<TaskFormPage />} />
          <Route path="/tasks/:id/edit" element={<TaskFormPage />} />

          {/* 👤 Perfil de usuario y negocio dentro del panel */}
          <Route path="/perfil" element={<UserProfilePage />} />
          <Route path="/negocio" element={<StoreProfilePage />} />
        </Route>

        {/* Onboarding fuera del layout */}
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1>404 — Página no encontrada</h1>} />
    </Routes>
  );
}
