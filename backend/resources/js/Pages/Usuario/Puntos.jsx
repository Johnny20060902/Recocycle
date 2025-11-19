import UserLayout from "@/Layouts/UserLayout";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function Puntos({ auth, estadisticas }) {
  useEffect(() => {
    if (estadisticas.total_puntos === 0) {
      Swal.fire({
        title: "¡Aún no tienes puntos!",
        text: "Empieza a reciclar para ganar tus primeros puntos ♻️",
        icon: "info",
        confirmButtonText: "Reciclar ahora",
        confirmButtonColor: "#00c896",
        background: "#ffffff",
        color: "#0b3d2e",
        allowOutsideClick: true,
      });
    }
  }, []);

  return (
    <UserLayout title="Mis Puntos" auth={auth}>
      <div className="container text-center animate__animated animate__fadeIn py-4">

        {/* ======= TÍTULO ======= */}
        <h1 className="fw-bold text-success mb-2 fs-2">🌿 Tus Puntos</h1>
        <p className="fs-6 text-secondary mb-4 px-2">
          Mira tu progreso y nivel ecológico dentro de Recocycle.
        </p>

        {/* ======= TARJETA PRINCIPAL ======= */}
        <div
          className="card border-0 shadow-lg rounded-5 mx-auto p-4 mb-5 w-100"
          style={{
            maxWidth: "550px",
            background: "linear-gradient(145deg, #edfff8, #ffffff)",
            borderTop: "6px solid #00c896",
          }}
        >
          <div className="fs-1 mb-2" style={{ color: "#00c896" }}>
            <i className="bi bi-stars"></i>
          </div>

          <h4 className="fw-semibold" style={{ color: "#009e60" }}>
            Nivel: {estadisticas.nivel}
          </h4>

          <p className="display-6 fw-bold text-dark mb-0">
            {estadisticas.total_puntos} pts
          </p>

          <p className="text-muted small mt-1">
            Ranking #{estadisticas.ranking}
          </p>

          {/* ======= BARRA DE PROGRESO ======= */}
          <div
            className="progress rounded-pill mt-3"
            style={{
              height: "18px",
              backgroundColor: "#dfeee6",
            }}
          >
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{
                width: `${estadisticas.progreso}%`,
                backgroundColor: "#00c896",
                transition: "width 1.2s ease",
              }}
            >
              {Math.round(estadisticas.progreso)}%
            </div>
          </div>

          <p className="mt-3 text-secondary small">
            Próximo nivel: <strong>Eco Héroe</strong> (1000 pts)
          </p>
        </div>

        {/* ======= LOGROS ======= */}
        <h4 className="fw-bold text-success mb-3 fs-5">🎖️ Tus logros ecológicos</h4>

        <div className="row g-3 justify-content-center px-2">
          <Achievement
            icon="bi bi-recycle"
            color="#00c896"
            title="Reciclador activo"
            desc="Realizaste tus primeras recolecciones"
          />
          <Achievement
            icon="bi bi-award"
            color="#ffc107"
            title="Reconocimiento verde"
            desc="Alcanzaste un puntaje destacado"
          />
          <Achievement
            icon="bi bi-trophy"
            color="#009e60"
            title="Top 20 del mes"
            desc="Formas parte del ranking ecológico"
          />
        </div>
      </div>

      {/* ======= ESTILOS DARK MODE ======= */}
      <style>{`
        body[data-theme="dark"] h1,
        body[data-theme="dark"] h4 {
          color: #00d4a1 !important;
        }
        body[data-theme="dark"] .card {
          background: linear-gradient(145deg, #1a1a1a, #242424) !important;
          color: #e6e6e6 !important;
        }
        body[data-theme="dark"] .text-dark {
          color: #f0f0f0 !important;
        }
        body[data-theme="dark"] .progress {
          background-color: #222 !important;
        }
        body[data-theme="dark"] .progress-bar {
          background-color: #00c896 !important;
        }
      `}</style>
    </UserLayout>
  );
}

/* ======= COMPONENTE DE LOGRO ======= */
function Achievement({ icon, color, title, desc }) {
  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div
        className="card border-0 shadow-lg rounded-5 p-4 text-center h-100"
        style={{
          borderTop: `5px solid ${color}`,
          background: "linear-gradient(145deg, #f9f9f9, #ffffff)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <div className="fs-1 mb-1" style={{ color }}>
          <i className={icon}></i>
        </div>
        <h6 className="fw-semibold mb-1">{title}</h6>
        <p className="text-muted small mb-0">{desc}</p>
      </div>
    </div>
  );
}
