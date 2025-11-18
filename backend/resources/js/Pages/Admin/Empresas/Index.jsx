import { Link, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
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

export default function EmpresasIndex({ auth, empresas = [] }) {
  const { delete: destroy } = useForm();
  const [darkMode, setDarkMode] = useState(
    document.body.getAttribute("data-theme") === "dark"
  );

  // Detectar cambios globales del modo oscuro (sin romper reactividad)
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDarkMode(document.body.getAttribute("data-theme") === "dark")
    );
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar empresa?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d4a1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(route("admin.empresas.destroy", id), {
          onSuccess: () =>
            Swal.fire(
              "Eliminada",
              "La empresa fue eliminada correctamente.",
              "success"
            ),
          onError: () =>
            Swal.fire("Error", "No se pudo eliminar la empresa.", "error"),
        });
      }
    });
  };

  // 🧩 Normalizar categorías (puede venir como JSON string o array)
  const getCategoriasArray = (categorias) => {
    if (!categorias) return [];

    let arr = [];

    if (Array.isArray(categorias)) {
      arr = categorias;
    } else {
      try {
        const parsed = JSON.parse(categorias);
        arr = Array.isArray(parsed) ? parsed : [];
      } catch {
        // fallback por si viniera separado por comas
        arr = categorias
          .toString()
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
      }
    }

    // 🧠 Regla: si contiene "Todo", para mostrar usamos TODAS menos "Todo"
    if (arr.includes("Todo")) {
      return ALL_CATEGORIES.filter((c) => c !== "Todo");
    }

    return arr;
  };

  // 🎨 Colores según modo
  const textColor = darkMode ? "#eaeaea" : "#222";
  const secondaryText = darkMode ? "#bdbdbd" : "#555";
  const bgCard = darkMode ? "#181818" : "#ffffff";
  const headerBg = darkMode
    ? "linear-gradient(90deg, #0d0d0d 0%, #1e1e1e 100%)"
    : "linear-gradient(90deg, #0066ff 0%, #00d4a1 100%)";
  const tableHeaderBg = darkMode ? "#202020" : "#e9f5ff";
  const tableHeaderColor = darkMode ? "#cfcfcf" : "#003366";

  return (
    <AppLayout title="Módulo de Empresas" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">
        {/* ======= ENCABEZADO ======= */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <div>
            <h2
              className="fw-bold mb-1"
              style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
            >
              🏢 Empresas Registradas
            </h2>
            <p className="mb-0" style={{ color: secondaryText }}>
              Administra las empresas aliadas y sus datos básicos.
              {empresas.length > 0 && (
                <span className="ms-1 fw-semibold">
                  ({empresas.length} registradas)
                </span>
              )}
            </p>
          </div>

          <Link
            href={route("admin.empresas.create")}
            className="btn btn-success rounded-pill shadow-sm fw-semibold d-flex align-items-center gap-2 mt-3 mt-md-0"
            style={{
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              background: "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
            }}
          >
            <i className="bi bi-plus-circle-fill"></i> Registrar Recolector
          </Link>
        </div>

        {/* ======= TABLA ======= */}
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
          style={{
            background: bgCard,
            color: textColor,
            transition: "all 0.3s ease",
          }}
        >
          <div
            className="card-header fw-semibold py-3 d-flex justify-content-between align-items-center"
            style={{
              background: headerBg,
              color: "#fff",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span>
              <i className="bi bi-building me-2"></i> Listado de empresas
            </span>
          </div>

          <div className="table-responsive">
            <table
              className="table align-middle text-center mb-0"
              style={{
                color: textColor,
                borderColor: darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              }}
            >
              <thead
                style={{
                  backgroundColor: tableHeaderBg,
                  color: tableHeaderColor,
                  fontWeight: "600",
                }}
              >
                <tr>
                  <th>Logo</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Contacto</th>
                  <th>Categorías</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empresas.length > 0 ? (
                  empresas.map((e) => {
                    const categorias = getCategoriasArray(e.categorias);

                    return (
                      <tr
                        key={e.id}
                        className={`border-bottom ${
                          darkMode
                            ? "border-secondary-subtle"
                            : "border-light-subtle"
                        }`}
                      >
                        <td>
                          {e.logo ? (
                            <img
                              src={`/storage/${e.logo}`}
                              alt={e.nombre}
                              className="rounded-circle border shadow-sm"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span
                              className="fst-italic small"
                              style={{ color: secondaryText }}
                            >
                              Sin logo
                            </span>
                          )}
                        </td>
                        <td className="fw-semibold">{e.nombre}</td>
                        <td style={{ color: secondaryText }}>{e.correo}</td>
                        <td style={{ color: secondaryText }}>{e.contacto}</td>
                        <td>
                          {categorias.length > 0 ? (
                            <div className="d-flex flex-wrap justify-content-center gap-1">
                              {categorias.map((cat) => (
                                <span
                                  key={cat}
                                  className="badge rounded-pill px-3 py-1"
                                  style={{
                                    backgroundColor: darkMode
                                      ? "rgba(0, 212, 161, 0.12)"
                                      : "rgba(0, 102, 255, 0.08)",
                                    color: darkMode ? "#4dd2a1" : "#0056b3",
                                    border: darkMode
                                      ? "1px solid rgba(0, 212, 161, 0.5)"
                                      : "1px solid rgba(0, 102, 255, 0.35)",
                                  }}
                                >
                                  {cat}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span
                              className="fst-italic small"
                              style={{ color: secondaryText }}
                            >
                              Sin categorías
                            </span>
                          )}
                        </td>
                        <td>
                          {e.activo ? (
                            <span className="badge bg-success bg-opacity-75 px-3 py-2">
                              Activa
                            </span>
                          ) : (
                            <span className="badge bg-danger bg-opacity-75 px-3 py-2">
                              Inactiva
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Link
                              href={route("admin.empresas.edit", e.id)}
                              className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 shadow-sm ${
                                darkMode
                                  ? "btn-outline-info text-info"
                                  : "btn-outline-primary"
                              }`}
                            >
                              <i className="bi bi-pencil-square"></i> Editar
                            </Link>
                            <button
                              onClick={() => handleDelete(e.id)}
                              className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 shadow-sm ${
                                darkMode
                                  ? "btn-outline-danger text-danger"
                                  : "btn-outline-danger"
                              }`}
                            >
                              <i className="bi bi-trash3-fill"></i> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-5 text-center fst-italic"
                      style={{ color: secondaryText }}
                    >
                      No hay empresas registradas aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
