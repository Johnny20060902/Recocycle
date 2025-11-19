import AppLayout from "@/Layouts/AppLayout";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import "animate.css";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard({
  auth,
  usuariosNormales,
  recolectores,
  administradores,
  totalUsuarios,
  materialReciclado,
  recolectoresActivos,
  reportesPendientes,
  reciclajeSemanal,
  usuariosNuevos,
  topRecolectores,
  distribucion = [],
}) {
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

  // === DATOS ===
  const reciclajeData = reciclajeSemanal || [0, 0, 0, 0, 0, 0, 0];
  const usuariosData = usuariosNuevos || [0, 0, 0, 0, 0, 0, 0];
  const topRecolectoresList = topRecolectores || [];

  const textColor = darkMode ? "#eaeaea" : "#333";
  const gridColor = darkMode ? "rgba(255,255,255,0.1)" : "#e9ecef";
  const bgCard = darkMode ? "#1b1b1b" : "#ffffff";

  // 📊 Gráfico semanal
  const ventasData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Reciclaje (kg)",
        backgroundColor: "#00c896",
        data: reciclajeData,
        borderRadius: 10,
      },
      {
        label: "Usuarios nuevos",
        backgroundColor: "#007bff",
        data: usuariosData,
        borderRadius: 10,
      },
    ],
  };

  // 📈 Gráfico visitas
  const traficoData = {
    labels: ["Jun", "Jul", "Ago", "Sep", "Oct"],
    datasets: [
      {
        label: "Visitas",
        data: [1600, 1800, 2300, 2500, 3100],
        fill: true,
        borderColor: "#00b894",
        backgroundColor: darkMode ? "#00b89433" : "#00b89422",
        tension: 0.3,
      },
    ],
  };

  // ♻️ Distribución de materiales
  const labelsDistribucion = distribucion.map((d) => d.nombre);
  const valoresDistribucion = distribucion.map((d) => d.porcentaje);

  const distribucionData = {
    labels: labelsDistribucion.length ? labelsDistribucion : ["Sin datos"],
    datasets: [
      {
        data: valoresDistribucion.length ? valoresDistribucion : [100],
        backgroundColor: [
          "#00c896",
          "#ffc107",
          "#007bff",
          "#ff6b6b",
          "#6f42c1",
          "#20c997",
          "#fd7e14",
        ],
        borderColor: darkMode ? "#222" : "#fff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { color: textColor } },
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { display: false } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } },
    },
  };

  return (
    <AppLayout auth={auth} title="Dashboard del Administrador">
      <div className="container py-4 animate__animated animate__fadeIn">
        {/* === ENCABEZADO === */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h1 className="fw-bold text-success">
            🌿 Panel Administrativo de Recocycle
          </h1>
          <p className="fs-5" style={{ color: darkMode ? "#bfbfbf" : "#555" }}>
            Bienvenido, {auth.user?.nombres || "Administrador"}. Supervisá el
            impacto ecológico en tiempo real ♻️
          </p>
        </motion.div>

        {/* === TARJETAS DE USUARIOS === */}
        <motion.div
          className="row g-3 mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          {[
            {
              title: "Usuarios normales",
              icon: "bi-person-fill",
              value: usuariosNormales,
              color: "primary",
            },
            {
              title: "Recolectores / Empresas",
              icon: "bi-truck-front-fill",
              value: recolectores,
              color: "success",
            },
            {
              title: "Administradores",
              icon: "bi-shield-lock-fill",
              value: administradores,
              color: "info",
            },
            {
              title: "Total de usuarios",
              icon: "bi-people-fill",
              value: totalUsuarios,
              color: "warning",
            },
          ].map((card, i) => (
            <div className="col-md-3 col-6" key={i}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card shadow-sm border-0 rounded-4 text-center p-3"
                style={{
                  background: bgCard,
                  color: textColor,
                  borderTop: `3px solid var(--bs-${card.color})`,
                  transition: "background 0.3s ease",
                }}
              >
                <div className={`text-${card.color} fs-2`}>
                  <i className={`bi ${card.icon}`}></i>
                </div>
                <h6 className="fw-semibold mt-2 opacity-75">{card.title}</h6>
                <h3 className="fw-bold">{card.value}</h3>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* === TARJETAS SECUNDARIAS === */}
        <motion.div
          className="row g-3 mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          {[
            {
              title: "Recolectores activos",
              icon: "bi-lightning-charge-fill",
              value: recolectoresActivos,
              color: "success",
            },
            {
              title: "Reportes pendientes",
              icon: "bi-exclamation-triangle-fill",
              value: reportesPendientes,
              color: "danger",
            },
          ].map((card, i) => (
            <div className="col-md-4 col-12" key={i}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="card shadow-sm border-0 rounded-4 text-center p-3"
                style={{
                  background: bgCard,
                  color: textColor,
                  borderTop: `3px solid var(--bs-${card.color})`,
                  transition: "background 0.3s ease",
                }}
              >
                <div className={`text-${card.color} fs-2`}>
                  <i className={`bi ${card.icon}`}></i>
                </div>
                <h6 className="fw-semibold mt-2 opacity-75">{card.title}</h6>
                <h3 className="fw-bold">{card.value}</h3>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* === GRÁFICOS === */}
        <div className="row g-4">
          {/* 📊 Barras semanales */}
          <motion.div
            className="col-lg-8"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="card shadow-sm border-0 rounded-4 p-4 h-100"
              style={{ background: bgCard, color: textColor }}
            >
              <h5 className="fw-bold text-primary mb-3">
                Estadísticas semanales
              </h5>
              <div style={{ height: "300px" }}>
                <Bar data={ventasData} options={chartOptions} />
              </div>
            </div>
          </motion.div>

          {/* 🧭 Distribución materiales */}
          <motion.div
            className="col-lg-4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="card shadow-sm border-0 rounded-4 p-4 mb-4"
              style={{ background: bgCard, color: textColor }}
            >
              <h6 className="fw-bold text-secondary mb-3">
                Distribución de materiales ♻️
              </h6>
              <div className="d-flex align-items-center">
                <div style={{ width: "60%", height: "160px" }}>
                  <Doughnut
                    data={distribucionData}
                    options={{
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { color: textColor },
                        },
                      },
                    }}
                  />
                </div>
                <div className="ms-3 small">
                  <ul className="list-unstyled mb-0">
                    {distribucion.length ? (
                      distribucion.map((m, i) => (
                        <li key={i} className="mb-1">
                          <span
                            className="me-2 rounded-circle d-inline-block"
                            style={{
                              background:
                                distribucionData.datasets[0].backgroundColor[
                                i % 7
                                ],
                              width: "10px",
                              height: "10px",
                            }}
                          ></span>
                          {m.nombre}: <b>{m.porcentaje}%</b>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted">Sin datos</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* 📈 Visitas mensuales */}
            <div
              className="card shadow-sm border-0 rounded-4 p-4"
              style={{ background: bgCard, color: textColor }}
            >
              <h6 className="fw-bold text-success mb-3">Visitas mensuales</h6>
              <div style={{ height: "160px" }}>
                <Line
                  data={traficoData}
                  options={{
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { ticks: { color: textColor } },
                      y: { ticks: { color: textColor } },
                    },
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* === BLOQUES INFERIORES === */}
        <div className="row mt-4 g-4">
          {[
            {
              title: "Recolectores destacados",
              color: "success",
              items: topRecolectoresList.map((r) => ({
                name: `${r.nombres} ${r.apellidos}`,
                kg: r.recolecciones,
              })),
            },
            {
              title: "Últimas actividades",
              color: "primary",
              items: [
                "♻️ Nuevo reciclaje registrado",
                "🏭 Empresa verificada con éxito",
                "🏆 Usuario alcanzó 1000 puntos",
                "🌍 Impacto global actualizado",
              ],
            },
            {
              title: "Resumen del mes",
              color: "warning",
              items: [
                ["Total reciclado", `${materialReciclado} kg`],
                ["Recolectores activos", recolectoresActivos],
                ["Reportes cerrados", `${reportesPendientes}`],
                ["Usuarios totales", totalUsuarios],
              ],
            },
          ].map((block, i) => (
            <motion.div
              key={i}
              className="col-lg-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 + i * 0.2 }}
            >
              <div
                className="card shadow-sm border-0 rounded-4 p-4 h-100"
                style={{ background: bgCard, color: textColor }}
              >
                <h6 className={`fw-bold text-${block.color} mb-3`}>
                  {block.title}
                </h6>
                {i === 0 && (
                  <ul className="list-group list-group-flush">
                    {block.items.length ? (
                      block.items.map((r, j) => (
                        <li
                          key={j}
                          className={`list-group-item d-flex justify-content-between align-items-center ${darkMode ? "bg-dark text-light" : ""
                            }`}
                        >
                          <span>{r.name}</span>
                          <span className="badge bg-success-subtle text-success rounded-pill">
                            {r.kg} recolecciones
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item text-muted">
                        No hay datos disponibles
                      </li>
                    )}
                  </ul>
                )}
                {i === 1 && (
                  <ul className="list-group list-group-flush small">
                    {block.items.map((a, j) => (
                      <li
                        key={j}
                        className={`list-group-item ${darkMode ? "bg-dark text-light" : ""
                          }`}
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
                {i === 2 && (
                  <ul className="list-group list-group-flush">
                    {block.items.map(([k, v], j) => (
                      <li
                        key={j}
                        className={`list-group-item d-flex justify-content-between ${darkMode ? "bg-dark text-light" : ""
                          }`}
                      >
                        <span>{k}</span> <b>{v}</b>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
