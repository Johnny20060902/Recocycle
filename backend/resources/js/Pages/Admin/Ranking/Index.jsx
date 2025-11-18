/* global route */

import { router, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "animate.css";

export default function RankingIndex({
  auth,
  items = null, // paginator { data, links, from, total, ... }
  tipo = "recolectores",
  filters = { q: "", per_page: 20 },
  usuarios = [], // fallback plano
}) {
  // Normalizamos la fuente de datos
  const rows = useMemo(() => {
    if (items?.data) return items.data;
    return Array.isArray(usuarios) ? usuarios : [];
  }, [items, usuarios]);

  const [q, setQ] = useState(filters?.q || "");
  const [perPage, setPerPage] = useState(filters?.per_page || 20);
  const [tab, setTab] = useState(tipo || "recolectores");

  // 🔘 selección para acciones masivas
  const [bulkScope, setBulkScope] = useState("top10");

  // Dark mode watcher
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

  // Colores dinámicos
  const textColor = darkMode ? "#eaeaea" : "#222";
  const secondaryText = darkMode ? "#bfbfbf" : "#555";
  const bgCard = darkMode ? "#181818" : "#ffffff";
  const tableHeaderBg = darkMode ? "#202020" : "#e9f5ff";
  const tableHeaderColor = darkMode ? "#e0e0e0" : "#003366";
  const cardHeaderBg = darkMode
    ? "linear-gradient(90deg, #0d0d0d 0%, #1e1e1e 100%)"
    : "linear-gradient(90deg, #0066ff 0%, #00d4a1 100%)";

  const getMedalla = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "⭐";
  };

  const getRowStyle = (index) => {
    // Resaltar TOP 3 sutilmente
    if (index === 0) {
      return {
        background:
          darkMode ? "rgba(255,215,0,0.05)" : "rgba(255,215,0,0.08)",
      };
    }
    if (index === 1 || index === 2) {
      return {
        background: darkMode
          ? "rgba(255,255,255,0.02)"
          : "rgba(0,0,0,0.01)",
      };
    }
    return {};
  };

  // Navegación con filtros
  const go = (params = {}) => {
    router.get(
      route("admin.ranking.index"),
      {
        tipo: tab,
        q,
        per_page: perPage,
        ...params,
      },
      { preserveScroll: true, preserveState: true }
    );
  };

  const changeTab = (next) => {
    setTab(next);
    go({ tipo: next });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    go();
  };

  const onPerPage = (n) => {
    setPerPage(n);
    go({ per_page: n });
  };

  // Etiqueta para alcance masivo
  const getBulkScopeLabel = () => {
    switch (bulkScope) {
      case "top10":
        return "Top 10";
      case "top20":
        return "Top 20";
      case "top50":
        return "Top 50";
      case "all":
      default:
        return "todos los que ves en la tabla";
    }
  };

  // 🧮 Ajuste INDIVIDUAL
  const ajustarPuntajeManual = (usuario) => {
    Swal.fire({
      title: `Ajustar puntaje`,
      html: `<span class="fw-semibold">${usuario.nombres} ${usuario.apellidos}</span>`,
      input: "number",
      inputLabel: "Nuevo puntaje (0 o más)",
      inputAttributes: { min: 0, step: 1 },
      inputValue: usuario.puntaje ?? 0,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#00c896",
      cancelButtonColor: "#d33",
      preConfirm: (value) => {
        const num = Number(value);
        if (Number.isNaN(num) || num < 0) {
          Swal.showValidationMessage("Ingresá un número válido (>= 0).");
        }
        return num;
      },
    }).then((result) => {
      if (!result.isConfirmed) return;

      const nuevoValor = result.value ?? 0;

      router.post(
        route("admin.ranking.puntaje", usuario.id),
        { tipo: "set", valor: nuevoValor },
        {
          preserveScroll: true,
          preserveState: true,
          onSuccess: () => {
            Swal.fire(
              "✅ Listo",
              "Puntaje actualizado manualmente.",
              "success"
            );
          },
          onError: () => {
            Swal.fire(
              "❌ Error",
              "No se pudo actualizar el puntaje.",
              "error"
            );
          },
        }
      );
    });
  };

  // 🔢 Obtener IDs según alcance (Top 10 / 20 / 50 / Todos)
  const getBulkIds = () => {
    if (!rows.length) return [];

    let subset = [];
    switch (bulkScope) {
      case "top10":
        subset = rows.slice(0, 10);
        break;
      case "top20":
        subset = rows.slice(0, 20);
        break;
      case "top50":
        subset = rows.slice(0, 50);
        break;
      case "all":
      default:
        subset = rows;
        break;
    }

    return subset.map((u) => u.id);
  };

  // ⚙️ Ajuste MASIVO: -10%, -50%, reset (usa % o reset)
  const aplicarAccionMasiva = (tipoAccion, valor = null) => {
    const ids = getBulkIds();

    if (!ids.length) {
      Swal.fire(
        "Sin registros",
        "No hay usuarios en este listado para aplicar la acción.",
        "info"
      );
      return;
    }

    let textoAccion = "";
    if (tipoAccion === "percent" && valor === 10) {
      textoAccion = "Reducir el puntaje en un 10%";
    } else if (tipoAccion === "percent" && valor === 50) {
      textoAccion = "Reducir el puntaje en un 50%";
    } else if (tipoAccion === "percent" && valor !== null) {
      textoAccion = `Reducir el puntaje en un ${valor}%`;
    } else if (tipoAccion === "reset") {
      textoAccion = "Resetear el puntaje a 0";
    }

    const etiquetaScope = getBulkScopeLabel();

    Swal.fire({
      title: "¿Confirmar acción masiva?",
      text: `${textoAccion} para ${etiquetaScope}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c896",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aplicar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (!result.isConfirmed) return;

      router.post(
        route("admin.ranking.puntajeMasivo"),
        {
          ids,
          tipo: tipoAccion,
          valor,
        },
        {
          preserveScroll: true,
          preserveState: true,
          onSuccess: () => {
            Swal.fire("✅ Listo", "Puntajes actualizados.", "success");
          },
          onError: () => {
            Swal.fire(
              "❌ Error",
              "No se pudo aplicar la acción masiva.",
              "error"
            );
          },
        }
      );
    });
  };

  // 🎚️ NUEVA OPCIÓN: Reducción PERSONALIZADA con "regla" 0–100
  const abrirAccionPersonalizada = () => {
    const ids = getBulkIds();
    if (!ids.length) {
      Swal.fire(
        "Sin registros",
        "No hay usuarios en este listado para aplicar la acción.",
        "info"
      );
      return;
    }

    const etiquetaScope = getBulkScopeLabel();

    Swal.fire({
      title: "Reducción personalizada",
      html: `
        <div style="text-align:left">
          <p class="mb-2">
            Elegí cuánto porcentaje querés reducir para <strong>${etiquetaScope}</strong>.
          </p>
          <input 
            id="sliderPorcentaje" 
            type="range" 
            min="1" 
            max="100" 
            value="10" 
            class="form-range"
          />
          <div class="mt-2 text-center fw-semibold">
            <span id="valorPorcentaje">10</span>% de reducción
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#00c896",
      cancelButtonColor: "#d33",
      didOpen: () => {
        const container = Swal.getHtmlContainer();
        const slider = container?.querySelector("#sliderPorcentaje");
        const label = container?.querySelector("#valorPorcentaje");

        if (slider && label) {
          slider.addEventListener("input", () => {
            label.textContent = slider.value;
          });
        }
      },
      preConfirm: () => {
        const container = Swal.getHtmlContainer();
        const slider = container?.querySelector("#sliderPorcentaje");
        const value = Number(slider?.value || 0);

        if (!value || value < 1 || value > 100) {
          Swal.showValidationMessage(
            "Elegí un valor entre 1% y 100%."
          );
          return false;
        }
        return value;
      },
    }).then((result) => {
      if (!result.isConfirmed) return;
      const porcentaje = result.value;
      // Reutilizamos la misma lógica de acción masiva con confirmación final
      aplicarAccionMasiva("percent", porcentaje);
    });
  };

  return (
    <AppLayout
      title={`Ranking de ${tab === "usuarios" ? "Usuarios" : "Recolectores"}`}
      auth={auth}
    >
      <div className="container py-4 animate__animated animate__fadeIn">
        {/* ======= ENCABEZADO ======= */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2
              className="fw-bold mb-1"
              style={{ color: darkMode ? "#4dd2a1" : "#198754" }}
            >
              🏆 Ranking de {tab === "usuarios" ? "Usuarios" : "Recolectores"}
            </h2>
            <p
              className="mb-0 small"
              style={{ color: secondaryText, maxWidth: 520 }}
            >
              Visualizá el rendimiento y la reputación de tu comunidad. Los
              primeros puestos se destacan automáticamente.
            </p>
          </div>

          <Link
            href={route("admin.dashboard")}
            className={`btn rounded-pill fw-semibold d-flex align-items-center gap-2 shadow-sm ms-auto ${
              darkMode
                ? "btn-outline-light text-light border-secondary"
                : "btn-outline-primary"
            }`}
          >
            <i className="bi bi-arrow-left-circle"></i> Volver al panel
          </Link>
        </div>

        {/* ======= TABS ======= */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <div className="btn-group">
            <button
              type="button"
              className={`btn btn-sm ${
                tab === "recolectores" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => changeTab("recolectores")}
            >
              Recolectores
            </button>
            <button
              type="button"
              className={`btn btn-sm ${
                tab === "usuarios" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => changeTab("usuarios")}
            >
              Usuarios
            </button>
          </div>

          <span
            className="small ms-1"
            style={{ color: secondaryText }}
          >{`· ${items?.total || rows.length} registro(s)`}</span>
        </div>

        {/* ======= FILTROS ======= */}
        <form className="row g-2 align-items-end mb-3" onSubmit={onSubmit}>
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold mb-1">
              Buscar por nombre o apellido
            </label>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ej: María / Pérez"
              className="form-control"
            />
          </div>
          <div className="col-6 col-md-3">
            <label className="form-label fw-semibold mb-1">
              Ítems por página
            </label>
            <select
              className="form-select"
              value={perPage}
              onChange={(e) => onPerPage(parseInt(e.target.value, 10))}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <button className="btn btn-success w-100">
              <i className="bi bi-filter-circle me-1"></i>
              Aplicar filtros
            </button>
          </div>
        </form>

        {/* ======= CARD + ACCIONES MASIVAS ======= */}
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
          style={{
            background: bgCard,
            color: textColor,
            transition: "all 0.3s ease",
          }}
        >
          {/* HEADER */}
          <div
            className="card-header fw-semibold py-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2"
            style={{
              background: cardHeaderBg,
              color: "#fff",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-trophy-fill fs-5"></i>
              <span>
                Ranking de {tab === "usuarios" ? "Usuarios" : "Recolectores"}
              </span>
            </div>
            <small className="opacity-75">
              Gestioná puntajes de forma individual o masiva.
            </small>
          </div>

          {/* TOOLBAR MASIVO */}
          <div className="px-3 py-2 border-bottom d-flex flex-column flex-md-row gap-2 align-items-start align-items-md-center justify-content-between">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span
                className="fw-semibold small"
                style={{ color: secondaryText }}
              >
                Alcance de la acción:
              </span>
              <select
                className="form-select form-select-sm w-auto"
                value={bulkScope}
                onChange={(e) => setBulkScope(e.target.value)}
              >
                <option value="top10">Top 10</option>
                <option value="top20">Top 20</option>
                <option value="top50">Top 50</option>
                <option value="all">Todos (página actual)</option>
              </select>
            </div>

            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-sm ${
                  darkMode ? "btn-outline-light" : "btn-outline-secondary"
                } dropdown-toggle`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                ⚙️ Acción masiva
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => aplicarAccionMasiva("percent", 10)}
                  >
                    🔻 Reducir puntaje un 10%
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => aplicarAccionMasiva("percent", 50)}
                  >
                    🔻 Reducir puntaje un 50%
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item text-danger"
                    onClick={() => aplicarAccionMasiva("reset")}
                  >
                    🧹 Resetear a 0
                  </button>
                </li>
                {/* 🚀 NUEVA OPCIÓN PERSONALIZADA */}
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={abrirAccionPersonalizada}
                  >
                    🎚️ PERSONALIZA (0–100%)
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* TABLA */}
          <div className="table-responsive">
            <table
              className="table table-hover align-middle mb-0 text-center"
              style={{
                color: textColor,
                borderColor: darkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
              }}
            >
              <thead
                style={{
                  backgroundColor: tableHeaderBg,
                  color: tableHeaderColor,
                  fontWeight: 600,
                }}
              >
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th>Medalla</th>
                  <th>Nombre</th>
                  <th className="d-none d-md-table-cell">Correo</th>
                  <th>♻️ Puntaje</th>
                  <th>⭐ Promedio</th>
                  <th style={{ minWidth: 140 }}>Acción</th>
                </tr>
              </thead>

              <tbody>
                {rows.length > 0 ? (
                  rows.map((u, i) => (
                    <tr
                      key={u.id}
                      className={`border-bottom ${
                        darkMode
                          ? "border-secondary-subtle"
                          : "border-light-subtle"
                      }`}
                      style={getRowStyle(i)}
                    >
                      <td className="fw-bold">
                        {(items?.from || 1) + i}
                      </td>
                      <td
                        style={{
                          fontSize: "1.5rem",
                          filter:
                            i === 0
                              ? "drop-shadow(0 0 4px gold)"
                              : "drop-shadow(0 0 3px rgba(0,0,0,0.2))",
                        }}
                      >
                        {getMedalla(i)}
                      </td>
                      <td className="fw-semibold text-start">
                        <div>
                          {u.nombres} {u.apellidos}
                        </div>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {u.role && (
                            <span
                              className={`badge rounded-pill ${
                                darkMode
                                  ? "bg-secondary text-light"
                                  : "bg-light text-muted border"
                              }`}
                              style={{ fontSize: "0.7rem" }}
                            >
                              {u.role}
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className="d-none d-md-table-cell"
                        style={{ color: secondaryText }}
                      >
                        {u.email || "—"}
                      </td>
                      <td
                        className="fw-bold"
                        style={{ color: darkMode ? "#4dd2a1" : "#198754" }}
                      >
                        {u.puntaje ?? 0}
                      </td>
                      <td>
                        <span
                          className="badge bg-warning text-dark shadow-sm mb-1"
                          style={{
                            fontSize: "0.9rem",
                            padding: "0.35em 0.7em",
                            borderRadius: "10px",
                          }}
                        >
                          ⭐ {parseFloat(u.rating_promedio || 0).toFixed(2)}
                        </span>
                        <div className="progress" style={{ height: 6 }}>
                          <div
                            className="progress-bar bg-warning"
                            role="progressbar"
                            style={{
                              width: `${Math.round(
                                ((u.rating_promedio || 0) / 5) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-info d-flex align-items-center gap-1 mx-auto"
                          onClick={() => ajustarPuntajeManual(u)}
                        >
                          ✏️ Ajustar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-4 fst-italic"
                      style={{ color: secondaryText }}
                    >
                      No hay registros aún. Cuando haya actividad, los
                      recolectores y usuarios aparecerán aquí ordenados por su
                      puntaje.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======= PAGINACIÓN ======= */}
        {items?.links?.length ? (
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mt-3">
            <div className="text-muted small">
              {items?.from}–{items?.to} de {items?.total || 0} resultado(s)
            </div>
            <div className="btn-group flex-wrap">
              {items.links.map((l, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${
                    l.active ? "btn-success" : "btn-outline-success"
                  }`}
                  disabled={!l.url}
                  onClick={() =>
                    l.url &&
                    router.visit(l.url, {
                      preserveScroll: true,
                      preserveState: true,
                    })
                  }
                  dangerouslySetInnerHTML={{ __html: l.label }}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* ====== ESTILOS DARK MODE ====== */}
        <style>{`
          body[data-theme="dark"] .table { color: #e6e6e6; }
          body[data-theme="dark"] .table-light { background: #1b1b1b; color: #b5b5b5; }
          body[data-theme="dark"] .progress { background: #333; }
        `}</style>
      </div>
    </AppLayout>
  );
}
