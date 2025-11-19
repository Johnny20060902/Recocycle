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
        if (res.data?.userRank) {
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
      .catch(() => {});
  }, []);

  // DATA DE GRÁFICOS
  const barData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Puntos ganados",
        data:
          stats.progresoSemanal?.length > 0
            ? stats.progresoSemanal
            : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#00c896",
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels:
      stats.materialesPorTipo?.length > 0
        ? stats.materialesPorTipo.map((m) => m.tipo)
        : ["Plástico", "Cartón", "Vidrio", "Metal"],

    datasets: [
      {
        data:
          stats.materialesPorTipo?.length > 0
            ? stats.materialesPorTipo.map((m) => m.cantidad)
            : [35, 25, 20, 10],
        backgroundColor: ["#00c896", "#00b87b", "#008f60", "#005f3a"],
        borderWidth: 1,
      },
    ],
  };

  const nivel = Math.min(100, (stats.puntaje / 1000) * 100);

  return (
    <UserLayout title="Mi Progreso Ecológico" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">

        {/* ===== ENCABEZADO ===== */}
        <div className="text-center mb-4">
          <h1 className="fw-bold text-eco fs-2">🌿 Mi Progreso Ecológico</h1>
          <p className="text-secondary fs-6">
            Tu impacto positivo en el planeta 🌍
          </p>
        </div>

        {/* ===== PERFIL DEL USUARIO ===== */}
        <div
          className="glass-card p-4 rounded-4 shadow-lg text-center mb-5 mx-auto w-100"
          style={{ maxWidth: 700 }}
        >
          <img
            src="/images/logo-recocycle.png"
            alt="EcoPerfil"
            className="rounded-circle bg-white p-2 shadow-sm mb-3"
            style={{ width: 90, height: 90 }}
          />

          <h3 className="fw-bold text-success mb-1 fs-4 text-break">
            {auth.user.nombres} {auth.user.apellidos}
          </h3>

          <p className="text-secondary mb-2 fs-6">
            Ecorreciclador Nivel {Math.floor(nivel / 20) + 1}
          </p>

          <h5 className="fw-semibold text-success fs-6">
            🏆 Posición #{stats.posicion || "—"} a nivel nacional
          </h5>

          {/* Barra de nivel */}
          <div className="progress mt-3" style={{ height: 18, borderRadius: 12 }}>
            <div
              className="progress-bar bg-success progress-animated"
              role="progressbar"
              style={{ width: `${nivel}%`, borderRadius: 12 }}
            ></div>
          </div>

          <p className="small text-secondary mt-2">
            Nivel {Math.floor(nivel / 20) + 1} — {stats.puntaje} puntos 🌱
          </p>
        </div>

        {/* ===== MÉTRICAS ===== */}
        <div className="row g-3 text-center mb-4">
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
            title="Visitas"
            value={`${stats.visitas}`}
          />
        </div>

        {/* ===== GRÁFICOS ===== */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-lg-6">
            <div className="card shadow-lg border-0 p-4 rounded-4 h-100">
              <h5 className="fw-bold text-success text-center mb-3 fs-5">
                📈 Progreso Semanal
              </h5>

              <Bar
                data={barData}
                options={{
                  plugins: { legend: { display: false } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                height={250}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card shadow-lg border-0 p-4 rounded-4 h-100">
              <h5 className="fw-bold text-success text-center mb-3 fs-5">
                🧩 Tipos de Material Reciclado
              </h5>

              <Doughnut
                data={doughnutData}
                options={{
                  plugins: { legend: { position: "bottom" } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                height={250}
              />
            </div>
          </div>
        </div>

        {/* ===== LOGROS ===== */}
        <div className="text-center mt-4 mb-5">
          <h4 className="fw-bold text-success mb-3 fs-5">🎖️ Tus Logros</h4>

          <div className="d-flex flex-wrap justify-content-center gap-2 px-2">
            {[
              "🌱 Primer reciclaje completado",
              "♻️ 10 materiales reciclados",
              `🏅 Nivel ${Math.floor(nivel / 20) + 1} alcanzado`,
              "⚡ Ahorro energético notable",
            ].map((logro, i) => (
              <span
                key={i}
                className="badge bg-success-subtle text-success p-3 rounded-4 shadow-sm"
              >
                {logro}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ESTILOS ===== */}
      <style>{`
        .text-eco { color: #00c896 !important; }

        .glass-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0,150,100,0.2);
          transition: 0.25s ease;
        }
        .glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,150,100,0.25);
        }

        .progress-animated {
          animation: ecoPulse 2.8s ease-in-out infinite alternate;
        }
        @keyframes ecoPulse {
          0% { filter: brightness(0.9); }
          100% { filter: brightness(1.25); }
        }

        body[data-theme="dark"] {
          background: #08120b !important;
        }
        body[data-theme="dark"] .glass-card {
          background: rgba(0,40,25,0.85);
          border: 1px solid rgba(0,255,180,0.25);
          color: #eaffef;
        }
        body[data-theme="dark"] .card {
          background: rgba(25,25,25,0.95) !important;
          border: 1px solid rgba(255,255,255,0.1);
          color: #eaeaea;
        }
      `}</style>
    </UserLayout>
  );
}

/* ===== COMPONENTE TARJETA ===== */
function MetricCard({ color, icon, title, value }) {
  return (
    <div className="col-6 col-md-3">
      <div
        className="card border-0 shadow-lg rounded-4 p-3 h-100 text-center"
        style={{
          background: `linear-gradient(145deg, ${color}22, #ffffff)`,
          borderTop: `5px solid ${color}`,
        }}
      >
        <div className="fs-2 mb-1" style={{ color }}>
          <i className={icon}></i>
        </div>

        <h6 className="fw-semibold text-dark mb-1">{title}</h6>
        <h5 className="fw-bold" style={{ color: "#003322" }}>
          {value}
        </h5>
      </div>
    </div>
  );
}
