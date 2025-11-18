/* global route */

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import Swal from "sweetalert2";
import RecolectorLayout from "@/Layouts/RecolectorLayout";
import "leaflet/dist/leaflet.css";
import "animate.css";

// ===== ÍCONOS PERSONALIZADOS =====
const iconRecolector = new L.Icon({
  iconUrl: "/images/recolector-icon.png",
  iconSize: [38, 38],
});

const iconPunto = new L.Icon({
  iconUrl: "/images/punto-reciclaje.png",
  iconSize: [32, 32],
});

const iconCompletado = new L.Icon({
  iconUrl: "/images/punto-completado.png",
  iconSize: [32, 32],
});

const iconEnCamino = new L.Icon({
  iconUrl: "/images/punto-en-camino.png",
  iconSize: [32, 32],
});

// ===== Hook para centrar mapa =====
function SetViewToCurrent({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) map.setView([coords.lat, coords.lng], 13);
  }, [coords, map]);

  return null;
}

/**
 * 📸 Carrusel simple de fotos en el popup
 */
function FotoCarousel({ fotos = [] }) {
  const [index, setIndex] = useState(0);

  if (!Array.isArray(fotos) || fotos.length === 0) {
    return (
      <p className="text-muted small mb-2">
        📷 Sin fotos cargadas para este punto.
      </p>
    );
  }

  const normalizarSrc = (foto) => {
    let src =
      typeof foto === "string"
        ? foto
        : foto?.url || foto?.path || foto?.ruta || "";

    if (!src) return null;

    // Si no viene con http ni empieza con /storage, asumimos que es un archivo en storage
    if (!src.startsWith("http")) {
      if (src.startsWith("/")) {
        // ya viene con slash, lo dejamos
        return src;
      }
      // ruta típica de Laravel: storage/archivo.jpg
      return `/storage/${src}`;
    }

    return src;
  };

  const current = normalizarSrc(fotos[index]);
  if (!current) {
    return (
      <p className="text-muted small mb-2">
        📷 No se pudo cargar la imagen.
      </p>
    );
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex((prev) => (prev + 1) % fotos.length);
  };

  return (
    <div className="mt-2">
      <div
        className="position-relative rounded"
        style={{
          overflow: "hidden",
          maxHeight: 180,
          border: "1px solid #e5e5e5",
        }}
      >
        <img
          src={current}
          alt={`Foto ${index + 1}`}
          className="w-100"
          style={{ objectFit: "cover", maxHeight: 180 }}
        />

        {fotos.length > 1 && (
          <>
            <button
              className="btn btn-sm btn-light position-absolute top-50 start-0 translate-middle-y"
              onClick={handlePrev}
              style={{ opacity: 0.85 }}
            >
              ‹
            </button>
            <button
              className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y"
              onClick={handleNext}
              style={{ opacity: 0.85 }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {fotos.length > 1 && (
        <p className="text-center text-muted small mt-1 mb-0">
          {index + 1} / {fotos.length}
        </p>
      )}
    </div>
  );
}

/**
 * 🧭 BOTONES DE ACCIÓN POR ESTADO
 */
function AccionesRecolector({ punto, onActualizar }) {
  const postAccion = async (ruta, mensajeExito) => {
    try {
      await axios.post(route(ruta, punto.id));
      Swal.fire({
        icon: "success",
        title: mensajeExito,
        timer: 1400,
        showConfirmButton: false,
      });
      onActualizar();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Ocurrió un error inesperado.",
      });
    }
  };

  // ✅ Mostrar botón si el punto está pendiente y sin recolector
  const puedeEnviarSolicitud =
    punto.estado === "pendiente" &&
    (punto.recolector_id === null || punto.recolector_id === undefined);

  const solicitarRecoleccion = async () => {
    try {
      if (
        !Array.isArray(punto.reciclaje?.registros) ||
        punto.reciclaje.registros.length === 0
      ) {
        Swal.fire(
          "Sin horarios",
          "El usuario no definió horarios disponibles.",
          "info"
        );
        return;
      }

      const opciones = punto.reciclaje.registros.map((r, idx) => ({
        id: idx,
        texto: `${r.fecha} — ${r.hora_desde} a ${r.hora_hasta}`,
        ...r,
      }));

      const { value: seleccion } = await Swal.fire({
        title: "Seleccioná un horario disponible",
        input: "select",
        inputOptions: opciones.reduce((acc, op) => {
          acc[op.id] = op.texto;
          return acc;
        }, {}),
        inputPlaceholder: "Elegí fecha y hora",
        showCancelButton: true,
        confirmButtonText: "Enviar solicitud",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#198754",
      });

      if (seleccion === undefined) return;

      const elegido = opciones.find((o) => o.id === parseInt(seleccion, 10));

      Swal.fire({
        title: "Enviando solicitud...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.post(route("recolector.puntos.solicitar", punto.id), {
        fecha: elegido.fecha,
        hora_desde: elegido.hora_desde,
        hora_hasta: elegido.hora_hasta,
      });

      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Solicitud enviada ✅",
        text: "Esperá la confirmación del usuario.",
        timer: 1600,
        showConfirmButton: false,
      });

      onActualizar();
    } catch (error) {
      console.error(error);
      Swal.close();
      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          "Ocurrió un error al enviar la solicitud.",
        "error"
      );
    }
  };

  return (
    <div className="mt-2">
      {puedeEnviarSolicitud && (
        <button
          className="btn btn-sm btn-success w-100 mb-1"
          onClick={solicitarRecoleccion}
        >
          📅 Enviar solicitud
        </button>
      )}

      {punto.estado === "asignado" && (
        <button
          className="btn btn-sm btn-primary w-100 mb-1"
          onClick={() =>
            postAccion("recolector.puntos.enCamino", "🚗 Marcado en camino")
          }
        >
          🚗 Marcar en camino
        </button>
      )}

      {punto.estado === "en_camino" && (
        <button
          className="btn btn-sm btn-success w-100"
          onClick={() =>
            postAccion(
              "recolector.puntos.completar",
              "✅ Recolección completada"
            )
          }
        >
          ✅ Completar recolección
        </button>
      )}

      {punto.estado === "completado" && (
        <p className="text-muted small text-center mt-2 mb-0">
          📸 Recolección completada
        </p>
      )}
    </div>
  );
}

