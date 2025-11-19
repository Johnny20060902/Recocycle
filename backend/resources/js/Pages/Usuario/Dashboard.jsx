import UserLayout from "@/Layouts/UserLayout";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useEffect } from "react";

export default function UsuarioDashboard({ auth }) {
  // 🔔 Alerta al registrar reciclaje
  useEffect(() => {
    const flash = window?.page?.props?.flash;
    if (flash?.success) {
      Swal.fire({
        icon: "success",
        title: "✅ Acción completada",
        text: flash.success,
        confirmButtonText: "Volver al inicio",
        confirmButtonColor: "#00c896",
        background: "#ffffff",
        color: "#0b3d2e",
        backdrop: `
          rgba(0,0,0,0.4)
          url("https://media.tenor.com/eDchk3srtycAAAAi/recycle.gif")
          center top
          no-repeat
        `,
      });
    }
  }, []);

  // 🧮 Variables del usuario
  const puntos = auth?.user?.puntaje ?? 0;
  const rating = auth?.user?.rating_promedio ?? 0;

  return (
    <UserLayout title="Panel del Usuario" auth={auth}>
      <div className="container text-center mt-4 animate__animated animate__fadeIn">
        {/* ======= ENCABEZADO ======= */}
        <h1 className="fw-bold mb-2 text-success">
          👋 ¡Bienvenido, {auth?.user?.nombres} {auth?.user?.apellidos}!
        </h1>
        <p className="fs-5 mb-5 text-secondary">
          Gana puntos y mejorá tu reputación ⭐ ayudando al planeta 🌎
        </p>

        {/* ======= TARJETAS ======= */}
        <div className="row g-4 justify-content-center">
          {/* 🟢 PUNTOS TOTALES */}
          <Card
            color="#009e60"
            bg="linear-gradient(145deg, #eafff2, #ffffff)"
            icon="bi bi-stars"
            title="Tus puntos"
            value={`${puntos} pts`}
            subtitle="Acumulados por tus acciones ecológicas"
          />

          {/* ⭐ PROMEDIO DE CALIFICACIÓN */}
          <Card
            color="#f5c518"
            bg="linear-gradient(145deg, #fff9e6, #ffffff)"
            icon="bi bi-star-fill"
            title="Tu reputación"
            value={`${rating.toFixed(2)} ⭐`}
            subtitle="Promedio de tus calificaciones"
          />
        </div>

        {/* ======= BOTONES DE ACCIÓN ======= */}
        <div className="mt-5">
          <h4 className="fw-bold text-success mb-3">🚀 ¡Seguí sumando puntos!</h4>
          <p className="text-secondary mb-4">
            Recicla, calificá y mejorá tu promedio para subir en el ranking 🌱
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link
              href={route("usuario.reciclar")}
              className="btn btn-success btn-lg shadow-sm px-4 rounded-pill text-white fw-semibold hover-eco"
            >
              ♻️ Nueva Recolección
            </Link>

            <Link
              href={route("usuario.reciclajes.index")}
              className="btn btn-outline-secondary btn-lg shadow-sm px-4 rounded-pill fw-semibold"
            >
              📋 Mis Recolecciones
            </Link>

            <Link
              href={route("usuario.ranking")}
              className="btn btn-outline-primary btn-lg shadow-sm px-4 rounded-pill fw-semibold"
            >
              🏆 Ranking
            </Link>

            <Link
              href={route("usuario.premios")}
              className="btn btn-outline-warning btn-lg shadow-sm px-4 rounded-pill fw-semibold"
            >
              🎁 Premios
            </Link>
          </div>
        </div>

        {/* ======= BOTÓN FLOTANTE (solo móviles) ======= */}
        <Link
          href={route("usuario.reciclar")}
          className="btn btn-success rounded-circle shadow-lg d-lg-none d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            width: "65px",
            height: "65px",
            zIndex: 1080,
            fontSize: "1.7rem",
            boxShadow: "0 4px 18px rgba(0,150,80,0.35)",
          }}
          title="Nueva recolección"
        >
          <i className="bi bi-plus-lg"></i>
        </Link>
      </div>

      {/* ======= ESTILOS OSCUROS ======= */}
      <style>{`
        .hover-eco:hover {
          background-color: #00e68a !important;
          box-shadow: 0 0 12px rgba(0, 230, 138, 0.5);
          transform: scale(1.03);
          transition: all 0.2s ease-in-out;
        }

        body[data-theme="dark"] .text-secondary,
        body[data-theme="dark"] .text-muted {
          color: #b5b5b5 !important;
        }

        body[data-theme="dark"] .card {
          background: linear-gradient(145deg, #1b1b1b, #262626) !important;
          color: #e6e6e6 !important;
        }

        body[data-theme="dark"] .card .text-dark {
          color: #f0f0f0 !important;
        }

        body[data-theme="dark"] h1,
        body[data-theme="dark"] h4,
        body[data-theme="dark"] h5 {
          color: #00d4a1 !important;
        }

        body[data-theme="dark"] footer {
          color: #b5b5b5 !important;
        }

        /* Botón flotante dark mode */
        body[data-theme="dark"] .btn-success {
          background-color: #00b47d !important;
          border-color: #00b47d !important;
        }
      `}</style>
    </UserLayout>
  );
}

/* ======= COMPONENTE TARJETA ======= */
function Card({ color, bg, icon, title, value, subtitle }) {
  return (
    <div className="col-md-5">
      <div
        className="card border-0 shadow-lg rounded-5 p-4 text-center hover-shadow"
        style={{
          borderTop: `5px solid ${color}`,
          background: bg,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <div className="fs-1 mb-2" style={{ color }}>
          <i className={icon}></i>
        </div>
        <h5 className="fw-semibold" style={{ color }}>
          {title}
        </h5>
        <p
          className="display-6 fw-bold text-dark mb-0"
          style={{
            fontSize: "2.6rem",
            color: color,
          }}
        >
          {value}
        </p>
        <p className="text-muted small mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
