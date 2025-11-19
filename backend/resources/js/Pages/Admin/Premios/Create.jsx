import { useForm, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import AppLayout from "@/Layouts/AppLayout";
import { useEffect, useState } from "react";
import "animate.css";

export default function PremioCreate({ auth }) {
  const { data, setData, post, progress } = useForm({
    nombre: "",
    fecha_limite: "",
    archivo: null,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.premios.store"), {
      onSuccess: () =>
        Swal.fire(
          "Publicado",
          "El anuncio del premio fue subido correctamente.",
          "success"
        ),
      onError: () =>
        Swal.fire("Error", "No se pudo subir el anuncio.", "error"),
    });
  };

  // 🎨 Paleta según modo
  const textColor = darkMode ? "#eaeaea" : "#222";
  const secondaryText = darkMode ? "#bfbfbf" : "#555";
  const bgCard = darkMode ? "#181818" : "#ffffff";
  const bgInput = darkMode ? "#222" : "#fff";
  const borderColor = darkMode ? "#333" : "#ddd";

  return (
    <AppLayout title="Anuncio de Premios" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">
        
        {/* ======= ENCABEZADO ======= */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h2
            className="fw-bold m-0"
            style={{ color: darkMode ? "#4dd2a1" : "#198754" }}
          >
            🏆 Anuncio de Premios
          </h2>

          <Link
            href={route("admin.premios.index")}
            className={`btn rounded-pill shadow-sm px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${
              darkMode
                ? "btn-outline-light text-light border-secondary"
                : "btn-outline-secondary"
            }`}
          >
            <i className="bi bi-arrow-left-circle"></i>
            Volver
          </Link>
        </div>

        {/* ======= CARD FORM ======= */}
        <div
          className="card border-0 shadow-lg rounded-4 p-4 text-center mx-auto"
          style={{
            background: bgCard,
            color: textColor,
            transition: "all 0.3s ease",
            maxWidth: 900,
          }}
        >
          <h4 className="fw-bold mb-3">Premio del Mes</h4>
          <p className="small mb-4" style={{ color: secondaryText }}>
            Registra el premio que se anunciará este mes. Puedes adjuntar un archivo o imagen.
          </p>

          <form onSubmit={handleSubmit}>
            {/* CAMPOS */}
            <div className="row justify-content-center g-4 mb-3">
              <div className="col-md-5 text-start">
                <label className="fw-semibold mb-1">Nombre del premio:</label>
                <input
                  type="text"
                  className="form-control shadow-sm rounded-pill"
                  style={{
                    backgroundColor: bgInput,
                    color: textColor,
                    borderColor,
                  }}
                  value={data.nombre}
                  onChange={(e) => setData("nombre", e.target.value)}
                  placeholder="Ej: Premio al mejor recolector"
                />
              </div>

              <div className="col-md-5 text-start">
                <label className="fw-semibold mb-1">Fecha límite:</label>
                <input
                  type="date"
                  className="form-control shadow-sm rounded-pill"
                  style={{
                    backgroundColor: bgInput,
                    color: textColor,
                    borderColor,
                  }}
                  value={data.fecha_limite}
                  onChange={(e) => setData("fecha_limite", e.target.value)}
                />
              </div>
            </div>

            {/* ARCHIVO */}
            <div className="my-4">
              <label className="fw-semibold d-block mb-2">
                Archivo del anuncio (PDF, imagen, etc.)
              </label>

              <input
                type="file"
                className="form-control w-75 w-md-50 mx-auto shadow-sm rounded-pill"
                style={{
                  backgroundColor: bgInput,
                  color: textColor,
                  borderColor,
                }}
                onChange={(e) => setData("archivo", e.target.files[0])}
              />

              {progress && (
                <div className="progress w-75 w-md-50 mx-auto mt-2" style={{ height: 8 }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${progress.percentage}%`,
                      background: darkMode ? "#00c896" : "#198754",
                    }}
                  >
                    {progress.percentage}%
                  </div>
                </div>
              )}
            </div>

            {/* BOTÓN GUARDAR */}
            <button
              type="submit"
              className="btn rounded-pill px-5 py-2 fw-semibold shadow-sm mt-3"
              style={{
                background: "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
                color: "#fff",
                border: "none",
              }}
            >
              <i className="bi bi-upload me-2"></i>
              Subir Anuncio
            </button>
          </form>
        </div>

        {/* MEDIA QUERIES */}
        <style>{`
          @media (max-width: 576px) {
            .rounded-pill {
              border-radius: 20px !important;
            }
            .form-control {
              font-size: 0.9rem;
              padding: 0.55rem 1rem;
            }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
