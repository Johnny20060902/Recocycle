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
      });
    }
  }, []);

  return (
    <UserLayout title="Mis Puntos" auth={auth}>
      <div className="container text-center animate__animated animate__fadeIn mt-4">
        {/* ======= TÍTULO ======= */}
        <h1 className="fw-bold text-success mb-2">🌿 Tus Puntos</h1>
        <p className="fs-5 text-secondary mb-5">
          Mira tu progreso y nivel ecológico en Recocycle.
        </p>

        {/* ======= TARJETA PRINCIPAL ======= */}
        <div
          className="card border-0 shadow-lg rounded-5 mx-auto p-4 mb-4"
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
          <p className="display-5 fw-bold text-dark mb-0">
            {estadisticas.total_puntos} pts
          </p>
          <p className="text-muted small mt-1">
            Ranking #{estadisticas.ranking}
          </p>

          {/* ======= BARRA DE PROGRESO ======= */}
          <div
            className="progress rounded-pill mt-4"
            style={{
              height: "20px",
              backgroundColor: "#dfeee6",
            }}
          >
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{
                width: `${estadisticas.progreso}%`,
                backgroundColor: "#00c896",
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
        <div className="row g-4 justify-content-center mt-5">
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
          background: linear-gradient(145deg, #1b1b1b, #262626) !important;
          color: #e6e6e6 !important;
        }
        body[data-theme="dark"] .text-dark {
          color: #f0f0f0 !important;
        }
        body[data-theme="dark"] .text-secondary,
        body[data-theme="dark"] .text-muted {
          color: #b5b5b5 !important;
        }
        body[data-theme="dark"] footer {
          color: #b5b5b5 !important;
        }
        body[data-theme="dark"] .progress {
          background-color: #2a2a2a !important;
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
    <div className="col-md-3">
      <div
        className="card border-0 shadow-lg rounded-5 p-4 text-center"
        style={{
          borderTop: `5px solid ${color}`,
          background: "linear-gradient(145deg, #f9f9f9, #ffffff)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <div className="fs-1 mb-2" style={{ color }}>
          <i className={icon}></i>
        </div>
        <h6 className="fw-semibold mb-1">{title}</h6>
        <p className="text-muted small mb-0">{desc}</p>
      </div>
    </div>
  );
}
