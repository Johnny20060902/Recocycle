import RecolectorLayout from "@/Layouts/RecolectorLayout";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "leaflet/dist/leaflet.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function RecolectorDashboard({ auth }) {
  const [stats, setStats] = useState({
    completados: 0,
    puntaje: auth?.user?.puntaje ?? 0,
    rating: auth?.user?.rating_promedio ?? 0,
    progresoSemanal: [],
  });

  // 🔄 Cargar estadísticas reales del recolector
  useEffect(() => {
    axios
      .get(route("recolector.dashboard.data"))
      .then((res) => {
        if (res.data) {
          setStats((prev) => ({
            ...prev,
            completados: res.data.completados ?? 0,
            puntaje: res.data.puntaje ?? prev.puntaje,
            rating: res.data.rating ?? prev.rating,
            progresoSemanal: res.data.progresoSemanal ?? [],
          }));
        }
      })
      .catch((err) =>
        console.error("Error cargando datos del recolector:", err)
      );
  }, []);

  // ==== GRÁFICO DE BARRAS ====
  const barData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Rutas completadas",
        data:
          stats.progresoSemanal && stats.progresoSemanal.length > 0
            ? stats.progresoSemanal
            : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#00b4ff",
        borderRadius: 6,
      },
    ],
  };

  return (
    <RecolectorLayout title="Panel del Recolector" auth={auth}>
      <div className="container text-center mt-3 animate__animated animate__fadeIn px-3">

        {/* ======= BIENVENIDA ======= */}
        <h1 className="fw-bold text-info mb-2 fs-3">
          🚛 ¡Hola, {auth.user.nombres} {auth.user.apellidos}!
        </h1>
        <p className="text-muted fs-6 mb-4">
          Medí tu impacto, revisá tus rutas y seguí creciendo 🌍
        </p>

        {/* ======= TARJETAS ======= */}
        <div className="row g-4 justify-content-center">

          {/* 🧾 Rutas completadas */}
          <Card
            color="#0078ff"
            bg="linear-gradient(145deg, #eaf6ff, #ffffff)"
            icon="bi bi-map-fill"
            title="Rutas completadas"
            value={stats.completados}
            subtitle="Recolecciones exitosas"
          />

          {/* 🟢 Puntos acumulados */}
          <Card
            color="#00c896"
            bg="linear-gradient(145deg, #ecfff7, #ffffff)"
            icon="bi bi-stars"
            title="Puntaje total"
            value={`${stats.puntaje} pts`}
            subtitle="Puntos ecológicos ganados"
          />

          {/* ⭐ Promedio de reputación */}
          <Card
            color="#ffc107"
            bg="linear-gradient(145deg, #fffbee, #ffffff)"
            icon="bi bi-star-fill"
            title="Promedio general"
            value={`⭐ ${stats.rating ? stats.rating.toFixed(2) : "0.00"}`}
            subtitle="Reputación recolector"
          />
        </div>

        {/* ======= GRÁFICO ======= */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 p-4">
              <h5 className="fw-bold text-info mb-3">📈 Progreso semanal</h5>
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { precision: 0 },
                    },
                  },
                }}
                height={260}
              />
            </div>
          </div>
        </div>

        {/* ======= ACCESOS RÁPIDOS ======= */}
        <div className="mt-5">
          <h4 className="fw-bold text-secondary mb-2 fs-5">Accesos rápidos</h4>
          <p className="text-muted mb-4 small">
            Accedé fácilmente a las funciones que más usás.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">

            <Link
              href={route("recolector.historial")}
              className="btn btn-outline-primary btn-lg shadow-sm px-4 rounded-pill d-flex align-items-center"
            >
              <i className="bi bi-clock-history me-2"></i> Ver historial
            </Link>

            <Link
              href={route("recolector.ranking")}
              className="btn btn-outline-warning btn-lg shadow-sm px-4 rounded-pill d-flex align-items-center"
            >
              <i className="bi bi-trophy-fill me-2"></i> Ranking
            </Link>

            <Link
              href={route("recolector.mapa")}
              className="btn btn-success text-white btn-lg shadow-sm px-4 rounded-pill d-flex align-items-center"
            >
              <i className="bi bi-geo-alt-fill me-2"></i> Ver mapa de puntos
            </Link>

          </div>
        </div>
      </div>

      {/* ======= ESTILOS ======= */}
      <style>{`
        .hover-shadow:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 180, 255, 0.25);
        }

        /* Dark mode */
        body[data-theme="dark"] .card {
          background: linear-gradient(145deg,#1b1b1b,#262626) !important;
          color: #f0f0f0 !important;
        }
        body[data-theme="dark"] h1, 
        body[data-theme="dark"] h4, 
        body[data-theme="dark"] h5 {
          color: #00b4ff !important;
        }
      `}</style>
    </RecolectorLayout>
  );
}

/* ======= COMPONENTE TARJETA RESPONSIVO ======= */
function Card({ color, bg, icon, title, value, subtitle }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4 d-flex">
      <div
        className="card border-0 shadow-lg rounded-5 p-4 text-center hover-shadow w-100"
        style={{
          borderTop: `5px solid ${color}`,
          background: bg,
        }}
      >
        <div className="fs-1 mb-2" style={{ color }}>
          <i className={icon}></i>
        </div>
        <h5 className="fw-semibold">{title}</h5>
        <p className="fw-bold mb-0" style={{ fontSize: "2rem", color }}>
          {value}
        </p>
        <p className="text-muted small mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
