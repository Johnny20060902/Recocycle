import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

export default function ReportesIndex({ auth }) {
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

  // 🎨 Colores según modo
  const textColor = darkMode ? "#eaeaea" : "#222";
  const secondaryText = darkMode ? "#bdbdbd" : "#555";
  const bgCard = darkMode ? "#181818" : "#ffffff";

  return (
    <AppLayout title="Módulo de Reportes" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">
        {/* ======= ENCABEZADO ======= */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <div>
            <h2
              className="fw-bold mb-1"
              style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
            >
              📊 Reportes del Sistema
            </h2>
            <p className="mb-0" style={{ color: secondaryText }}>
              Exporta información detallada de recolectores, usuarios y otras
              actividades del sistema.
            </p>
          </div>
        </div>

        {/* ======= TARJETAS ======= */}
        <div className="row g-4">
          {/* ===== Reporte de Recolectores ===== */}
          <div className="col-md-6">
            <div
              className="card border-0 shadow-lg rounded-4 p-4 text-center h-100"
              style={{
                background: bgCard,
                color: textColor,
                transition: "all 0.3s ease",
              }}
            >
              <i
                className="bi bi-truck fs-1 mb-3"
                style={{ color: "#00c896" }}
              ></i>
              <h5 className="fw-bold mb-2">Reporte de Recolectores</h5>
              <p className="mb-3" style={{ color: secondaryText }}>
                Genera un listado detallado de todos los recolectores activos,
                con su estado, puntaje y calificación promedio.
              </p>

              <div className="d-flex justify-content-center gap-3">
                {/* Ver PDF en nueva pestaña */}
                <a
                  href={route("admin.reportes.recolectores.pdf")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success rounded-pill shadow-sm fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background:
                      "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  <i className="bi bi-file-earmark-pdf-fill"></i> Ver PDF
                </a>

                {/* Descargar PDF */}
                <a
                  href={route("admin.reportes.recolectores.descargar")}
                  className="btn btn-outline-success rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{
                    border: "2px solid #00c896",
                  }}
                >
                  <i className="bi bi-download"></i> Descargar
                </a>
              </div>
            </div>
          </div>

          {/* ===== Reporte de Usuarios ===== */}
          <div className="col-md-6">
            <div
              className="card border-0 shadow-lg rounded-4 p-4 text-center h-100"
              style={{
                background: bgCard,
                color: textColor,
                transition: "all 0.3s ease",
              }}
            >
              <i
                className="bi bi-people-fill fs-1 mb-3"
                style={{ color: "#007bff" }}
              ></i>
              <h5 className="fw-bold mb-2">Reporte de Usuarios</h5>
              <p className="mb-3" style={{ color: secondaryText }}>
                Genera un reporte PDF con todos los usuarios registrados en el
                sistema y su estado actual.
              </p>

              <div className="d-flex justify-content-center gap-3">
                {/* Ver PDF */}
                <a
                  href={route("admin.reportes.usuarios.pdf")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary rounded-pill shadow-sm fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background:
                      "linear-gradient(90deg, #0066ff 0%, #0099ff 100%)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  <i className="bi bi-file-earmark-pdf-fill"></i> Ver PDF
                </a>

                {/* Descargar */}
                <a
                  href={route("admin.reportes.usuarios.descargar")}
                  className="btn btn-outline-primary rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{
                    border: "2px solid #007bff",
                  }}
                >
                  <i className="bi bi-download"></i> Descargar
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ======= REPORTES FUTUROS ======= */}
        <div className="row mt-4 g-4">
          <div className="col-md-6">
            <div
              className="card shadow rounded-4 p-4 text-center border-0 opacity-75"
              style={{
                background: darkMode ? "#222" : "#f5f5f5",
                color: secondaryText,
              }}
            >
              <i className="bi bi-bar-chart-line fs-2 mb-2 text-warning"></i>
              <h6 className="fw-semibold">
                Reporte de Reciclajes (en desarrollo)
              </h6>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="card shadow rounded-4 p-4 text-center border-0 opacity-75"
              style={{
                background: darkMode ? "#222" : "#f5f5f5",
                color: secondaryText,
              }}
            >
              <i className="bi bi-award fs-2 mb-2 text-success"></i>
              <h6 className="fw-semibold">
                Reporte de Premios (en desarrollo)
              </h6>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
