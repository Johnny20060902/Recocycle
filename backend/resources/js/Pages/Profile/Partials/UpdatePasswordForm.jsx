import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function UpdatePasswordForm({ className = "" }) {
  const passwordInput = useRef();
  const currentPasswordInput = useRef();

  const {
    data,
    setData,
    errors,
    put,
    reset,
    processing,
    recentlySuccessful,
  } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const updatePassword = (e) => {
    e.preventDefault();

    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset("password", "password_confirmation");
          passwordInput.current.focus();
        }

        if (errors.current_password) {
          reset("current_password");
          currentPasswordInput.current.focus();
        }
      },
    });
  };

  // 👀 Mostrar / ocultar contraseñas
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section
      className={`${className} bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 transition-all`}
    >
      {/* =======================================
                HEADER
      ======================================== */}
      <header className="border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Actualizar contraseña
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Asegurate de usar una contraseña larga y segura para proteger tu
          cuenta.
        </p>
      </header>

      {/* =======================================
                FORMULARIO
      ======================================== */}
      <form onSubmit={updatePassword} className="space-y-6">
        {/* ----- Contraseña Actual ----- */}
        <div>
          <InputLabel
            htmlFor="current_password"
            value="Contraseña actual"
            className="dark:text-gray-300"
          />

          <div className="relative">
            <TextInput
              id="current_password"
              ref={currentPasswordInput}
              value={data.current_password}
              onChange={(e) => setData("current_password", e.target.value)}
              type={showCurrent ? "text" : "password"}
              className="mt-1 block w-full pr-10"
              autoComplete="current-password"
            />

            {/* Botón ojo */}
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
            >
              {showCurrent ? "🙈" : "👁️"}
            </button>
          </div>

          <InputError message={errors.current_password} className="mt-2" />
        </div>

        {/* ----- Nueva Contraseña ----- */}
        <div>
          <InputLabel
            htmlFor="password"
            value="Nueva contraseña"
            className="dark:text-gray-300"
          />

          <div className="relative">
            <TextInput
              id="password"
              ref={passwordInput}
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              type={showNew ? "text" : "password"}
              className="mt-1 block w-full pr-10"
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
            >
              {showNew ? "🙈" : "👁️"}
            </button>
          </div>

          <InputError message={errors.password} className="mt-2" />
        </div>

        {/* ----- Confirmar Contraseña ----- */}
        <div>
          <InputLabel
            htmlFor="password_confirmation"
            value="Confirmar contraseña"
            className="dark:text-gray-300"
          />

          <div className="relative">
            <TextInput
              id="password_confirmation"
              value={data.password_confirmation}
              onChange={(e) =>
                setData("password_confirmation", e.target.value)
              }
              type={showConfirm ? "text" : "password"}
              className="mt-1 block w-full pr-10"
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>

          <InputError
            message={errors.password_confirmation}
            className="mt-2"
          />
        </div>

        {/* =======================================
                BOTÓN
      ======================================== */}
        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>Guardar cambios</PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition duration-300"
            enterFrom="opacity-0"
            leave="transition duration-300"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-green-600 dark:text-green-400">
              ✔ Guardado correctamente
            </p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
