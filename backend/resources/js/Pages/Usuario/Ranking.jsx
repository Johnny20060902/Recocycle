import UserLayout from "@/Layouts/UserLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function MiProgreso({ auth }) {
  const [stats, setStats] = useState({
    puntaje: 0,
    posicion: 0,
    materiales: 0,
    energiaAhorrada: 0,
    visitas: 0,
    progresoSemanal: [],
    materialesPorTipo: [],
  });

  useEffect(() => {
    axios
      .get(route("usuario.ranking.data"))
      .then((res) => {
        if (res.data && res.data.userRank) {
          setStats({
            puntaje: res.data.userRank.puntaje ?? 0,
            posicion: res.data.userRank.posicion ?? 0,
            materiales: res.data.userRank.materiales ?? 0,
            energiaAhorrada: res.data.userRank.energiaAhorrada ?? 0,
            visitas: res.data.userRank.visitas ?? 0,
            progresoSemanal: res.data.userRank.progresoSemanal ?? [],
            materialesPorTipo: res.data.userRank.materialesPorTipo ?? [],
          });
        }
      })
      .catch((err) => console.error("Error cargando progreso:", err));
  }, []);

  // ==== DATA SEGURA PARA GRÁFICOS ====
  const barData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Puntos ganados",
        data:
          stats.progresoSemanal && stats.progresoSemanal.length > 0
            ? stats.progresoSemanal
            : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#00c896",
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels:
      stats.materialesPorTipo && stats.materialesPorTipo.length > 0
        ? stats.materialesPorTipo.map((m) => m.tipo)
        : ["Plástico", "Cartón", "Vidrio", "Metal"],
    datasets: [
      {
        data:
          stats.materialesPorTipo && stats.materialesPorTipo.length > 0
            ? stats.materialesPorTipo.map((m) => m.cantidad)
            : [35, 25, 20, 10],
        backgroundColor: ["#00c896", "#00b87b", "#008f60", "#005f3a"],
        borderWidth: 1,
      },
    ],
  };

  const nivel = Math.min(100, (stats.puntaje / 1000) * 100); // 1000 puntos = nivel máximo

  return (
    <UserLayout title="Mi Progreso Ecológico" auth={auth}>
      <div className="container py-5 animate__animated animate__fadeIn">
        {/* ===== ENCABEZADO ===== */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-eco">🌿 Mi Progreso Ecológico</h1>
          <p className="text-secondary fs-5">
            Tu impacto positivo en el planeta 🌍
          </p>
        </div>

        {/* ===== PERFIL DEL USUARIO ===== */}
        <div
          className="glass-card p-4 rounded-4 shadow-lg text-center mb-5 mx-auto"
          style={{ maxWidth: 700 }}
        >
          <img
            src="/images/logo-recocycle.png"
            alt="EcoPerfil"
            className="rounded-circle bg-white p-2 shadow-sm mb-3"
            style={{ width: 90, height: 90 }}
          />
          <h3 className="fw-bold text-success mb-1">
            {auth.user.nombres} {auth.user.apellidos}
          </h3>
          <p className="text-secondary mb-2">
            Ecorreciclador Nivel {Math.floor(nivel / 20) + 1}
          </p>
          <h4 className="fw-semibold text-success">
            🏆 Posición #{stats.posicion || "—"} en el ranking nacional
          </h4>

          {/* Barra de nivel */}
          <div
            className="progress mt-3"
            style={{ height: "18px", borderRadius: "12px" }}
          >
            <div
              className="progress-bar bg-success progress-animated"
              role="progressbar"
              style={{ width: `${nivel}%`, borderRadius: "12px" }}
            ></div>
          </div>
          <p className="small text-secondary mt-2">
            Nivel {Math.floor(nivel / 20) + 1} — {stats.puntaje} puntos 🌱
          </p>
        </div>

        {/* ===== MÉTRICAS ===== */}
        <div className="row g-4 text-center mb-5">
          <MetricCard
            color="#00c896"
            icon="bi bi-stars"
            title="Puntos Totales"
            value={`${stats.puntaje} pts`}
          />
          <MetricCard
            color="#00a870"
            icon="bi bi-recycle"
            title="Materiales Reciclados"
            value={`${stats.materiales} kg`}
          />
          <MetricCard
            color="#008f60"
            icon="bi bi-lightning-charge"
            title="Energía Ahorrada"
            value={`${stats.energiaAhorrada} kWh`}
          />
          <MetricCard
            color="#005f3a"
            icon="bi bi-geo-alt"
            title="Visitas a Puntos Verdes"
            value={`${stats.visitas}`}
          />
        </div>

        {/* ===== GRÁFICOS ===== */}
        <div className="row g-4 justify-content-center">
          <div className="col-lg-6">
            <div className="card shadow-lg border-0 p-4 rounded-4 h-100">
              <h5 className="fw-bold text-success mb-3 text-center">
                📈 Progreso Semanal
              </h5>
              <Bar
                data={barData}
                options={{ plugins: { legend: { display: false } } }}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card shadow-lg border-0 p-4 rounded-4 h-100">
              <h5 className="fw-bold text-success mb-3 text-center">
                🧩 Tipos de Material Reciclado
              </h5>
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>

        {/* ===== LOGROS ===== */}
        <div className="text-center mt-5">
          <h4 className="fw-bold text-success mb-4">🎖️ Tus Logros Ecológicos</h4>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <span className="badge bg-success-subtle text-success p-3 rounded-4 shadow-sm">
              🌱 Primer reciclaje completado
            </span>
            <span className="badge bg-success-subtle text-success p-3 rounded-4 shadow-sm">
              ♻️ 10 materiales reciclados
            </span>
            <span className="badge bg-success-subtle text-success p-3 rounded-4 shadow-sm">
              🏅 Nivel {Math.floor(nivel / 20) + 1} alcanzado
            </span>
            <span className="badge bg-success-subtle text-success p-3 rounded-4 shadow-sm">
              ⚡ Ahorro energético notable
            </span>
          </div>
        </div>
      </div>

      {/* ===== ESTILOS ===== */}
      <style>{`
        .text-eco { color: #00c896 !important; }
        .glass-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(0,150,100,0.2);
          transition: all 0.3s ease;
        }
        .glass-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,150,100,0.25); }
        .progress-bar { transition: width 1.5s ease; }
        .progress-animated { animation: ecoProgress 3s ease-in-out infinite alternate; }
        @keyframes ecoProgress { 0% { filter: brightness(0.9); } 100% { filter: brightness(1.3); } }

        body[data-theme="dark"] {
          background: #0b1510 !important;
          color: #eaeaea !important;
        }
        body[data-theme="dark"] .glass-card {
          background: rgba(0,40,25,0.85);
          border: 1px solid rgba(0,255,180,0.3);
          color: #f0fff0 !important;
          box-shadow: 0 10px 40px rgba(0,255,180,0.12);
        }
        body[data-theme="dark"] .card {
          background: rgba(25,25,25,0.95);
          border: 1px solid rgba(255,255,255,0.1);
          color: #f5f5f5;
        }
      `}</style>
    </UserLayout>
  );
}

/* ===== COMPONENTE DE MÉTRICA ===== */
function MetricCard({ color, icon, title, value }) {
  return (
    <div className="col-6 col-lg-3">
      <div
        className="card border-0 shadow-lg rounded-4 p-4 text-center"
        style={{
          background: `linear-gradient(145deg, ${color}15, #ffffff)`,
          borderTop: `5px solid ${color}`,
        }}
      >
        <div className="fs-2 mb-2" style={{ color }}>
          <i className={icon}></i>
        </div>
        <h6 className="fw-semibold mb-1">{title}</h6>
        <h5 className="fw-bold text-dark">{value}</h5>
      </div>
    </div>
  );
}
