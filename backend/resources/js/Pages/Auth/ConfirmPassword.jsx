import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!processing) {
            post(route("password.confirm"), {
                onFinish: () => reset("password"),
            });
        }
    };

    return (
        <GuestLayout>
            <Head title="Confirmar contraseña" />

            <div className="w-full max-w-md mx-auto bg-white/70 dark:bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-md animate__animated animate__fadeIn">

                {/* Título */}
                <h1 className="text-2xl font-bold text-center text-green-700 dark:text-emerald-300 mb-4">
                    🔐 Confirmar identidad
                </h1>

                {/* Explicación */}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 text-center">
                    Estás ingresando a un área segura.  
                    Por motivos de seguridad, por favor confirmá tu contraseña antes
                    de continuar.
                </p>

                <form onSubmit={submit} className="space-y-6">

                    {/* Contraseña */}
                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="text-gray-700 dark:text-gray-200"
                        />

                        <div className="relative mt-1">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="block w-full text-black rounded-lg pr-12"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />

                            {/* 👁 Ojo */}
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition"
                                aria-label={
                                    showPassword
                                        ? "Ocultar contraseña"
                                        : "Mostrar contraseña"
                                }
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 0 1 2.223-3.56M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                                        <path d="M6.1 6.1A9.99 9.99 0 0 1 12 4c4.477 0 8.268 2.943 9.542 7a10.052 10.052 0 0 1-4.043 5.036" />
                                        <line x1="3" y1="3" x2="21" y2="21" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <InputError
                            message={errors.password}
                            className="mt-2 text-red-500 text-sm"
                        />
                    </div>

                    {/* Botón */}
                    <PrimaryButton
                        className="w-full justify-center py-3 text-base rounded-lg shadow-sm active:scale-[0.97] transition"
                        disabled={processing}
                    >
                        {processing ? "Confirmando..." : "Confirmar contraseña"}
                    </PrimaryButton>
                </form>
            </div>
        </GuestLayout>
    );
}
