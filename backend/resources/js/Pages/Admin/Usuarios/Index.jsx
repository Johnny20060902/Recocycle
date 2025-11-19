/* global route */

import { Link, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

export default function UsuariosIndex({ auth, usuarios = [] }) {
  const { delete: destroy } = useForm();

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

  // 🗑️ Eliminar usuario
  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción es irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d4a1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(route("admin.usuarios.destroy", id), {
          onSuccess: () =>
            Swal.fire("Eliminado", "Usuario eliminado correctamente.", "success"),
          onError: () =>
            Swal.fire("Error", "No se pudo eliminar el usuario.", "error"),
        });
      }
    });
  };

  // 🎨 Colores según modo
  const textColor = darkMode ? "#e0e0e0" : "#222";
  const secondaryText = darkMode ? "#bdbdbd" : "#555";
  const bgCard = darkMode ? "#161616" : "#ffffff";
  const headerBg = darkMode
    ? "linear-gradient(90deg, #0d0d0d 0%, #1e1e1e 100%)"
    : "linear-gradient(90deg, #0066ff 0%, #00d4a1 100%)";

  const tableHeaderBg = darkMode ? "#202020" : "#eef6ff";
  const tableHeaderColor = darkMode ? "#cccccc" : "#003366";

  // Badges
  const renderEstadoBadge = (estado) => {
    const value = estado ?? "N/A";
    const classMap = {
      activo: "bg-success",
      inactivo: "bg-danger",
      pendiente: "bg-warning text-dark",
      default: "bg-secondary",
    };
    return (
      <span className={`badge rounded-pill px-3 py-2 ${classMap[value] || classMap.default}`}>
        {value.toUpperCase()}
      </span>
    );
  };

  const renderRoleBadge = (role) => {
    const value = role ?? "N/A";
    const classMap = {
      admin: "bg-danger",
      recolector: "bg-success",
      usuario: "bg-primary",
      default: "bg-primary",
    };
    return (
      <span className={`badge rounded-pill px-3 py-2 ${classMap[value] || classMap.default}`}>
        {value.toUpperCase()}
      </span>
    );
  };

  const formatRating = (rating) => {
    const num = Number(rating);
    return isNaN(num) ? "0.0" : num.toFixed(1);
  };

  return (
    <AppLayout title="Gestión de Usuarios" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">

        {/* ======= ENCABEZADO ======= */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: darkMode ? "#58e6b8" : "#007bff" }}>
              👥 Usuarios del Sistema
            </h2>
            <p className="mb-0" style={{ color: secondaryText }}>
              Administra todos los usuarios, roles y estados del sistema.
            </p>
          </div>

          <Link
            href={route("admin.usuarios.create")}
            className="btn btn-success rounded-pill fw-semibold shadow-sm d-flex align-items-center gap-2 mt-3 mt-md-0"
            style={{
              background: "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
            }}
          >
            <i className="bi bi-person-plus-fill"></i> Registrar usuario
          </Link>
        </div>

        {/* ======= TABLA ======= */}
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
          style={{ background: bgCard, color: textColor }}
        >
          <div
            className="card-header fw-semibold py-3"
            style={{
              background: headerBg,
              color: "#fff",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <i className="bi bi-people-fill me-2"></i> Listado de usuarios
          </div>

          <div className="table-responsive">
            <table
              className="table align-middle text-center mb-0"
              style={{ color: textColor }}
            >
              <thead
                style={{
                  backgroundColor: tableHeaderBg,
                  color: tableHeaderColor,
                }}
              >
                <tr>
                  <th>ID</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Puntaje</th>
                  <th>Rating</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((u) => (
                    <tr
                      key={u.id}
                      className={`border-bottom ${
                        darkMode ? "border-secondary" : "border-light"
                      }`}
                      style={{
                        transition: "0.25s",
                      }}
                    >
                      <td>{u.id}</td>
                      <td className="fw-semibold">{u.nombres}</td>
                      <td className="fw-semibold">{u.apellidos}</td>
                      <td style={{ color: secondaryText }}>{u.email}</td>

                      <td>{renderRoleBadge(u.role)}</td>
                      <td>{renderEstadoBadge(u.estado)}</td>

                      <td>{u.puntaje ?? 0}</td>
                      <td>{formatRating(u.rating_promedio)}</td>

                      <td>
                        <div className="d-flex justify-content-center gap-2">

                          {/* EDITAR */}
                          <Link
                            href={route("admin.usuarios.edit", u.id)}
                            className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 shadow-sm ${
                              darkMode
                                ? "btn-outline-info text-info"
                                : "btn-outline-primary"
                            }`}
                          >
                            <i className="bi bi-pencil-square"></i> Editar
                          </Link>

                          {/* ELIMINAR */}
                          <button
                            onClick={() => handleDelete(u.id)}
                            className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 shadow-sm ${
                              darkMode
                                ? "btn-outline-danger text-danger"
                                : "btn-outline-danger"
                            }`}
                          >
                            <i className="bi bi-trash3-fill"></i> Eliminar
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-5 fst-italic" style={{ color: secondaryText }}>
                      No hay usuarios registrados aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
