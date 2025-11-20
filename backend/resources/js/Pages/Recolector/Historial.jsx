import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import RecolectorLayout from "@/Layouts/RecolectorLayout";
import RatingModal from "@/Components/RatingModal";

export default function Historial({ auth, puntos = [] }) {
  const [autoRefresh, setAutoRefresh] = useState(true);

  /* ========================= 🔄 AUTO-REFRESH CADA 5s ========================= */
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      router.reload({
        only: ["puntos"],
        preserveScroll: true,
        preserveState: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  /* ========================= 🖼️ CARRUSEL DE FOTOS (BACKEND: p.fotos) ========================= */
  const renderFotos = (p) => {
    const fotos = p?.fotos || [];

    if (!fotos.length) return null;

    const idCarrusel = `carrusel-${p.id}`;

    return (
      <div id={idCarrusel} className="carousel slide mb-3" data-bs-ride="carousel">
        <div className="carousel-inner">
          {fotos.map((img, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={
                  img.startsWith("http")
                    ? img
                    : `/storage/${img}`
                }
                className="d-block w-100 rounded"
                style={{ maxHeight: "220px", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        {fotos.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target={`#${idCarrusel}`}
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon"></span>
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target={`#${idCarrusel}`}
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon"></span>
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <RecolectorLayout title="Historial de Recolecciones" auth={auth}>
      <div className="container py-5 animate__animated animate__fadeIn px-3">

        {/* ===== ENCABEZADO ===== */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-success fs-3">📜 Historial de recolecciones</h1>
          <p className="text-secondary fs-6">
            Revisá tus recolecciones y calificá a los usuarios cuando corresponda.
          </p>
        </div>

        {/* ===== LISTADO ===== */}
        {puntos.length > 0 ? (
          <div className="row g-4 justify-content-center">
            {puntos.map((p) => (
              <div key={p.id} className="col-12 col-sm-10 col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-lg h-100 overflow-hidden hover-shadow d-flex flex-column"
                  style={{
                    borderRadius: "1rem",
                    background: "linear-gradient(145deg, #edfff8, #ffffff)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >

                  {/* === CABECERA === */}
                  <div className="card-header bg-white border-0 d-flex flex-column gap-1">
                    <div className="small text-secondary text-truncate">
                      👤{" "}
                      {p.usuario
                        ? `${p.usuario.nombres} ${p.usuario.apellidos}`
                        : "Usuario"}
                    </div>

                    <span
                      className={`badge px-3 py-2 fw-semibold text-uppercase align-self-start ${
                        p.estado === "pendiente"
                          ? "bg-warning text-dark"
                          : p.estado === "asignado"
                          ? "bg-info text-white"
                          : p.estado === "en_camino"
                          ? "bg-primary text-white"
                          : p.estado === "recogido"
                          ? "bg-secondary text-white"
                          : p.estado === "completado"
                          ? "bg-success text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {p.estado}
                    </span>
                  </div>

                  {/* === FOTOS === */}
                  {renderFotos(p)}

                  {/* === CUERPO === */}
                  <div className="card-body flex-grow-1">
                    <h5 className="fw-bold text-success mb-1 text-truncate">
                      {p.material}
                    </h5>

                    {p.descripcion && (
                      <p className="text-secondary small mb-2">{p.descripcion}</p>
                    )}

                    <div className="mb-2 text-secondary small">
                      📅 {p.fecha_disponible || "-"} — ⏰ {p.hora_desde} a {p.hora_hasta}
                    </div>
                  </div>

                  {/* === PIE === */}
                  <div className="card-footer bg-light border-0 d-flex justify-content-end">
                    {p.estado === "completado" && !p.ya_califique && (
                      <RatingModal puntoId={p.id} triggerLabel="Calificar usuario" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* === SIN REGISTROS === */
          <div className="text-center py-5">
            <h4 className="text-secondary">😕 No tenés recolecciones aún.</h4>
            <p className="small">
              Cuando completes recolecciones, aparecerán aquí para que puedas calificarlas.
            </p>
          </div>
        )}
      </div>

      {/* ===== DARK MODE ===== */}
      <style>{`
        body[data-theme="dark"] .card {
          background: linear-gradient(145deg, #1b1b1b, #262626) !important;
          color: #e6e6e6 !important;
        }
        body[data-theme="dark"] .card-header,
        body[data-theme="dark"] .card-footer {
          background: #1b1b1b !important;
          color: #b5b5b5 !important;
        }
        .hover-shadow:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 14px rgba(0, 255, 150, 0.15);
        }
      `}</style>
    </RecolectorLayout>
  );
}
