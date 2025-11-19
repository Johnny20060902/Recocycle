/* global route */

import { useForm, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

export default function Create({ auth }) {
  const { data, setData, post, processing, reset, errors } = useForm({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    role: "usuario",
    estado: "activo",
  });

  const [darkMode, setDarkMode] = useState(
    document.body.getAttribute("data-theme") === "dark"
  );

  // Detectar cambios globales del modo oscuro
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDarkMode(document.body.getAttribute("data-theme") === "dark")
    );
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const secondaryText = darkMode ? "#bdbdbd" : "#555";
  const cardBg = darkMode ? "#181818" : "#ffffff";
  const textColor = darkMode ? "#eaeaea" : "#222";

  // Guardar nuevo usuario
  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Registrar nuevo usuario?",
      text: "Se creará un nuevo registro en el sistema.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00c896",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        post(route("admin.usuarios.store"), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire("✅ Éxito", "Usuario creado correctamente.", "success");
            reset();
          },
          onError: () =>
            Swal.fire("❌ Error", "No se pudo registrar el usuario.", "error"),
        });
      }
    });
  };

  return (
    <AppLayout title="Registrar Usuario" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">
        {/* ENCABEZADO */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <div>
            <h2
              className="fw-bold mb-1"
              style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
            >
              👤 Registrar Nuevo Usuario
            </h2>
            <p className="mb-0" style={{ color: secondaryText }}>
              Completa el formulario para agregar un nuevo usuario al sistema.
            </p>
          </div>

          <Link
            href={route("admin.usuarios.index")}
            className="btn btn-outline-secondary rounded-pill shadow-sm fw-semibold d-flex align-items-center gap-2 mt-3 mt-md-0"
          >
            <i className="bi bi-arrow-left-circle"></i> Volver al listado
          </Link>
        </div>

        {/* FORMULARIO */}
        <div
          className="card border-0 shadow-lg rounded-4 p-4"
          style={{
            background: cardBg,
            color: textColor,
            transition: "all 0.3s ease",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="row g-3">
              {/* NOMBRES */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nombres</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.nombres ? "is-invalid" : ""
                  }`}
                  value={data.nombres}
                  onChange={(e) => setData("nombres", e.target.value)}
                  placeholder="Ej: Santiago"
                />
                {errors.nombres && (
                  <div className="invalid-feedback">{errors.nombres}</div>
                )}
              </div>

              {/* APELLIDOS */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Apellidos</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.apellidos ? "is-invalid" : ""
                  }`}
                  value={data.apellidos}
                  onChange={(e) => setData("apellidos", e.target.value)}
                  placeholder="Ej: Abasto Ortega"
                />
                {errors.apellidos && (
                  <div className="invalid-feedback">{errors.apellidos}</div>
                )}
              </div>

              {/* EMAIL */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="usuario@ejemplo.com"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* PASSWORD */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              {/* ROL */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Rol del usuario</label>
                <select
                  className={`form-select ${errors.role ? "is-invalid" : ""}`}
                  value={data.role}
                  onChange={(e) => setData("role", e.target.value)}
                >
                  <option value="admin">Administrador 👑</option>
                  <option value="recolector">Recolector 🚛</option>
                  <option value="usuario">Usuario 🌱</option>
                </select>
                {errors.role && (
                  <div className="invalid-feedback">{errors.role}</div>
                )}
              </div>

              {/* ESTADO */}
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
                {errors.estado && (
                  <div className="invalid-feedback">{errors.estado}</div>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button
                type="submit"
                disabled={processing}
                className="btn btn-success rounded-pill shadow-sm fw-semibold d-flex align-items-center gap-2"
                style={{
                  background:
                    "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
                }}
              >
                <i className="bi bi-person-plus-fill"></i>
                {processing ? "Registrando..." : "Registrar usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
