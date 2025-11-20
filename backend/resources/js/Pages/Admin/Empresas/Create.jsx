/* global route */

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
    password_confirmation: "", // 🔐 Nuevo (ISO obligatorio)
    logo: null,
    categorias: [],
  });

  const [darkMode, setDarkMode] = useState(
    document.body.getAttribute("data-theme") === "dark"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDarkMode(document.body.getAttribute("data-theme") === "dark")
    );
    obs.observe(document.body, { attributes: true });
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("admin.empresas.store"), {
      forceFormData: true,
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Registrada",
          text: "La empresa se registró correctamente.",
          confirmButtonColor: "#00d4a1",
        });
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hay errores en el formulario. Revísalos por favor.",
          confirmButtonColor: "#d33",
        });
      },
    });
  };

  const handleCheckbox = (cat) => {
    if (cat === "Todo") {
      setData(
        "categorias",
        data.categorias.includes("Todo") ? [] : ALL_CATEGORIES
      );
      return;
    }

    let nuevas = data.categorias.includes(cat)
      ? data.categorias.filter((c) => c !== cat)
      : [...data.categorias, cat];

    const sinTodo = ALL_CATEGORIES.filter((c) => c !== "Todo");
    const tieneTodas = sinTodo.every((c) => nuevas.includes(c));

    nuevas = tieneTodas
      ? [...sinTodo, "Todo"]
      : nuevas.filter((c) => c !== "Todo");

    setData("categorias", nuevas);
  };

  const textColor = darkMode ? "#eaeaea" : "#222";
  const secondaryText = darkMode ? "#bfbfbf" : "#666";
  const bgCard = darkMode ? "#181818" : "#ffffff";
  const bgInput = darkMode ? "#222" : "#fff";
  const borderColor = darkMode ? "#333" : "#ddd";

  const inputBaseStyle = {
    backgroundColor: bgInput,
    borderColor,
    color: textColor,
  };

  return (
    <AppLayout title="Registrar Empresa" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2
            className="fw-bold mb-0"
            style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
          >
            🏢 Nuevo Recolector
          </h2>

          <Link
            href={route("admin.empresas.index")}
            className={`btn rounded-pill shadow-sm px-3 ${
              darkMode
                ? "btn-outline-light border-secondary text-light"
                : "btn-outline-secondary"
            }`}
          >
            <i className="bi bi-arrow-left-circle me-2"></i> Volver
          </Link>
        </div>

        {/* FORMULARIO */}
        <div
          className="card border-0 shadow-lg rounded-4 p-4"
          style={{
            background: bgCard,
            color: textColor,
            transition: "all .3s ease",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* NOMBRE */}
              <div className="col-md-6">
                <label className="fw-semibold mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  className="form-control shadow-sm rounded-pill"
                  style={inputBaseStyle}
                  value={data.nombre}
                  onChange={(e) => setData("nombre", e.target.value)}
                />
                {errors.nombre && (
                  <small className="text-danger">{errors.nombre}</small>
                )}
              </div>

              {/* CONTACTO */}
              <div className="col-md-6">
                <label className="fw-semibold mb-1">Contacto telefónico</label>
                <input
                  type="text"
                  className="form-control shadow-sm rounded-pill"
                  style={inputBaseStyle}
                  value={data.contacto}
                  onChange={(e) => setData("contacto", e.target.value)}
                />
                {errors.contacto && (
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
                {errors.correo && (
                  <small className="text-danger">{errors.correo}</small>
                )}
              </div>

              {/* CONTRASEÑA */}
              <div className="col-md-6">
                <label className="fw-semibold mb-1">Contraseña (ISO)</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control shadow-sm rounded-pill"
                    style={inputBaseStyle}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="Mínimo 8 caracteres, fuerte"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2 rounded-pill"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>

              {/* CONFIRMAR CONTRASEÑA */}
              <div className="col-md-6">
                <label className="fw-semibold mb-1">Confirmar contraseña</label>
                <div className="input-group">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    className="form-control shadow-sm rounded-pill"
                    style={inputBaseStyle}
                    value={data.password_confirmation}
                    onChange={(e) =>
                      setData("password_confirmation", e.target.value)
                    }
                    placeholder="Repite la contraseña"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2 rounded-pill"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  >
                    <i
                      className={`bi ${
                        showPasswordConfirm ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
                {errors.password_confirmation && (
                  <small className="text-danger">
                    {errors.password_confirmation}
                  </small>
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
                        background: darkMode ? "#00c896" : "#0d6efd",
                      }}
                    >
                      {progress.percentage}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CATEGORÍAS */}
            <div className="mt-4">
              <label className="fw-semibold mb-2">Categorías:</label>

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

              {errors.categorias && (
                <small className="text-danger d-block mt-1">
                  {errors.categorias}
                </small>
              )}
            </div>

            {/* BOTÓN GUARDAR */}
            <div className="text-end mt-4">
              <button
                type="submit"
                disabled={processing}
                className={`btn rounded-pill px-4 py-2 fw-semibold shadow-sm ${
                  processing ? "opacity-75" : ""
                }`}
                style={{
                  background: "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
                  border: "none",
                  color: "#fff",
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
