import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";
import Swal from "sweetalert2";
import UserLayout from "@/Layouts/UserLayout";
import MapaReciclaje from "@/Components/MapaReciclaje";

export default function Reciclar({ auth, categorias }) {
  const { data, setData, processing, reset } = useForm({
    categoria_id: "",
    descripcion: "",
    fechas: [], // 👈 el array que usaremos para enviar varios horarios
    latitud: "",
    longitud: "",
    imagenes: [],
  });

  const [imagenesPreview, setImagenesPreview] = useState([]);
  const [fecha, setFecha] = useState("");
  const [horaDesde, setHoraDesde] = useState("");
  const [horaHasta, setHoraHasta] = useState("");

  // ➕ Agregar horario
  const handleAddHorario = () => {
    if (!fecha || !horaDesde || !horaHasta) return;

    const nuevo = { fecha, hora_desde: horaDesde, hora_hasta: horaHasta };

    if (
      data.fechas.some(
        (r) =>
          r.fecha === nuevo.fecha &&
          r.hora_desde === nuevo.hora_desde &&
          r.hora_hasta === nuevo.hora_hasta
      )
    )
      return;

    setData("fechas", [...data.fechas, nuevo]);
    setFecha("");
    setHoraDesde("");
    setHoraHasta("");
  };

  // ❌ Eliminar horario
  const handleRemoveHorario = (index) => {
    setData(
      "fechas",
      data.fechas.filter((_, i) => i !== index)
    );
  };

  // 📸 Subir imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImagenesPreview(files.map((f) => URL.createObjectURL(f)));
    setData("imagenes", files);
  };

  // ✅ Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.latitud) {
      Swal.fire(
        "🌎 Ubicación requerida",
        "Por favor, marcá tu ubicación en el mapa antes de enviar.",
        "warning"
      );
      return;
    }

    if (!data.fechas.length) {
      Swal.fire(
        "📅 Horario requerido",
        "Debes añadir al menos una fecha y hora disponibles.",
        "warning"
      );
      return;
    }

    const formData = new FormData();

    formData.append("categoria_id", data.categoria_id);
    formData.append("descripcion", data.descripcion);
    formData.append("latitud", data.latitud);
    formData.append("longitud", data.longitud);

    // 🔁 Enviar array de fechas en formato JSON
    formData.append("fechas", JSON.stringify(data.fechas));

    if (data.imagenes && data.imagenes.length > 0) {
      data.imagenes.forEach((img) => formData.append("imagenes[]", img));
    }

    try {
      await axios.post(route("usuario.reciclar.store"), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "♻️ ¡Reciclaje registrado!",
        text: "Gracias por aportar al medio ambiente 🌍",
        confirmButtonText: "Volver al inicio",
        confirmButtonColor: "#00c896",
        background: "#ffffff",
      }).then((r) => {
        if (r.isConfirmed) Inertia.visit(route("usuario.dashboard"));
      });

      reset();
      setImagenesPreview([]);
    } catch (error) {
      console.error("Error al registrar reciclaje:", error);
      Swal.fire("❌ Error", "Revisá los campos e intentá nuevamente.", "error");
    }
  };

  return (
    <UserLayout title="Reciclaje Responsable" auth={auth}>
      <div className="container py-5 animate__animated animate__fadeIn">
        <div
          className="card shadow-lg border-0 rounded-4 p-4 mx-auto"
          style={{
            maxWidth: "900px",
            background: "linear-gradient(145deg, var(--bs-light), #ffffff 70%)",
          }}
        >
          {/* ======= TÍTULO ======= */}
          <div className="text-center mb-4">
            <h2 className="fw-bold text-success mb-1">♻️ Registro de Reciclaje</h2>
            <p className="text-secondary">
              ¡Completá los datos y ayudá a construir un planeta más limpio 🌿!
            </p>
          </div>

          {/* ======= FORMULARIO ======= */}
          <form onSubmit={handleSubmit}>
            {/* === CATEGORÍA === */}
            <div className="mb-4">
              <label className="form-label fw-bold text-success">
                Categoría del material
              </label>
              <select
                className="form-select border-success-subtle shadow-sm"
                value={data.categoria_id}
                onChange={(e) => setData("categoria_id", e.target.value)}
                required
              >
                <option value="">-- Seleccioná una categoría --</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* === DESCRIPCIÓN === */}
            <div className="mb-4">
              <label className="form-label fw-bold text-success">Descripción</label>
              <textarea
                className="form-control border-success-subtle shadow-sm"
                rows="3"
                placeholder="Ej: Cajas de cartón limpias y ordenadas."
                value={data.descripcion}
                onChange={(e) => setData("descripcion", e.target.value)}
              ></textarea>
            </div>

            {/* === HORARIOS === */}
            <div className="mb-4">
              <label className="form-label fw-bold text-success">
                Días y horarios disponibles
              </label>
              <div className="row g-2 align-items-end">
                <div className="col-md-3">
                  <label className="form-label small text-muted">Fecha</label>
                  <input
                    type="date"
                    className="form-control border-success-subtle"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted">Desde</label>
                  <input
                    type="time"
                    className="form-control border-success-subtle"
                    value={horaDesde}
                    onChange={(e) => setHoraDesde(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted">Hasta</label>
                  <input
                    type="time"
                    className="form-control border-success-subtle"
                    value={horaHasta}
                    onChange={(e) => setHoraHasta(e.target.value)}
                  />
                </div>
                <div className="col-md-3 text-center">
                  <button
                    type="button"
                    onClick={handleAddHorario}
                    className="btn btn-success rounded-pill w-100 fw-semibold shadow-sm"
                  >
                    ➕ Añadir
                  </button>
                </div>
              </div>

              {data.fechas.length > 0 && (
                <ul className="list-group mt-3 shadow-sm">
                  {data.fechas.map((r, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-center border-start border-success-subtle"
                    >
                      <span className="text-success fw-semibold">
                        📅 {r.fecha} — ⏰ {r.hora_desde} - {r.hora_hasta}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHorario(i)}
                        className="btn btn-sm btn-outline-danger rounded-pill"
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* === IMÁGENES === */}
            <div className="mb-4">
              <label className="form-label fw-bold text-success">
                📸 Fotos del material (máx. 5)
              </label>
              <input
                id="imagenes"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="form-control mb-3 border-success-subtle shadow-sm"
              />
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="border border-success-subtle rounded-3 d-flex align-items-center justify-content-center overflow-hidden position-relative"
                    style={{
                      width: "150px",
                      height: "150px",
                      backgroundColor: "#f9fef9",
                      boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
                    }}
                  >
                    {imagenesPreview[index] ? (
                      <img
                        src={imagenesPreview[index]}
                        alt={`preview-${index}`}
                        className="w-100 h-100 object-fit-cover rounded-3"
                      />
                    ) : (
                      <span className="text-success small">Sin imagen</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* === MAPA === */}
            <div className="mb-4">
              <label className="form-label fw-bold text-success">
                📍 Marque su ubicación
              </label>
              <MapaReciclaje
                onLocationSelect={(coords) => {
                  setData("latitud", coords.latitud);
                  setData("longitud", coords.longitud);
                }}
              />
            </div>

            {/* === BOTÓN FINAL === */}
            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-success px-5 py-2 rounded-pill fw-semibold shadow-sm"
                disabled={processing}
              >
                {processing ? "Enviando..." : "✅ Confirmar registro"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ======= ESTILOS MODO OSCURO ======= */}
      <style>{`
        body[data-theme="dark"] .card {
          background: linear-gradient(145deg, #1a1a1a, #222) !important;
          color: #e6e6e6 !important;
        }
        body[data-theme="dark"] label,
        body[data-theme="dark"] .form-label {
          color: #00d4a1 !important;
        }
        body[data-theme="dark"] input,
        body[data-theme="dark"] select,
        body[data-theme="dark"] textarea {
          background-color: #0f0f0f !important;
          color: #f0f0f0 !important;
          border: 1px solid #00c896 !important;
        }
        body[data-theme="dark"] .list-group-item {
          background-color: #121212 !important;
          color: #e6e6e6 !important;
        }
      `}</style>
    </UserLayout>
  );
}
