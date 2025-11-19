import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({ mustVerifyEmail, status }) {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-100">
          Mi Perfil
        </h2>
      }
    >
      <Head title="Perfil" />

      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">

          {/* ================================
              🧑 Información de perfil
          ================================= */}
          <section className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-10 transition">
            <div className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Información del usuario
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Actualizá tus datos personales y correo electrónico.
              </p>
            </div>

            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-2xl"
            />
          </section>

          {/* ================================
              🔒 Actualizar contraseña
          ================================= */}
          <section className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-10 transition">
            <div className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Cambiar contraseña
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Mantené tu cuenta segura cambiando tu contraseña regularmente.
              </p>
            </div>

            <UpdatePasswordForm className="max-w-2xl" />
          </section>

          {/* ================================
              🗑 Eliminar cuenta
          ================================= */}
          <section className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-10 transition border border-red-300/40 dark:border-red-700/40">
            <div className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">
                Eliminar cuenta
              </h3>
              <p className="text-sm text-red-500 dark:text-red-300 mt-1">
                Acción irreversible. Una vez eliminada, no podrás recuperar tu cuenta.
              </p>
            </div>

            <DeleteUserForm className="max-w-2xl" />
          </section>

        </div>
      </div>
    </AuthenticatedLayout>
  );
}
