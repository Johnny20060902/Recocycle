import UserLayout from "@/Layouts/UserLayout";
import { Link } from "@inertiajs/react";
import RatingModal from "@/Components/RatingModal";
import Swal from "sweetalert2";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

/**
 * 📦 Vista de historial de reciclajes / puntos del usuario
 * Incluye control de solicitudes del recolector (aceptar / rechazar)
 * y actualización en tiempo real.
 */
export default function MisReciclajes({ auth, puntos = [] }) {
  const [items, setItems] = useState(puntos);
  const [fotoIndexByPunto, setFotoIndexByPunto] = useState({});

  // 🔥 Para no refrescar si no cambió nada
  const ultimaDataRef = useRef(JSON.stringify(puntos));

  // 🔄 AUTO-REFRESH CADA 5 SEGUNDOS
  useEffect(() => {
    const intervalo = setInterval(async () => {
      try {
        const { data } = await axios.get(route("usuario.puntos.list"));
        const nuevaData = JSON.stringify(data.puntos);

        if (nuevaData !== ultimaDataRef.current) {
          ultimaDataRef.current = nuevaData;
          setItems(data.puntos);
        }
      } catch (err) {
        console.error("❌ Error refrescando puntos:", err);
      }
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // 🔄 Actualizar datos localmente después de aceptar/rechazar
  const refrescarEstadoLocal = (puntoId, nuevosDatos) => {
    setItems((prev) =>
      prev.map((p) => (p.id === puntoId ? { ...p, ...nuevosDatos } : p))
    );
  };

  const manejarSolicitud = async (puntoId, accion) => {
    const confirm = await Swal.fire({
      title:
        accion === "aceptar" ? "✅ Aceptar solicitud" : "❌ Rechazar solicitud",
      text:
        accion === "aceptar"
          ? "¿Confirmás que este recolector retire tu reciclaje?"
          : "¿Seguro que querés rechazar la solicitud de este recolector?",
      icon: accion === "aceptar" ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: accion === "aceptar" ? "Sí, aceptar" : "Sí, rechazar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: accion === "aceptar" ? "#198754" : "#dc3545",
    });

    if (!confirm.isConfirmed) return;

    try {
      const ruta =
        accion === "aceptar"
          ? route("usuario.puntos.aceptarSolicitud", puntoId)
          : route("usuario.puntos.rechazarSolicitud", puntoId);

      const { data } = await axios.post(ruta);

      Swal.fire({
        icon: "success",
        title:
          accion === "aceptar"
            ? "Solicitud aceptada correctamente ✅"
            : "Solicitud rechazada ❌",
        timer: 1500,
        showConfirmButton: false,
      });

      refrescarEstadoLocal(
        puntoId,
        data.punto || {
          solicitud_estado: accion === "aceptar" ? "aceptada" : "rechazada",
          estado: accion === "aceptar" ? "asignado" : "pendiente",
        }
      );
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error?.response?.data?.message || "No se pudo procesar la solicitud.",
        "error"
      );
    }
  };

  // 🗑️ Eliminar reciclaje + punto
  const eliminarReciclaje = async (puntoId) => {
    const confirm = await Swal.fire({
      title: "🗑️ Eliminar reciclaje",
      text: "Esta acción eliminará el reciclaje y sus imágenes. ¿Estás seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(route("usuario.reciclajes.destroy", puntoId));

      setItems((prev) => prev.filter((p) => p.id !== puntoId));

      Swal.fire({
        icon: "success",
        title: "Reciclaje eliminado correctamente ✅",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error?.response?.data?.message || "No se pudo eliminar el reciclaje.",
        "error"
      );
    }
  };

  // 🔁 Cambiar foto de una tarjeta
  const cambiarFoto = (puntoId, total, direccion) => {
    setFotoIndexByPunto((prev) => {
      const actual = prev[puntoId] ?? 0;
      const nuevo = (actual + direccion + total) % total;
      return { ...prev, [puntoId]: nuevo };
    });
  };

  return (
    <UserLayout title="Mis Reciclajes" auth={auth}>
      <div className="container py-5 animate__animated animate__fadeIn">
        <div className="text-center mb-5">
          <h1 className="fw-bold text-success">♻️ Mis Reciclajes Registrados</h1>
          <p className="text-secondary fs-5">
            Consultá el estado de tus recolecciones y gestioná las solicitudes entrantes 🌎
          </p>
        </div>

        {items.length > 0 ? (
          <div className="row justify-content-center g-4">
            {items.map((p) => {
              const imagenes = Array.isArray(p.imagenes_url)
                ? p.imagenes_url
                : [];
              const totalFotos = imagenes.length;
              const idx = fotoIndexByPunto[p.id] ?? 0;
              const currentFoto =
                totalFotos > 0 ? imagenes[idx % totalFotos] : null;

              return (
                <div key={p.id} className="col-md-6 col-lg-4">
                  <div
                    className="card border-0 shadow-lg h-100 overflow-hidden hover-shadow"
                    style={{
                      borderRadius: "1rem",
                      background: "linear-gradient(145deg, #edfff8, #ffffff)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    {/* === Carrusel de imágenes === */}
                    <div className="position-relative">
                      {currentFoto ? (
                        <img
                          src={`/storage/${currentFoto}`}
                          alt="Reciclaje"
                          className="card-img-top object-fit-cover"
                          style={{
                            height: "200px",
                            borderTopLeftRadius: "1rem",
                            borderTopRightRadius: "1rem",
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center bg-light"
                          style={{
                            height: "200px",
                            borderTopLeftRadius: "1rem",
                            borderTopRightRadius: "1rem",
                          }}
                        >
                          <span className="text-muted">📦 Sin imágenes</span>
                        </div>
                      )}

                      {totalFotos > 1 && (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-light position-absolute top-50 start-0 translate-middle-y ms-2"
                            style={{ opacity: 0.85 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              cambiarFoto(p.id, totalFotos, -1);
                            }}
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-2"
                            style={{ opacity: 0.85 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              cambiarFoto(p.id, totalFotos, +1);
                            }}
                          >
                            ›
                          </button>
                          <span
                            className="badge bg-dark bg-opacity-75 position-absolute bottom-0 end-0 m-2"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {idx + 1} / {totalFotos}
                          </span>
                        </>
                      )}
                    </div>

                    {/* === Cuerpo === */}
                    <div className="card-body">
                      <h5 className="fw-bold text-success mb-1">
                        {p.material || "Sin categoría"}
                      </h5>

                      {p.descripcion && (
                        <p className="text-secondary small mb-2">
                          {p.descripcion}
                        </p>
                      )}

                      <div className="mb-2 text-secondary small">
                        📅 {p.fecha_disponible || "-"} — ⏰ {p.hora_desde} a{" "}
                        {p.hora_hasta}
                      </div>

                      {/* === Estado === */}
                      <div className="mt-3">
                        <span
                          className={`badge px-3 py-2 fw-semibold text-uppercase ${
                            p.estado === "pendiente"
                              ? "bg-warning text-dark"
                              : p.estado === "asignado"
                              ? "bg-info text-white"
                              : p.estado === "en_camino"
                              ? "bg-primary text-white"
                              : p.estado === "recogido"
                              ? "bg-secondary text-white"
                              : p.estado === "completado"
                              ? "bg-success text-white"
                              : "bg-secondary text-white"
                          }`}
                        >
                          {p.estado}
                        </span>
                      </div>

                      {/* === Solicitud de recolector === */}
                      {p.solicitud_estado === "pendiente" &&
                        p.estado === "pendiente" &&
                        p.recolector && (
                          <div className="mt-3 text-center">
                            <div className="alert alert-info small py-2 mb-2">
                              👷‍♂️ {p.recolector.nombres}{" "}
                              {p.recolector.apellidos} solicitó recoger este
                              reciclaje.
                            </div>
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => manejarSolicitud(p.id, "aceptar")}
                              >
                                ✅ Aceptar
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  manejarSolicitud(p.id, "rechazar")
                                }
                              >
                                ❌ Rechazar
                              </button>
                            </div>
                          </div>
                        )}

                      {p.solicitud_estado === "aceptada" && (
                        <div className="alert alert-success small py-2 mt-3 text-center">
                          ✅ Solicitud aceptada. El recolector está en camino.
                        </div>
                      )}

                      {p.solicitud_estado === "rechazada" && (
                        <div className="alert alert-danger small py-2 mt-3 text-center">
                          ❌ Rechazaste esta solicitud.
                        </div>
                      )}

                      {p.recolector && p.solicitud_estado === "aceptada" && (
                        <div className="mt-3 small text-secondary text-center">
                          👷‍♂️ <strong>{p.recolector.nombres}</strong>{" "}
                          {p.recolector.apellidos}
                        </div>
                      )}
                    </div>

                    {/* === Pie de tarjeta === */}
                    <div className="card-footer bg-light border-0 d-flex justify-content-between align-items-center">
                      <small className="text-secondary">
                        📅 Actualizado:{" "}
                        {new Date().toLocaleDateString("es-BO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </small>

                      <div className="d-flex align-items-center gap-2">
                        {/* Botón Calificar */}
                        {p.estado === "completado" && !p.ya_califique && (
                          <RatingModal
                            puntoId={p.id}
                            triggerLabel="Calificar recolector"
                          />
                        )}

                        {["pendiente", "rechazada"].includes(p.estado) && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarReciclaje(p.id)}
                          >
                            🗑️ Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <h4 className="text-secondary">😔 Aún no registraste ningún reciclaje.</h4>
            <p>¡Comenzá a reciclar hoy y sumá puntos ecológicos! 🌱</p>
            <Link
              href={route("usuario.reciclar")}
              className="btn btn-success rounded-pill px-4 py-2 fw-semibold shadow-sm"
            >
              ♻️ Registrar nuevo reciclaje
            </Link>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
