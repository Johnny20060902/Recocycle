/* global route */

import { Link, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

export default function RecolectoresIndex({ auth, recolectores }) {
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

  // Eliminar recolector
  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar recolector?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d4a1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((r) => {
      if (r.isConfirmed) {
        destroy(route("admin.recolectores.destroy", id), {
          onSuccess: () =>
            Swal.fire("✅ Eliminado", "Recolector eliminado correctamente.", "success"),
          onError: () =>
            Swal.fire("❌ Error", "No se pudo eliminar el recolector.", "error"),
        });
      }
    });
  };

  // Colores según tema
  const textColor = darkMode ? "#eaeaea" : "#222";
  const secondaryText = darkMode ? "#bdbdbd" : "#555";
  const bgCard = darkMode ? "#181818" : "#ffffff";
  const tableHeaderBg = darkMode ? "#222222" : "#e9f5ff";
  const tableHeaderColor = darkMode ? "#cfcfcf" : "#003366";

  return (
    <AppLayout title="Recolectores" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">

        {/* ======= ENCABEZADO ======= */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <div>
            <h2
              className="fw-bold mb-1"
              style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
            >
              🚛 Recolectores
            </h2>
            <p className="mb-0" style={{ color: secondaryText }}>
              Gestiona los recolectores registrados en la plataforma.
            </p>
          </div>

          <Link
            href={route("admin.recolectores.create")}
            className="btn btn-success rounded-pill shadow-sm fw-semibold d-flex align-items-center gap-2 mt-3 mt-md-0"
            style={{
              background: "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
          >
            <i className="bi bi-person-plus-fill"></i> Registrar recolector
          </Link>
        </div>

        {/* ======= TABLA ======= */}
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
          style={{
            background: bgCard,
            color: textColor,
            transition: "all 0.3s ease",
          }}
        >
          <div className="table-responsive">
            <table className="table align-middle text-center mb-0">
              <thead
                style={{
                  backgroundColor: tableHeaderBg,
                  color: tableHeaderColor,
                  fontWeight: "600",
                }}
              >
                <tr>
                  <th>ID</th>
                  <th>Nombre completo</th>
                  <th>Email</th>
                  <th>Puntaje</th>
                  <th>Rating</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {recolectores.length > 0 ? (
                  recolectores.map((r) => (
                    <tr key={r.id} className={darkMode ? "border-secondary" : "border-light"}>
                      <td>{r.id}</td>

                      <td className="fw-semibold">
                        {r.nombres} {r.apellidos}
                      </td>

                      <td style={{ color: secondaryText }}>{r.email}</td>

                      <td>{r.puntaje ?? 0}</td>

                      <td>{r.rating_promedio?.toFixed(1) ?? "0.0"}</td>

                      <td>
                        <span
                          className={`badge px-3 py-2 rounded-pill ${
                            r.estado === "activo" || r.estado === true
                              ? "bg-success"
                              : r.estado === "pendiente"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {String(r.estado ?? "N/A").toUpperCase()}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Link
                            href={route("admin.recolectores.edit", r.id)}
                            className={`btn btn-sm rounded-pill shadow-sm d-flex align-items-center gap-1 ${
                              darkMode
                                ? "btn-outline-info text-info"
                                : "btn-outline-primary"
                            }`}
                          >
                            <i className="bi bi-pencil-square"></i> Editar
                          </Link>

                          <button
                            onClick={() => handleDelete(r.id)}
                            className={`btn btn-sm rounded-pill shadow-sm d-flex align-items-center gap-1 ${
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
                    <td
                      colSpan="7"
                      className="py-4 text-center fst-italic"
                      style={{ color: secondaryText }}
                    >
                      No hay recolectores registrados.
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
