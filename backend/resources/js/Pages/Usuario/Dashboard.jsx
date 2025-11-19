import UserLayout from "@/Layouts/UserLayout";
import { Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useEffect } from "react";

export default function UsuarioDashboard({ auth }) {
  // 🔔 Flash alerts
  useEffect(() => {
    const flash = window?.page?.props?.flash;
    if (flash?.success) {
      Swal.fire({
        icon: "success",
        title: "✅ Acción completada",
        text: flash.success,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#00c896",
        background: "#ffffff",
        color: "#0b3d2e",
        allowOutsideClick: true,
      });
    }
  }, []);

  const puntos = auth?.user?.puntaje ?? 0;
  const rating = auth?.user?.rating_promedio ?? 0;

  return (
    <UserLayout title="Panel del Usuario" auth={auth}>
      <div className="container text-center animate__animated animate__fadeIn py-4">

        {/* ====== TÍTULO ====== */}
        <h1 className="fw-bold text-success fs-3 mb-2">
          👋 ¡Hola, {auth?.user?.nombres}!
        </h1>
        <p className="text-secondary fs-6 mb-4 px-2">
          Sumá puntos, reciclá y escalá en el ranking ecológico 🌱
        </p>

        {/* ======= TARJETAS ======= */}
        <div className="row g-4 justify-content-center mb-3">
          {/* PUNTOS */}
          <Card
            color="#00a86b"
            bg="linear-gradient(145deg,#eafff2,#ffffff)"
            icon="bi bi-stars"
            title="Tus puntos"
            value={`${puntos} pts`}
            subtitle="Puntos ecológicos obtenidos"
          />

          {/* RATING */}
          <Card
            color="#f5c518"
            bg="linear-gradient(145deg,#fff9e6,#ffffff)"
            icon="bi bi-star-fill"
            title="Tu reputación"
            value={`${rating.toFixed(2)} ⭐`}
            subtitle="Promedio de calificaciones"
          />
        </div>

        {/* ======= CTA ======= */}
        <div className="mt-4">
          <h4 className="fw-bold text-success fs-5 mb-2">🚀 ¡Seguí sumando puntos!</h4>
          <p className="text-secondary fs-6 px-2">
            Reciclá y calificá para mejorar tu posición en el ranking 🌍
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
            <Link
              href={route("usuario.reciclar")}
              className="btn btn-success btn-lg px-4 rounded-pill fw-semibold shadow-sm hover-eco"
            >
              ♻️ Nueva Recolección
            </Link>

            <Link
              href={route("usuario.reciclajes.index")}
              className="btn btn-outline-secondary btn-lg px-4 rounded-pill fw-semibold shadow-sm"
            >
              📋 Mis Recolecciones
            </Link>

            <Link
              href={route("usuario.ranking")}
              className="btn btn-outline-primary btn-lg px-4 rounded-pill fw-semibold shadow-sm"
            >
              🏆 Ranking
            </Link>

            <Link
              href={route("usuario.premios")}
              className="btn btn-outline-warning btn-lg px-4 rounded-pill fw-semibold shadow-sm"
            >
              🎁 Premios
            </Link>
          </div>
        </div>

        {/* ======== BOTÓN FLOTANTE MÓVIL ======== */}
        <Link
          href={route("usuario.reciclar")}
          className="btn btn-success rounded-circle d-lg-none d-flex align-items-center justify-content-center floating-btn"
          title="Nueva recolección"
        >
          <i className="bi bi-plus-lg"></i>
        </Link>
      </div>

      {/* ======= ESTILOS ======= */}
      <style>{`
        .hover-eco:hover {
          background-color: #00e68a !important;
          box-shadow: 0 0 14px rgba(0,230,138,0.5);
          transform: scale(1.03);
        }

        .floating-btn {
          position: fixed;
          bottom: 25px;
          right: 25px;
          width: 60px;
          height: 60px;
          font-size: 1.7rem;
          z-index: 9999;
          box-shadow: 0 6px 18px rgba(0,150,80,0.35);
        }

        body[data-theme="dark"] .card {
          background: linear-gradient(145deg,#1b1b1b,#242424) !important;
          color: #e6e6e6 !important;
        }

        body[data-theme="dark"] .text-secondary {
          color: #b5b5b5 !important;
        }

        body[data-theme="dark"] h1,
        body[data-theme="dark"] h4 {
          color: #00d4a1 !important;
        }
      `}</style>
    </UserLayout>
  );
}

/* ====== COMPONENTE CARD ====== */
function Card({ color, bg, icon, title, value, subtitle }) {
  return (
    <div className="col-10 col-sm-6 col-md-5 col-lg-4">
      <div
        className="card border-0 shadow-lg rounded-5 p-4 text-center h-100"
        style={{
          borderTop: `6px solid ${color}`,
          background: bg,
          transition: "transform .2s ease, box-shadow .2s ease",
        }}
      >
        <div className="fs-1 mb-1" style={{ color }}>
          <i className={icon}></i>
        </div>

        <h5 className="fw-semibold mb-1" style={{ color }}>
          {title}
        </h5>

        <p className="fw-bold text-dark mb-0" style={{ fontSize: "2.3rem" }}>
          {value}
        </p>

        <p className="text-muted small mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
