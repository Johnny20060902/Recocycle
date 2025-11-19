import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { createPortal } from "react-dom";

export default function RatingModal({ puntoId, triggerLabel = "Calificar", onRated }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");

  const estrellas = [1, 2, 3, 4, 5];

  const colorPorPuntos = (valor) => {
    if (valor <= 4) return "#FF4B4B";
    if (valor <= 8) return "#FFC300";
    return "#00C851";
  };

  const enviarCalificacion = async () => {
    if (rating === 0) {
      Swal.fire("⚠️", "Seleccioná una cantidad de estrellas.", "warning");
      return;
    }

    try {
      await axios.post(route("calificar.store"), {
        punto_recoleccion_id: puntoId,
        puntaje: rating,
        comentario,
      });

      Swal.fire({
        icon: "success",
        title: `Gracias por tu calificación (${rating * 2} pts) 💚`,
        timer: 1600,
        showConfirmButton: false,
      });

      // 🔥 Notificar al componente padre que se calificó
      if (onRated) onRated();

      setOpen(false);
      setRating(0);
      setComentario("");
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error?.response?.data?.message || "No se pudo registrar la calificación.",
        "error"
      );
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-sm btn-outline-success rounded-pill"
      >
        🌟 {triggerLabel}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white dark:bg-[#1b1b1b] rounded-2xl shadow-lg p-6 w-96 relative animate__animated animate__fadeInDown"
              onClick={(e) => e.stopPropagation()}
              style={{
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              {/* Botón de cierre */}
              <button
                className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>

              {/* Título */}
              <h4 className="text-lg font-semibold text-center mb-4 text-success dark:text-emerald-400">
                Calificar la experiencia
              </h4>

              {/* Estrellas */}
              <div className="flex justify-center mb-3">
                {estrellas.map((star) => (
                  <span
                    key={star}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    style={{
                      fontSize: "2.2rem",
                      cursor: "pointer",
                      color:
                        star <= (hover || rating)
                          ? colorPorPuntos(star * 2)
                          : "#C0C0C0",
                      transition: "color 0.25s ease",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Texto dinámico */}
              <p
                className="text-center font-medium mb-3"
                style={{
                  color: rating > 0 ? colorPorPuntos(rating * 2) : "#999",
                }}
              >
                {rating > 0
                  ? `${rating * 2} puntos / 10`
                  : "Seleccioná una calificación"}
              </p>

              {/* Comentario */}
              <div className="mb-4">
                <label className="form-label text-sm text-muted dark:text-gray-300">
                  Comentario (opcional)
                </label>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={3}
                  className="form-control text-sm dark:bg-[#2b2b2b] dark:text-white"
                  placeholder="¿Qué opinás de esta experiencia?"
                />
              </div>

              {/* Botón enviar */}
              <div className="text-center">
                <button
                  onClick={enviarCalificacion}
                  className="btn btn-success rounded-pill px-4 fw-semibold"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
