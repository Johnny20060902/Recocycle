import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = "",
}) {
  const user = usePage().props.auth.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      name: user.name,
      email: user.email,
    });

  const submit = (e) => {
    e.preventDefault();
    patch(route("profile.update"));
  };

  return (
    <section
      className={`${className} bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 transition-all`}
    >
      {/* =============================
           HEADER
      ============================== */}
      <header className="border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Información del Perfil
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Actualizá tus datos personales y tu dirección de correo electrónico.
        </p>
      </header>

      {/* =============================
            FORMULARIO
      ============================== */}
      <form onSubmit={submit} className="space-y-6">
        {/* ----- Nombre ----- */}
        <div>
          <InputLabel
            htmlFor="name"
            value="Nombre completo"
            className="dark:text-gray-300"
          />

          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            isFocused
            autoComplete="name"
          />

          <InputError className="mt-2" message={errors.name} />
        </div>

        {/* ----- Email ----- */}
        <div>
          <InputLabel
            htmlFor="email"
            value="Correo electrónico"
            className="dark:text-gray-300"
          />

          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
            autoComplete="username"
          />

          <InputError className="mt-2" message={errors.email} />
        </div>

        {/* =============================
             VERIFICACIÓN DE EMAIL
        ============================== */}
        {mustVerifyEmail && user.email_verified_at === null && (
          <div className="rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/40">
            <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">
              Tu dirección de correo aún no está verificada.
            </p>

            <Link
              href={route("verification.send")}
              method="post"
              as="button"
              className="text-sm text-indigo-600 dark:text-indigo-300 underline hover:text-indigo-800 dark:hover:text-indigo-400"
            >
              Reenviar enlace de verificación
            </Link>

            {status === "verification-link-sent" && (
              <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                📩 Se envió un nuevo enlace a tu correo.
              </div>
            )}
          </div>
        )}

        {/* =============================
             BOTÓN GUARDAR Y FEEDBACK
        ============================== */}
        <div className="flex items-center gap-4">
          <PrimaryButton disabled={processing}>Guardar cambios</PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition duration-300"
            enterFrom="opacity-0"
            leave="transition duration-300"
            leaveFrom="opacity-100"
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
