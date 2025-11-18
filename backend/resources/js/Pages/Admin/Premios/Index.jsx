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
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <h2
            className="fw-bold mb-3 mb-md-0"
            style={{ color: darkMode ? "#4dd2a1" : "#198754" }}
          >
            🏆 Premios del Mes
          </h2>
          <Link
            href={route("admin.premios.create")}
            className="btn btn-success rounded-pill shadow-sm d-flex align-items-center gap-2"
            style={{
              background: "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
              border: "none",
            }}
          >
            <i className="bi bi-plus-circle"></i> Nuevo Premio
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
          <div
            className="card-header fw-semibold d-flex align-items-center py-3"
            style={{
              background: cardHeaderBg,
              color: "#fff",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <i className="bi bi-award me-2"></i> Listado de premios
          </div>

          <div className="table-responsive">
            <table
              className="table align-middle text-center mb-0"
              style={{
                color: textColor,
                borderColor: darkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
              }}
            >
              <thead
                style={{
                  backgroundColor: tableHeaderBg,
                  color: tableHeaderColor,
                  fontWeight: "600",
                }}
              >
                <tr>
                  <th>Nombre</th>
                  <th>Fecha límite</th>
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
                        darkMode
                          ? "border-secondary-subtle"
                          : "border-light-subtle"
                      }`}
                    >
                      <td className="fw-semibold">{p.nombre}</td>
                      <td style={{ color: secondaryText }}>
                        {p.fecha_limite
                          ? new Date(p.fecha_limite).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>
                        {p.archivo ? (
                          <a
                            href={`/storage/${p.archivo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm rounded-pill d-flex align-items-center gap-1 justify-content-center mx-auto shadow-sm"
                            style={{
                              background: darkMode
                                ? "linear-gradient(90deg, #00d4a1 0%, #0066ff 100%)"
                                : "transparent",
                              color: darkMode ? "#fff" : "#198754",
                              border: darkMode
                                ? "none"
                                : "1px solid rgba(25,135,84,0.6)",
                              transition: "all 0.3s ease",
                              fontWeight: 500,
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = darkMode
                                ? "linear-gradient(90deg, #00ffa1 0%, #0099ff 100%)"
                                : "#198754";
                              e.target.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = darkMode
                                ? "linear-gradient(90deg, #00d4a1 0%, #0066ff 100%)"
                                : "transparent";
                              e.target.style.color = darkMode
                                ? "#fff"
                                : "#198754";
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
                      className="py-4 text-center fst-italic"
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
      </div>
    </AppLayout>
  );
}
