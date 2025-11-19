/* global route */

import { useForm, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

export default function Edit({ auth, recolector }) {
  const { data, setData, put, processing, errors } = useForm({
    nombres: recolector.nombres || "",
    apellidos: recolector.apellidos || "",
    email: recolector.email || "",
    estado: recolector.estado || "activo",
    password: "",
  });

  const [darkMode, setDarkMode] = useState(
    document.body.getAttribute("data-theme") === "dark"
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDarkMode(document.body.getAttribute("data-theme") === "dark")
    );
    obs.observe(document.body, { attributes: true });
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Guardar cambios?",
      text: "Los datos del recolector serán actualizados.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00c896",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar",
    }).then((r) => {
      if (r.isConfirmed) {
        put(route("admin.recolectores.update", recolector.id), {
          onSuccess: () =>
            Swal.fire("✅ Éxito", "Recolector actualizado correctamente.", "success"),
          onError: () =>
            Swal.fire("❌ Error", "No se pudo actualizar el recolector.", "error"),
        });
      }
    });
  };

  // 🎨 Paleta visual
  const cardBg = darkMode ? "#181818" : "#ffffff";
  const textColor = darkMode ? "#eaeaea" : "#222";
  const secondaryText = darkMode ? "#bdbdbd" : "#555";

  return (
    <AppLayout title="Editar Recolector" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">

        {/* ====== ENCABEZADO ====== */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <div>
            <h2
              className="fw-bold mb-1"
              style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
            >
              ✏️ Editar Recolector
            </h2>
            <p className="mb-0" style={{ color: secondaryText }}>
              Actualiza la información del recolector seleccionado.
            </p>
          </div>

          <Link
            href={route("admin.recolectores.index")}
            className="btn btn-outline-secondary rounded-pill shadow-sm fw-semibold d-flex align-items-center gap-2 mt-3 mt-md-0"
          >
            <i className="bi bi-arrow-left-circle"></i> Volver al listado
          </Link>
        </div>

        {/* ====== TARJETA FORMULARIO ====== */}
        <div
          className="card border-0 shadow-lg rounded-4 p-4"
          style={{
            background: cardBg,
            color: textColor,
            transition: "all .3s ease",
          }}
        >
          <form onSubmit={handleSubmit} className="row g-3">

            {/* Nombres */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Nombres</label>
              <input
                type="text"
                className={`form-control ${errors.nombres ? "is-invalid" : ""}`}
                value={data.nombres}
                onChange={(e) => setData("nombres", e.target.value)}
                placeholder="Ej: Santiago"
              />
              {errors.nombres && <div className="invalid-feedback">{errors.nombres}</div>}
            </div>

            {/* Apellidos */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Apellidos</label>
              <input
                type="text"
                className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
                value={data.apellidos}
                onChange={(e) => setData("apellidos", e.target.value)}
                placeholder="Ej: Abasto Ortega"
              />
              {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Correo electrónico</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="usuario@ejemplo.com"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Nueva contraseña con ojo */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Nueva contraseña (opcional)
              </label>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="Dejar vacío para mantener la actual"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                </button>
              </div>

              {errors.password && (
                <div className="invalid-feedback d-block">{errors.password}</div>
              )}
            </div>

            {/* Estado */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Estado</label>
              <select
                className={`form-select ${errors.estado ? "is-invalid" : ""}`}
                value={data.estado}
                onChange={(e) => setData("estado", e.target.value)}
              >
                <option value="activo">Activo ✅</option>
                <option value="inactivo">Inactivo ❌</option>
                <option value="pendiente">Pendiente ⏳</option>
              </select>
              {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}
            </div>

            {/* Botón Guardar */}
            <div className="d-flex justify-content-end mt-4">
              <button
                type="submit"
                disabled={processing}
                className="btn btn-success rounded-pill shadow-sm fw-semibold d-flex align-items-center gap-2 px-4 py-2"
                style={{
                  background: "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              >
                <i className="bi bi-save2"></i>
                {processing ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AppLayout>
  );
}
