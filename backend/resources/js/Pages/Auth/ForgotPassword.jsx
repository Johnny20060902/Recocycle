import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        if (!processing) post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar contraseña" />

            <div className="w-full max-w-md mx-auto bg-white/90 dark:bg-gray-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg animate__animated animate__fadeIn">

                {/* Título */}
                <h1 className="text-2xl font-bold text-center text-black dark:text-white mb-4">
                    🔑 Recuperar contraseña
                </h1>

                {/* Explicación */}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 text-center">
                    Ingresá tu correo electrónico y te enviaremos un enlace para
                    restablecer tu contraseña.
                </p>

                {/* Estado */}
                {status && (
                    <div className="mb-4 text-sm font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 py-2 px-3 rounded-md text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="text-black dark:text-white font-medium text-sm"
                        >
                            Correo electrónico
                        </label>

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full text-black dark:text-white border-gray-300 dark:border-gray-600 focus:border-green-700 focus:ring-green-700 rounded-lg"
                            autoComplete="email"
                            inputMode="email"        // evita zoom en iPhone
                            required
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="tucorreo@ejemplo.com"
                        />

                        <InputError
                            message={errors.email}
                            className="mt-2 text-red-600 text-sm"
                        />
                    </div>

                    {/* Botón */}
                    <PrimaryButton
                        className="w-full justify-center py-3 text-base rounded-lg shadow-md bg-green-700 hover:bg-green-800 text-white active:scale-95 transition"
                        disabled={processing}
                    >
                        {processing ? "Enviando..." : "Enviar enlace de recuperación"}
                    </PrimaryButton>
                </form>
            </div>
        </GuestLayout>
    );
}
