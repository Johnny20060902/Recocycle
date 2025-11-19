import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import "animate.css";

export default function PremiosIndex({ auth, premios = [] }) {
  const [darkMode, setDarkMode] = useState(
    document.body.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDarkMode(document.body.getAttribute("data-theme") === "dark")
    );
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const textColor = darkMode ? "#eaeaea" : "#222";
  const secondaryText = darkMode ? "#bfbfbf" : "#555";
  const bgCard = darkMode ? "#181818" : "#ffffff";
  const cardHeaderBg = darkMode
    ? "linear-gradient(90deg, #0d0d0d 0%, #1e1e1e 100%)"
    : "linear-gradient(90deg, #0066ff 0%, #00d4a1 100%)";

  const tableHeaderBg = darkMode ? "#202020" : "#e9f5ef";
  const tableHeaderColor = darkMode ? "#e0e0e0" : "#003300";

  return (
    <AppLayout title="Gestión de Premios" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">

        {/* ======= ENCABEZADO ======= */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
          <h2
            className="fw-bold m-0"
            style={{ color: darkMode ? "#4dd2a1" : "#198754" }}
          >
            🏆 Premios del Mes
          </h2>

          <Link
            href={route("admin.premios.create")}
            className="btn btn-success rounded-pill shadow-sm d-flex align-items-center gap-2 px-4 py-2"
            style={{
              background: "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
              border: "none",
              fontWeight: 600,
            }}
          >
            <i className="bi bi-plus-circle"></i>
            Nuevo Premio
          </Link>
        </div>

        {/* ======= CARD + TABLA ======= */}
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
          style={{
            background: bgCard,
            color: textColor,
            transition: "0.3s",
          }}
        >
          {/* HEADER */}
          <div
            className="card-header fw-semibold py-3 d-flex align-items-center"
            style={{
              background: cardHeaderBg,
              color: "#fff",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <i className="bi bi-award me-2"></i>
            Listado de premios
          </div>

          {/* TABLA RESPONSIVE */}
          <div className="table-responsive">
            <table
              className="table align-middle text-center mb-0"
              style={{
                color: textColor,
                borderColor: darkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.08)",
              }}
            >
              <thead
                style={{
                  background: tableHeaderBg,
                  color: tableHeaderColor,
                  fontWeight: "600",
                }}
              >
                <tr>
                  <th>Nombre</th>
                  <th className="d-none d-sm-table-cell">Fecha límite</th>
                  <th>Archivo</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {premios.length > 0 ? (
                  premios.map((p) => (
                    <tr
                      key={p.id}
                      className={`border-bottom ${
                        darkMode ? "border-secondary-subtle" : "border-light-subtle"
                      }`}
                    >
                      {/* NOMBRE */}
                      <td className="fw-semibold">
                        <div className="text-wrap">{p.nombre}</div>
                      </td>

                      {/* FECHA (se oculta en XS) */}
                      <td
                        className="d-none d-sm-table-cell"
                        style={{ color: secondaryText }}
                      >
                        {p.fecha_limite
                          ? new Date(p.fecha_limite).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* ARCHIVO */}
                      <td>
                        {p.archivo ? (
                          <a
                            href={`/storage/${p.archivo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm rounded-pill d-flex align-items-center gap-1 mx-auto shadow-sm px-3 py-1"
                            style={{
                              background: darkMode
                                ? "linear-gradient(90deg, #00d4a1 0%, #0066ff 100%)"
                                : "transparent",
                              color: darkMode ? "#fff" : "#198754",
                              border: darkMode
                                ? "none"
                                : "1px solid rgba(25,135,84,0.4)",
                              transition: "0.25s",
                              fontWeight: 500,
                            }}
                          >
                            <i className="bi bi-eye"></i> Ver
                          </a>
                        ) : (
                          <span
                            className="fst-italic small"
                            style={{ color: secondaryText }}
                          >
                            Sin archivo
                          </span>
                        )}
                      </td>

                      {/* ESTADO */}
                      <td>
                        {p.activo ? (
                          <span className="badge bg-success rounded-pill px-3 py-2">
                            Activo
                          </span>
                        ) : (
                          <span className="badge bg-secondary rounded-pill px-3 py-2">
                            Inactivo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-4 fst-italic text-center"
                      style={{ color: secondaryText }}
                    >
                      No hay premios registrados aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DARK MODE FIXES */}
        <style>{`
          body[data-theme="dark"] .table-hover tbody tr:hover {
            background: rgba(255,255,255,0.04) !important;
          }

          @media (max-width: 576px) {
            td, th {
              padding: 0.75rem 0.3rem !important;
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
