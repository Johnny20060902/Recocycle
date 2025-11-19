import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        if (!processing) post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Verificación de Email" />

            <div className="w-full max-w-md mx-auto bg-white/70 dark:bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-md animate__animated animate__fadeIn">
                <h1 className="text-2xl font-bold text-center text-green-700 dark:text-emerald-300 mb-4">
                    📩 Verificá tu correo electrónico
                </h1>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    Gracias por registrarte 🙌. Antes de continuar, por favor
                    verificá tu correo haciendo clic en el enlace que te
                    enviamos.  
                    <br />
                    <br />
                    Si no recibiste el correo, podés solicitar que lo enviemos
                    nuevamente.
                </p>

                {status === "verification-link-sent" && (
                    <div className="mb-4 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 py-2 px-3 rounded-md text-center">
                        ✔ Te enviamos un nuevo enlace de verificación.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    {/* BOTÓN RESPONSIVE */}
                    <PrimaryButton
                        disabled={processing}
                        className="w-full justify-center py-3 text-base rounded-lg shadow-sm active:scale-[0.97] transition"
                    >
                        Enviar nuevamente el correo
                    </PrimaryButton>

                    {/* BOTÓN LOGOUT */}
                    <div className="text-center">
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className="text-sm text-gray-600 dark:text-gray-300 underline hover:text-gray-900 dark:hover:text-white transition"
                        >
                            Cerrar sesión
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
