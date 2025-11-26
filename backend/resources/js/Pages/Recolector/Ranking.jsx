import RecolectorLayout from "@/Layouts/RecolectorLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";

export default function Ranking({ auth }) {
  const [recolectores, setRecolectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("recolectorTheme") === "dark"
  );

  /* ============================
      🔹 Cargar ranking desde Backend
  ============================ */
  useEffect(() => {
    axios
      .get(route("recolector.ranking.data"))
      .then((res) => {
        setRecolectores(res.data.recolectores || []);
      })
      .catch((err) => console.error("Error cargando ranking:", err))
      .finally(() => setLoading(false));
  }, []);

  /* ============================
      🔹 Detectar cambios de modo oscuro
  ============================ */
  useEffect(() => {
    const listener = () => {
      setDarkMode(localStorage.getItem("recolectorTheme") === "dark");
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  /* ============================
      🖼️ Foto del recolector
  ============================ */
 const getFotoUrl = (reco) => reco.foto_final || "/images/default-recolector.png";
 
  return (
    <RecolectorLayout title="Ranking de Recolectores" auth={auth}>
      <div
        className={`container py-4 ${
          darkMode ? "text-light" : "text-dark"
        } animate__animated animate__fadeIn`}
      >
        {/* ======= TITULO ======= */}
        <h1 className="fw-bold text-success mb-3 text-center">
          🏆 Ranking de Recolectores Recocycle
        </h1>
        <p className="text-center text-muted mb-5">
          Clasificación actual según puntaje, calificaciones y desempeño.
        </p>

        {/* ======= LOADING ======= */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success"></div>
            <p className="mt-3 text-muted">Cargando ranking...</p>
          </div>
        ) : recolectores.length === 0 ? (
          <div
            className={`alert text-center shadow-sm ${
              darkMode ? "alert-secondary" : "alert-warning"
            }`}
          >
            No hay recolectores registrados aún.
          </div>
        ) : (
          /* ======= TABLA ======= */
          <div
            className={`table-responsive shadow-lg rounded-4 ${
              darkMode ? "bg-dark text-light" : "bg-white"
            }`}
          >
            <table
              className={`table align-middle mb-0 ${
                darkMode ? "table-dark table-striped" : "table-hover"
              }`}
            >
              <thead
                className="text-white"
                style={{
                  background:
                    "linear-gradient(90deg, #00b894 0%, #00cec9 50%, #0984e3 100%)",
                }}
              >
                <tr>
                  <th className="text-center">Posición</th>
                  <th>Recolector</th>
                  <th className="text-center">Puntaje</th>
                  <th className="text-center">Nivel</th>
                  <th className="text-center">Recolecciones</th>
                </tr>
              </thead>

              <tbody>
                {recolectores
                  .sort((a, b) => b.puntaje - a.puntaje)
                  .map((reco, index) => (
                    <tr
                      key={reco.id}
                      className={
                        reco.id === auth.user.id
                          ? darkMode
                            ? "table-success border-success border-2"
                            : "table-light border-success border-2"
                          : ""
                      }
                    >
                      {/* POSICION */}
                      <td className="text-center fw-bold fs-5">
                        {index + 1 === 1 ? (
                          <span className="text-warning">🥇</span>
                        ) : index + 1 === 2 ? (
                          <span className="text-secondary">🥈</span>
                        ) : index + 1 === 3 ? (
                          <span className="text-warning">🥉</span>
                        ) : (
                          <span className="text-muted">{index + 1}</span>
                        )}
                      </td>

                      {/* INFORMACION DEL RECOLECTOR */}
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={getFotoUrl(reco)}
                            alt={reco.nombres}
                            className="rounded-circle shadow-sm border"
                            style={{
                              height: "55px",
                              width: "55px",
                              objectFit: "cover",
                              borderColor:
                                reco.id === auth.user.id
                                  ? "#00b894"
                                  : "#dee2e6",
                            }}
                            onError={(e) =>
                              (e.target.src = "/images/default-recolector.png")
                            }
                          />
                          <div>
                            <h6 className="mb-0 fw-semibold">
                              {reco.nombres} {reco.apellidos}
                            </h6>
                            <small className="text-muted">
                              {reco.email || "sin correo"}
                            </small>
                          </div>
                        </div>
                      </td>

                      {/* PUNTAJE */}
                      <td
                        className={`text-center fw-bold ${
                          darkMode ? "text-info" : "text-success"
                        }`}
                      >
                        {reco.puntaje ?? 0}
                      </td>

                      {/* NIVEL */}
                      <td className="text-center">
                        {reco.puntaje >= 200 ? (
                          <span className="badge bg-success shadow-sm">
                            Experto 🌱
                          </span>
                        ) : reco.puntaje >= 100 ? (
                          <span className="badge bg-primary shadow-sm">
                            Intermedio ♻️
                          </span>
                        ) : (
                          <span className="badge bg-secondary shadow-sm">
                            Nuevo 🍃
                          </span>
                        )}
                      </td>

                      {/* CANTIDAD DE RECOLECCIONES */}
                      <td className="text-center text-muted fw-semibold">
                        {reco.recolecciones || 0}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RecolectorLayout>
  );
}