/**
 * 🌍 COMPONENTE PRINCIPAL
 */
export default function MapaRecolector({
  auth,
  categorias = [],
  puntos: initialPuntos = [],
}) {
  const [puntos, setPuntos] = useState(initialPuntos);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      Swal.fire(
        "⚠️ Error",
        "Tu navegador no soporta geolocalización.",
        "error"
      );
      return;
    }

    Swal.fire({
      title: "Obteniendo ubicación...",
      text: "Por favor, permite el acceso a tu ubicación.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Ubicación actualizada ✅",
          timer: 1300,
          showConfirmButton: false,
        });
      },
      (err) => {
        Swal.close();
        console.error(err);
        setLoading(false);
        Swal.fire(
          "Error",
          "No se pudo obtener tu ubicación. Revisá permisos del navegador.",
          "error"
        );
      }
    );
  };

  const fetchPuntos = async () => {
    try {
      const { data } = await axios.get(route("recolector.puntos"));
      setPuntos(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando puntos:", error);
      setLoading(false);
    }
  };

  const limpiarPendientes = async () => {
    try {
      await axios.post(route("recolector.puntos.limpiarPendientes"));
    } catch (error) {
      console.warn("No se pudieron limpiar pendientes:", error);
    }
  };

  // 🔁 Auto-actualizar puntos cada 5 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPuntos();
    }, 5000); // 5000 ms = 5 segundos

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const inicializar = async () => {
      // Si ya vinieron puntos desde Inertia, no mostrés loader vacío
      if (initialPuntos && initialPuntos.length > 0) {
        setLoading(false);
      }
      await limpiarPendientes();
      await fetchPuntos();
    };
    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const iconoPorEstado = (estado) => {
    switch (estado) {
      case "completado":
        return iconCompletado;
      case "en_camino":
        return iconEnCamino;
      default:
        return iconPunto;
    }
  };

  // 🔍 Filtrado de puntos según categoría seleccionada
  const puntosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return puntos;
    return puntos.filter(
      (p) => p.reciclaje?.categoria_id === Number(categoriaSeleccionada)
    );
  }, [categoriaSeleccionada, puntos]);

  return (
    <RecolectorLayout title="Mapa de Recolección" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">
        {/* ENCABEZADO BONITO */}
        <div className="mb-4">
          <div className="card border-0 shadow-sm bg-gradient">
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div className="text-start">
                <h2 className="fw-bold text-success mb-1">
                  ♻️ Mapa de puntos de recolección
                </h2>
                <p className="text-muted mb-0">
                  Seleccioná una categoría, revisá las fotos del material y
                  enviá tu solicitud al usuario. 🌍
                </p>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-2">
                <button
                  onClick={obtenerUbicacion}
                  className="btn btn-success shadow-sm"
                >
                  📍 Usar mi ubicación
                </button>
                <button
                  onClick={fetchPuntos}
                  className="btn btn-outline-success shadow-sm"
                >
                  🔄 Actualizar puntos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LEYENDA DE ÍCONOS */}
        <div className="row mb-3 g-2">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-2">
                <div className="d-flex flex-wrap gap-3 align-items-center small">
                  <span className="fw-semibold text-success me-2">
                    🧭 Leyenda:
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <img
                      src="/images/punto-reciclaje.png"
                      alt="pendiente"
                      width={18}
                      height={18}
                    />
                    Pendiente
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <img
                      src="/images/punto-en-camino.png"
                      alt="en camino"
                      width={18}
                      height={18}
                    />
                    En camino
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <img
                      src="/images/punto-completado.png"
                      alt="completado"
                      width={18}
                      height={18}
                    />
                    Completado
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🔽 Filtro por categoría */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-2">
                <label className="form-label fw-semibold text-success mb-1">
                  Filtrar por categoría
                </label>
                <select
                  className="form-select border-success shadow-sm"
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* MAPA */}
        {loading ? (
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ height: "70vh" }}
          >
            <div
              className="spinner-border text-success mb-3"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            ></div>
            <p className="text-muted">Cargando mapa...</p>
          </div>
        ) : (
          <div
            id="map"
            className="shadow-sm"
            style={{
              height: "75vh",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #e5e5e5",
            }}
          >
            <MapContainer
              center={coords || [-17.3895, -66.1568]}
              zoom={13}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* 📍 Posición del recolector */}
              {coords && (
                <Marker position={[coords.lat, coords.lng]} icon={iconRecolector}>
                  <Popup>📍 Tu ubicación actual</Popup>
                </Marker>
              )}

              {/* ♻️ Puntos filtrados */}
              {puntosFiltrados.map((p, i) => (
                <Marker
                  key={p.id ?? i}
                  position={[p.latitud, p.longitud]}
                  icon={iconoPorEstado(p.estado)}
                >
                  <Popup>
                    <div className="text-start" style={{ maxWidth: 260 }}>
                      <h6 className="fw-bold text-success mb-1">
                        {p.usuario?.nombres || "Usuario"}
                      </h6>
                      <p className="mb-1 small">
                        <strong>Material:</strong> {p.material} <br />
                        <strong>Fecha:</strong> {p.fecha_disponible} <br />
                        <strong>Horario:</strong> {p.hora_desde} - {p.hora_hasta}{" "}
                        <br />
                        <strong>Estado:</strong>{" "}
                        <span className="badge bg-secondary">{p.estado}</span>
                      </p>

                      {p.descripcion && (
                        <p className="text-muted small mb-1">
                          “{p.descripcion}”
                        </p>
                      )}

                      {p.reciclaje?.categoria_id && (
                        <span className="badge bg-success mb-1">
                          🏷️ Categoría #{p.reciclaje.categoria_id}
                        </span>
                      )}

                      {/* 📸 Carrusel de fotos */}
                      <FotoCarousel fotos={p.fotos || p.reciclaje?.fotos || []} />

                      <AccionesRecolector punto={p} onActualizar={fetchPuntos} />
                    </div>
                  </Popup>
                </Marker>
              ))}

              <SetViewToCurrent coords={coords} />
            </MapContainer>
          </div>
        )}
      </div>
    </RecolectorLayout>
  );
}
