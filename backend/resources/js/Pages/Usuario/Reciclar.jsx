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
    fechas: [],
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

  // ⬆ Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.latitud) {
      Swal.fire(
        "🌍 Ubicación requerida",
        "Por favor marcá tu ubicación en el mapa.",
        "warning"
      );
      return;
    }

    if (!data.fechas.length) {
      Swal.fire(
        "📅 Horario requerido",
        "Debes añadir al menos un día y rango horario.",
        "warning"
      );
      return;
    }

    const formData = new FormData();

    formData.append("categoria_id", data.categoria_id);
    formData.append("descripcion", data.descripcion);
    formData.append("latitud", data.latitud);
    formData.append("longitud", data.longitud);
    formData.append("fechas", JSON.stringify(data.fechas));

    if (data.imagenes?.length) {
      data.imagenes.forEach((img) => formData.append("imagenes[]", img));
    }

    try {
      await axios.post(route("usuario.reciclar.store"), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "♻ ¡Reciclaje registrado!",
        text: "Gracias por aportar al medio ambiente 🌎",
        confirmButtonColor: "#00c896",
      }).then(() => {
        Inertia.visit(route("usuario.dashboard"));
      });

      reset();
      setImagenesPreview([]);
    } catch (error) {
      Swal.fire("❌ Error", "Hubo un problema. Intentá nuevamente.", "error");
    }
  };

  return (
    <UserLayout title="Reciclaje Responsable" auth={auth}>
      <div className="py-4 px-2 animate__animated animate__fadeIn">
        
        {/* CARD PRINCIPAL */}
        <div
          className="card shadow-lg border-0 rounded-4 p-4 mx-auto w-100"
          style={{
            maxWidth: "900px",
            background: "linear-gradient(145deg, #fdfdfd, #ffffff 70%)",
          }}
        >
          {/* ======= TÍTULO ======= */}
          <div className="text-center mb-4 px-2">
            <h2 className="fw-bold text-success mb-1 text-wrap">
              ♻ Registro de Reciclaje
            </h2>

            <p className="text-secondary text-sm">
              ¡Completá los datos y ayudá a construir un planeta más limpio 🌍!
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="w-100">

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
              <label className="form-label fw-bold text-success">
                Descripción
              </label>

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

              <div className="row g-2">
                <div className="col-12 col-sm-4">
                  <label className="form-label small text-muted">Fecha</label>
                  <input
                    type="date"
                    className="form-control border-success-subtle"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>

                <div className="col-6 col-sm-4">
                  <label className="form-label small text-muted">Desde</label>
                  <input
                    type="time"
                    className="form-control border-success-subtle"
                    value={horaDesde}
                    onChange={(e) => setHoraDesde(e.target.value)}
                  />
                </div>

                <div className="col-6 col-sm-4">
                  <label className="form-label small text-muted">Hasta</label>
                  <input
                    type="time"
                    className="form-control border-success-subtle"
                    value={horaHasta}
                    onChange={(e) => setHoraHasta(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <button
                    type="button"
                    onClick={handleAddHorario}
                    className="btn btn-success w-100 fw-semibold shadow-sm mt-2"
                  >
                    ➕ Añadir horario
                  </button>
                </div>
              </div>

              {/* LISTA DE HORARIOS */}
              {data.fechas.length > 0 && (
                <ul className="list-group mt-3 shadow-sm">
                  {data.fechas.map((r, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-center border-start border-success-subtle"
                    >
                      <span className="text-success fw-semibold small">
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

              {/* Previews responsivas */}
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="rounded-3 overflow-hidden border border-success-subtle shadow-sm"
                    style={{
                      width: "140px",
                      height: "140px",
                      backgroundColor: "#f7fdf7",
                    }}
                  >
                    {imagenesPreview[index] ? (
                      <img
                        src={imagenesPreview[index]}
                        alt={`preview-${index}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex justify-content-center align-items-center text-muted small">
                        Sin imagen
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* === MAPA RESPONSIVO === */}
            <div className="mb-4">
              <label className="form-label fw-bold text-success">
                📍 Marque su ubicación
              </label>

              <div className="w-100 rounded overflow-hidden">
                <MapaReciclaje
                  onLocationSelect={(coords) => {
                    setData("latitud", coords.latitud);
                    setData("longitud", coords.longitud);
                  }}
                />
              </div>
            </div>

            {/* === BOTON FINAL === */}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-success px-5 py-2 rounded-pill fw-semibold shadow-sm w-100"
                disabled={processing}
              >
                {processing ? "Enviando..." : "✅ Confirmar registro"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* DARKMODE */}
      <style>{`
        body[data-theme="dark"] .card {
          background: linear-gradient(145deg, #1a1a1a, #202020) !important;
          color: #e6e6e6 !important;
        }
        body[data-theme="dark"] label {
          color: #00c896 !important;
        }
        body[data-theme="dark"] input,
        body[data-theme="dark"] select,
        body[data-theme="dark"] textarea {
          background: #0e0e0e !important;
          color: #f0f0f0 !important;
        }
        body[data-theme="dark"] .list-group-item {
          background: #111 !important;
          color: #e6e6e6 !important;
        }
      `}</style>
    </UserLayout>
  );
}
