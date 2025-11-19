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

    if (!src.startsWith("http")) {
      if (src.startsWith("/")) return src;
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
              onClick={(e) => {
                e.stopPropagation();
                setIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
              }}
              style={{ opacity: 0.85 }}
            >
              ‹
            </button>
            <button
              className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y"
              onClick={(e) => {
                e.stopPropagation();
                setIndex((prev) => (prev + 1) % fotos.length);
              }}
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

  const puedeEnviarSolicitud =
    punto.estado === "pendiente" &&
    (!punto.recolector_id || punto.solicitud_estado === null);

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

      const elegido = opciones.find((o) => o.id === parseInt(seleccion));

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
        title: "Solicitud enviada",
        text: "Esperá la confirmación del usuario.",
        timer: 1600,
        showConfirmButton: false,
      });

      onActualizar();
    } catch (error) {
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
    <div className="mt-3">
      {puedeEnviarSolicitud && (
        <button
          className="btn btn-sm btn-success w-100 mb-2"
          onClick={solicitarRecoleccion}
        >
          📅 Enviar solicitud
        </button>
      )}

      {punto.estado === "asignado" && (
        <button
          className="btn btn-sm btn-primary w-100 mb-2"
          onClick={() =>
            postAccion("recolector.puntos.enCamino", "🚗 Marcado en camino")
          }
        >
          🚗 Marcar en camino
        </button>
      )}

      {punto.estado === "en_camino" && (
        <button
          className="btn btn-sm btn-success w-100 mb-2"
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
        <p className="text-muted small text-center mt-2">
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
          title: "Ubicación actualizada",
          timer: 1300,
          showConfirmButton: false,
        });
      },
      () => {
        Swal.close();
        Swal.fire(
          "Error",
          "No se pudo obtener tu ubicación.",
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

  useEffect(() => {
    const interval = setInterval(() => fetchPuntos(), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const init = async () => {
      if (initialPuntos.length > 0) setLoading(false);
      await fetchPuntos();
    };
    init();
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

  const puntosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return puntos;
    return puntos.filter(
      (p) => p.reciclaje?.categoria_id === Number(categoriaSeleccionada)
    );
  }, [categoriaSeleccionada, puntos]);

  return (
    <RecolectorLayout title="Mapa de Recolección" auth={auth}>
      <div className="container py-4 animate__animated animate__fadeIn">

        <div className="mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <h2 className="fw-bold text-success mb-1">♻️ Mapa de recolección</h2>
                <p className="text-muted mb-0">
                  Revisá fotos, horarios y enviá tu solicitud al usuario.
                </p>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-2">
                <button onClick={obtenerUbicacion} className="btn btn-success">
                  📍 Mi ubicación
                </button>
                <button onClick={fetchPuntos} className="btn btn-outline-success">
                  🔄 Actualizar
                </button>
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
            <div className="spinner-border text-success mb-3" />
            <p className="text-muted">Cargando mapa...</p>
          </div>
        ) : (
          <div
            className="shadow-sm"
            style={{
              height: "75vh",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <MapContainer
              center={coords || [-17.3895, -66.1568]}
              zoom={13}
              scrollWheelZoom
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {coords && (
                <Marker position={[coords.lat, coords.lng]} icon={iconRecolector}>
                  <Popup>📍 Tu ubicación actual</Popup>
                </Marker>
              )}

              {puntosFiltrados.map((p, i) => (
                <Marker
                  key={p.id ?? i}
                  position={[p.latitud, p.longitud]}
                  icon={iconoPorEstado(p.estado)}
                >
                  <Popup>
                    <div style={{ maxWidth: 260 }}>
                      <h6 className="fw-bold text-success mb-1">
                        {p.usuario?.nombres || "Usuario"}
                      </h6>

                      <p className="mb-1 small">
                        <strong>Material:</strong> {p.material} <br />
                        <strong>Fecha:</strong> {p.fecha_disponible} <br />
                        <strong>Horario:</strong> {p.hora_desde} - {p.hora_hasta} <br />
                        <strong>Estado:</strong>{" "}
                        <span className="badge bg-secondary">{p.estado}</span>
                      </p>

                      {/* 🔵 INFORMACIÓN DE SOLICITUD */}
                      {p.solicitud_estado && (
                        <div className="mb-2">
                          <strong>Solicitud:</strong>{" "}
                          {p.solicitud_estado === "pendiente" && (
                            <span className="badge bg-warning text-dark">
                              Pendiente
                            </span>
                          )}
                          {p.solicitud_estado === "aceptada" && (
                            <span className="badge bg-success">Aceptada ✓</span>
                          )}
                          {p.solicitud_estado === "rechazada" && (
                            <span className="badge bg-danger">Rechazada ✗</span>
                          )}

                          {p.solicitud_fecha && (
                            <p className="small text-muted mb-0 mt-1">
                              <strong>Fecha solicitada:</strong>{" "}
                              {p.solicitud_fecha}
                              <br />
                              <strong>Horario:</strong>{" "}
                              {p.solicitud_hora_desde} – {p.solicitud_hora_hasta}
                            </p>
                          )}
                        </div>
                      )}

                      {/* 📸 FOTOS */}
                      <FotoCarousel fotos={p.fotos || []} />

                      {/* BOTONES */}
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
