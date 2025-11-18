import { useForm, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

const ALL_CATEGORIES = [
  "Carton",
  "Vidrios",
  "Baterias",
  "Electronicos",
  "Organicos",
  "Papel",
  "Todo",
];

export default function EmpresaCreate({ auth }) {
  const { data, setData, post, progress, processing, errors } = useForm({
    nombre: "",
    correo: "",
    contacto: "",
    password: "",
    logo: null,
    categorias: [],
  });

  const [darkMode, setDarkMode] = useState(
    document.body.getAttribute("data-theme") === "dark"
  );

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDarkMode(document.body.getAttribute("data-theme") === "dark")
    );
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("admin.empresas.store"), {
      forceFormData: true, // asegura envío correcto con archivo
      onSuccess: () => {
        Swal.fire(
          "Registrada",
          "La empresa se registró correctamente.",
          "success"
        );
      },
      onError: () => {
        Swal.fire(
          "Error",
          "Ocurrió un problema al registrar la empresa.",
          "error"
        );
      },
    });
  };

  const handleCheckbox = (cat) => {
    // Si tocó "Todo"
    if (cat === "Todo") {
      if (data.categorias.includes("Todo")) {
        // Ya estaba activo → limpiar todo
        setData("categorias", []);
      } else {
        // Activar todas las categorías
        setData("categorias", ALL_CATEGORIES);
      }
      return;
    }

    let nuevas = [];

    if (data.categorias.includes(cat)) {
      // Quitar categoría
      nuevas = data.categorias.filter((c) => c !== cat);
    } else {
      // Agregar categoría
      nuevas = [...data.categorias, cat];
    }

    const sinTodo = ALL_CATEGORIES.filter((c) => c !== "Todo");
    const tieneTodasMenosTodo = sinTodo.every((c) => nuevas.includes(c));

    if (tieneTodasMenosTodo) {
      // Si marcó todas las específicas → marcamos también "Todo"
      if (!nuevas.includes("Todo")) {
        nuevas.push("Todo");
      }
    } else {
      // Si desmarcó alguna → sacamos "Todo"
      nuevas = nuevas.filter((c) => c !== "Todo");
    }

    setData("categorias", nuevas);
  };

  // 🎨 Colores según tema
  const textColor = darkMode ? "#eaeaea" : "#222";
  const secondaryText = darkMode ? "#bfbfbf" : "#555";
  const bgCard = darkMode ? "#181818" : "#ffffff";
  const bgInput = darkMode ? "#222" : "#fff";
  const borderColor = darkMode ? "#333" : "#ddd";

  const inputBaseStyle = {
    backgroundColor: bgInput,
    color: textColor,
    borderColor,
  };

  return (
    <AppLayout title="Registrar Empresa" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">
        {/* ======= ENCABEZADO ======= */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2
            className="fw-bold mb-0"
            style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
          >
            🏢 Nuevo Recolector
          </h2>
          <Link
            href={route("admin.empresas.index")}
            className={`btn rounded-pill shadow-sm ${
              darkMode
                ? "btn-outline-light text-light border-secondary"
                : "btn-outline-secondary"
            }`}
          >
            <i className="bi bi-arrow-left-circle me-2"></i> Volver al listado
          </Link>
        </div>

        {/* ======= FORMULARIO ======= */}
        <div
          className="card border-0 shadow-lg rounded-4 p-4"
          style={{
            background: bgCard,
            color: textColor,
            transition: "all 0.3s ease",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* NOMBRE */}
              <div className="col-md-6">
                <label className="fw-semibold mb-1">
                  Nombre de la Empresa Recolectora
                </label>
                <input
                  type="text"
                  className="form-control shadow-sm rounded-pill"
                  style={inputBaseStyle}
                  value={data.nombre}
                  onChange={(e) => setData("nombre", e.target.value)}
                />
                {errors?.nombre && (
                  <small className="text-danger">{errors.nombre}</small>
                )}
              </div>

              {/* CONTACTO */}
              <div className="col-md-6">
                <label className="fw-semibold mb-1">Número de contacto</label>
                <input
                  type="text"
                  className="form-control shadow-sm rounded-pill"
                  style={inputBaseStyle}
                  value={data.contacto}
                  onChange={(e) => setData("contacto", e.target.value)}
                />
                {errors?.contacto && (
                  <small className="text-danger">{errors.contacto}</small>
                )}
              </div>

              {/* CORREO */}
              <div className="col-md-6">
                <label className="fw-semibold mb-1">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control shadow-sm rounded-pill"
                  style={inputBaseStyle}
                  value={data.correo}
                  onChange={(e) => setData("correo", e.target.value)}
                />
                {errors?.correo && (
                  <small className="text-danger">{errors.correo}</small>
                )}
              </div>

              {/* CONTRASEÑA */}
              <div className="col-md-6">
                <label className="fw-semibold mb-1">Contraseña</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control shadow-sm rounded-pill"
                    style={inputBaseStyle}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2 rounded-pill d-flex align-items-center"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
                {errors?.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>

              {/* LOGO */}
              <div className="col-md-6">
                <label className="fw-semibold mb-1">Logo de la empresa</label>
                <input
                  type="file"
                  className="form-control shadow-sm rounded-pill"
                  style={inputBaseStyle}
                  onChange={(e) => setData("logo", e.target.files[0])}
                />
                {progress && (
                  <div className="progress mt-2" style={{ height: "8px" }}>
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
            </div>

            {/* ======= CATEGORÍAS ======= */}
            <div className="mt-4">
              <label className="fw-semibold mb-2">Categorías que maneja:</label>
              <div className="row">
                {ALL_CATEGORIES.map((cat) => (
                  <div className="col-md-3 col-6" key={cat}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id={cat}
                        className="form-check-input"
                        checked={data.categorias.includes(cat)}
                        onChange={() => handleCheckbox(cat)}
                      />
                      <label
                        htmlFor={cat}
                        className="form-check-label"
                        style={{ color: secondaryText }}
                      >
                        {cat}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {errors?.categorias && (
                <small className="text-danger d-block mt-1">
                  {errors.categorias}
                </small>
              )}
            </div>

            {/* ======= BOTÓN GUARDAR ======= */}
            <div className="text-end mt-4">
              <button
                type="submit"
                disabled={processing}
                className={`btn btn-success rounded-pill px-4 py-2 fw-semibold shadow-sm ${
                  processing ? "opacity-75 cursor-not-allowed" : ""
                }`}
                style={{
                  background:
                    "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
                  border: "none",
                }}
              >
                {processing ? (
                  <>
                    <i className="bi bi-hourglass-split me-2 animate__animated animate__flash"></i>
                    Registrando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i> Registrar empresa
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
