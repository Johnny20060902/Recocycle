import AppLayout from "@/Layouts/AppLayout";
import { useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "animate.css";

export default function Edit({ auth, categoria }) {
  const { data, setData, put, processing, errors } = useForm({
    nombre: categoria.nombre || "",
    descripcion: categoria.descripcion || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("admin.categorias.update", categoria.id), {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "✅ Categoría actualizada",
          text: "Los cambios se guardaron correctamente.",
          confirmButtonColor: "#16a34a",
        });
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "❌ Error al actualizar",
          text: "Verifica los campos e inténtalo nuevamente.",
          confirmButtonColor: "#dc2626",
        });
      },
    });
  };

  return (
    <AppLayout title="Editar Categoría" auth={auth}>
      <motion.div
        className="p-6 max-w-2xl mx-auto animate__animated animate__fadeIn"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-6 flex items-center gap-2">
            ✏️ Editar Categoría
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Nombre
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition duration-200 ${errors.nombre
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 dark:border-gray-700 focus:ring-emerald-500"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                value={data.nombre}
                onChange={(e) => setData("nombre", e.target.value)}
                placeholder="Ej. Plásticos, Vidrio, Metales..."
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
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition duration-200 ${errors.descripcion
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 dark:border-gray-700 focus:ring-emerald-500"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                value={data.descripcion}
                onChange={(e) => setData("descripcion", e.target.value)}
                rows="4"
                placeholder="Describe brevemente la categoría..."
              />
              {errors.descripcion && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.descripcion}
                </p>
              )}
            </div>

            {/* Botón */}
            <motion.button
              type="submit"
              disabled={processing}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all shadow-md ${processing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600"
                }`}
            >
              {processing ? "Actualizando..." : "💾 Guardar Cambios"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </AppLayout>
  );
}
