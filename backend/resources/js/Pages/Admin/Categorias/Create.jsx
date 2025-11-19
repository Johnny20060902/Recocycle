import AppLayout from "@/Layouts/AppLayout";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";

export default function Create({ auth }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    nombre: "",
    descripcion: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("admin.categorias.store"), {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Categoría creada",
          text: "La nueva categoría fue registrada correctamente.",
          confirmButtonColor: "#10b981",
        });
        reset();
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "Error al guardar",
          text: "Revisa los campos e inténtalo nuevamente.",
          confirmButtonColor: "#ef4444",
        });
      },
    });
  };

  return (
    <AppLayout title="Nueva Categoría" auth={auth}>
      <motion.div
        className="p-6 max-w-2xl mx-auto animate__animated animate__fadeIn"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          {/* TÍTULO */}
          <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-6 flex items-center gap-2">
            ➕ Nueva Categoría
          </h1>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Nombre
              </label>
              <input
                type="text"
                value={data.nombre}
                onChange={(e) => setData("nombre", e.target.value)}
                placeholder="Ej. Plásticos, Vidrio, Metales..."
                className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                transition-all focus:ring-2 focus:outline-none ${
                  errors.nombre
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 dark:border-gray-700 focus:ring-emerald-500"
                }`}
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Descripción
              </label>
              <textarea
                rows="4"
                value={data.descripcion}
                onChange={(e) => setData("descripcion", e.target.value)}
                placeholder="Describe brevemente la categoría..."
                className={`w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                transition-all focus:ring-2 focus:outline-none ${
                  errors.descripcion
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 dark:border-gray-700 focus:ring-emerald-500"
                }`}
              ></textarea>
              {errors.descripcion && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.descripcion}
                </p>
              )}
            </div>

            {/* Botón Guardar */}
            <motion.button
              type="submit"
              disabled={processing}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all ${
                processing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600"
              }`}
            >
              {processing ? "Guardando..." : "💾 Guardar Categoría"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </AppLayout>
  );
}
