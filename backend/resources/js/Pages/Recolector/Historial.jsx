import RecolectorLayout from "@/Layouts/RecolectorLayout";
import RatingModal from "@/Components/RatingModal";

export default function Historial({ auth, puntos = [] }) {
  return (
    <RecolectorLayout title="Historial de Recolecciones" auth={auth}>
      <div className="container py-5 animate__animated animate__fadeIn">
        {/* ====== ENCABEZADO ====== */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-success">📜 Historial de recolecciones</h1>
          <p className="text-secondary fs-5">
            Revisá tus recolecciones y calificá a los usuarios cuando corresponda.
          </p>
        </div>

        {/* ====== LISTADO ====== */}
        {puntos.length > 0 ? (
          <div className="row g-4">
            {puntos.map((p) => (
              <div key={p.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-lg h-100 overflow-hidden hover-shadow"
                  style={{
                    borderRadius: "1rem",
                    background: "linear-gradient(145deg, #edfff8, #ffffff)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {/* === Cabecera simple con usuario === */}
                  <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                    <div className="small text-secondary">
                      👤 {p.usuario ? `${p.usuario.nombres} ${p.usuario.apellidos}` : "Usuario"}
                      {p.usuario?.rating ? (
                        <span className="ms-1 text-warning">({p.usuario.rating} ⭐)</span>
                      ) : null}
                    </div>
                    <span
                      className={`badge px-3 py-2 fw-semibold text-uppercase ${
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

                  {/* === Cuerpo === */}
                  <div className="card-body">
                    <h5 className="fw-bold text-success mb-1">{p.material}</h5>
                    {p.descripcion && (
                      <p className="text-secondary small mb-2">{p.descripcion}</p>
                    )}

                    <div className="mb-2 text-secondary small">
                      📅 {p.fecha_disponible || "-"} — ⏰ {p.hora_desde} a {p.hora_hasta}
                    </div>
                  </div>

                  {/* === Pie: botón calificar si aplica === */}
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
          // ====== SIN REGISTROS ======
          <div className="text-center py-5">
            <h4 className="text-secondary">😕 No tenés recolecciones en tu historial.</h4>
            <p>Cuando completes recolecciones, aparecerán aquí para que puedas calificarlas.</p>
          </div>
        )}
      </div>

      {/* ====== DARK MODE ====== */}
      <style>{`
        body[data-theme="dark"] .card {
          background: linear-gradient(145deg, #1b1b1b, #262626) !important;
          color: #e6e6e6 !important;
        }
        body[data-theme="dark"] .card-footer,
        body[data-theme="dark"] .card-header {
          background: #1b1b1b !important;
          color: #b5b5b5 !important;
        }
        body[data-theme="dark"] .text-secondary,
        body[data-theme="dark"] .text-muted {
          color: #b5b5b5 !important;
        }
        body[data-theme="dark"] .text-success {
          color: #00d4a1 !important;
        }
        body[data-theme="dark"] .hover-shadow:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 14px rgba(0, 255, 150, 0.15);
        }
      `}</style>
    </RecolectorLayout>
  );
}
