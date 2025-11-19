/* global route */

import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

export default function ReportesIndex({ auth }) {
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
  const secondaryText = darkMode ? "#bdbdbd" : "#555";
  const bgCard = darkMode ? "#1c1c1c" : "#ffffff";

  return (
    <AppLayout title="Módulo de Reportes" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">

        {/* ======= ENCABEZADO ======= */}
        <div className="text-center mb-5">
          <h2
            className="fw-bold mb-2"
            style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
          >
            📊 Reportes del Sistema
          </h2>
          <p className="fs-6" style={{ color: secondaryText }}>
            Exportá información detallada de recolectores, usuarios y más.
          </p>
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
              <div className="mb-3">
                <i
                  className="bi bi-truck fs-1"
                  style={{ color: "#00c896" }}
                ></i>
              </div>

              <h4 className="fw-bold mb-2">Reporte de Recolectores</h4>
              <p className="mb-4 px-3" style={{ color: secondaryText }}>
                Listado detallado de recolectores activos con su puntaje,
                calificación, estado y métricas principales.
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <a
                  href={route("admin.reportes.recolectores.pdf")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success rounded-pill px-4 fw-semibold shadow-sm d-flex align-items-center gap-2"
                  style={{
                    background:
                      "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
                  }}
                >
                  <i className="bi bi-file-earmark-pdf-fill"></i>
                  Ver PDF
                </a>

                <a
                  href={route("admin.reportes.recolectores.descargar")}
                  className="btn btn-outline-success rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                  style={{ borderWidth: "2px" }}
                >
                  <i className="bi bi-download"></i>
                  Descargar
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
              <div className="mb-3">
                <i
                  className="bi bi-people-fill fs-1"
                  style={{ color: "#007bff" }}
                ></i>
              </div>

              <h4 className="fw-bold mb-2">Reporte de Usuarios</h4>
              <p className="mb-4 px-3" style={{ color: secondaryText }}>
                Genera un PDF con todos los usuarios registrados, su rol, estado
                y actividad dentro del sistema.
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <a
                  href={route("admin.reportes.usuarios.pdf")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm d-flex align-items-center gap-2"
                  style={{
                    background:
                      "linear-gradient(90deg, #0066ff 0%, #0099ff 100%)",
                  }}
                >
                  <i className="bi bi-file-earmark-pdf-fill"></i>
                  Ver PDF
                </a>

                <a
                  href={route("admin.reportes.usuarios.descargar")}
                  className="btn btn-outline-primary rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
                  style={{ borderWidth: "2px" }}
                >
                  <i className="bi bi-download"></i>
                  Descargar
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ======= REPORTES FUTUROS ======= */}
        <div className="row mt-4 g-4">
          <div className="col-md-6">
            <div
              className="card border-0 rounded-4 shadow-sm p-4 text-center opacity-75"
              style={{
                background: darkMode ? "#222" : "#f2f2f2",
                color: secondaryText,
              }}
            >
              <i className="bi bi-bar-chart-line fs-2 mb-2 text-warning"></i>
              <h6 className="fw-semibold">
                Reporte de Reciclajes (próximamente)
              </h6>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="card border-0 rounded-4 shadow-sm p-4 text-center opacity-75"
              style={{
                background: darkMode ? "#222" : "#f2f2f2",
                color: secondaryText,
              }}
            >
              <i className="bi bi-award fs-2 mb-2 text-success"></i>
              <h6 className="fw-semibold">Reporte de Premios (próximamente)</h6>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
