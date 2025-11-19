import { useForm, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

export default function Create({ auth }) {
  const { data, setData, post, processing, reset, errors } = useForm({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    estado: "activo",
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
    Swal.fire({
      title: "¿Registrar recolector?",
      text: "Se añadirá al sistema con rol 'recolector'.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#00c896",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, registrar",
    }).then((res) => {
      if (res.isConfirmed) {
        post(route("admin.recolectores.store"), {
          onSuccess: () => {
            Swal.fire("✅ Éxito", "Recolector registrado correctamente.", "success");
            reset();
          },
          onError: () =>
            Swal.fire("❌ Error", "No se pudo registrar el recolector.", "error"),
        });
      }
    });
  };

  return (
    <AppLayout title="Registrar Recolector" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <div>
            <h2
              className="fw-bold mb-1"
              style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
            >
              🚛 Registrar Recolector
            </h2>
            <p className="mb-0 text-muted">
              Completa el formulario para registrar un nuevo recolector.
            </p>
          </div>

          <Link
            href={route("admin.recolectores.index")}
            className="btn btn-outline-secondary rounded-pill shadow-sm fw-semibold d-flex align-items-center gap-2 mt-3 mt-md-0"
          >
            <i className="bi bi-arrow-left-circle"></i> Volver al listado
          </Link>
        </div>

        <div
          className="card border-0 shadow-lg rounded-4 p-4"
          style={{
            background: darkMode ? "#181818" : "#ffffff",
            color: darkMode ? "#eaeaea" : "#222",
          }}
        >
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Nombres</label>
              <input
                type="text"
                className={`form-control ${errors.nombres ? "is-invalid" : ""}`}
                value={data.nombres}
                onChange={(e) => setData("nombres", e.target.value)}
              />
              {errors.nombres && <div className="invalid-feedback">{errors.nombres}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Apellidos</label>
              <input
                type="text"
                className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
                value={data.apellidos}
                onChange={(e) => setData("apellidos", e.target.value)}
              />
              {errors.apellidos && <div className="invalid-feedback">{errors.apellidos}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Correo electrónico</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Estado</label>
              <select
                className={`form-select ${errors.estado ? "is-invalid" : ""}`}
                value={data.estado}
                onChange={(e) => setData("estado", e.target.value)}
              >
                <option value="activo">Activo ✅</option>
                <option value="inactivo">Inactivo ❌</option>
                <option value="pendiente">Pendiente ⏳</option>
              </select>
              {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button
                type="submit"
                disabled={processing}
                className="btn btn-success rounded-pill shadow-sm fw-semibold d-flex align-items-center gap-2"
                style={{
                  background: "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
                }}
              >
                <i className="bi bi-save2"></i> Registrar recolector
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
