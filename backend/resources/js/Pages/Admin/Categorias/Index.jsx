import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "animate.css";

export default function Index({ auth, categorias }) {
  const { delete: destroy } = useForm();

  const [darkMode, setDarkMode] = useState(
    document.body.getAttribute("data-theme") === "dark"
  );

  // Detectar cambios en modo oscuro
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDarkMode(document.body.getAttribute("data-theme") === "dark")
    );
    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Eliminar
  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar categoría?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: darkMode ? "#1f2937" : "#ffffff",
      color: darkMode ? "#f3f4f6" : "#111827",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(route("admin.categorias.destroy", id));

        Swal.fire({
          title: "Eliminado",
          text: "La categoría fue eliminada correctamente.",
          icon: "success",
          timer: 1350,
          showConfirmButton: false,
          background: darkMode ? "#1f2937" : "#ffffff",
          color: darkMode ? "#f3f4f6" : "#111827",
        });
      }
    });
  };

  return (
    <AppLayout title="Categorías" auth={auth}>
      <motion.div
        className="p-6 space-y-8 animate__animated animate__fadeIn"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-700 dark:to-cyan-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <i className="bi bi-recycle text-3xl"></i>
            Categorías
          </h1>

          <Link
            href={route("admin.categorias.create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-700 font-semibold shadow hover:shadow-lg hover:bg-emerald-50 transition-all duration-300"
          >
            <i className="bi bi-plus-circle-fill text-emerald-600"></i>
            Nueva Categoría
          </Link>
        </div>

        {/* TABLA */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-emerald-600 dark:bg-emerald-700 text-white uppercase text-sm tracking-wide">
                  <th className="px-6 py-3 text-left font-semibold">#</th>
                  <th className="px-6 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-center font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {categorias.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-10 text-gray-500 dark:text-gray-400 italic"
                    >
                      No hay categorías registradas.
                    </td>
                  </tr>
                ) : (
                  categorias.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      className="hover:bg-emerald-50 dark:hover:bg-gray-800 transition-all"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.005 }}
                    >
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-300 font-medium">
                        {i + 1}
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                        {c.nombre}
                      </td>

                      <td className="px-6 py-4 text-gray-700 dark:text-gray-400">
                        {c.descripcion || "-"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={route("admin.categorias.edit", c.id)}
                            className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow hover:shadow-yellow-400/30 transition-all"
                            title="Editar"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </Link>

                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow hover:shadow-red-400/30 transition-all"
                            title="Eliminar"
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium pt-2">
          Mostrando {categorias.length}{" "}
          {categorias.length === 1 ? "categoría" : "categorías"} registradas.
        </div>
      </motion.div>
    </AppLayout>
  );
}
