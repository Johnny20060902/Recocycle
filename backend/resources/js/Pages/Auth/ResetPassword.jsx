import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Restablecer contraseña" />

            <div className="w-full max-w-md mx-auto bg-white/90 dark:bg-gray-900/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg animate__animated animate__fadeIn">

                <h1 className="text-2xl font-bold text-center text-black dark:text-white mb-3">
                    🔐 Crear nueva contraseña
                </h1>

                <p className="text-gray-700 dark:text-gray-300 text-sm text-center mb-6">
                    Ingresá una contraseña segura siguiendo las recomendaciones.
                </p>

                <form onSubmit={submit} className="space-y-5">

                    {/* EMAIL */}
                    <div>
                        <InputLabel htmlFor="email" value="Correo electrónico" className="text-black" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full text-black"
                            disabled
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <InputLabel htmlFor="password" value="Nueva contraseña" className="text-black" />

                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full pr-10 text-black"
                            autoComplete="new-password"
                            onChange={(e) => {
                                setData("password", e.target.value);
                                setShowRules(true);
                            }}
                            inputMode="text"
                        />

                        {/* OJO */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 bottom-[9px] text-gray-600 dark:text-gray-300"
                        >
                            {showPassword ? (
                                <i className="bi bi-eye-slash-fill text-xl"></i>
                            ) : (
                                <i className="bi bi-eye-fill text-xl"></i>
                            )}
                        </button>

                        <InputError message={errors.password} className="mt-2" />

                        {showRules && (
                            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-black dark:text-gray-200 border border-gray-300/50">
                                <p className="font-semibold text-green-700 dark:text-emerald-300 mb-1">
                                    Requisitos:
                                </p>
                                <ul className="space-y-1">
                                    <li>• Mínimo 8 caracteres</li>
                                    <li>• 1 letra mayúscula</li>
                                    <li>• 1 letra minúscula</li>
                                    <li>• 1 número</li>
                                    <li>• 1 carácter especial (!@#$%^&*)</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* CONFIRMAR PASSWORD */}
                    <div className="relative">
                        <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" className="text-black" />

                        <TextInput
                            id="password_confirmation"
                            type={showPassword2 ? "text" : "password"}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full pr-10 text-black"
                            autoComplete="new-password"
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            inputMode="text"
                        />

                        {/* OJO */}
                        <button
                            type="button"
                            onClick={() => setShowPassword2(!showPassword2)}
                            className="absolute right-3 bottom-[9px] text-gray-600 dark:text-gray-300"
                        >
                            {showPassword2 ? (
                                <i className="bi bi-eye-slash-fill text-xl"></i>
                            ) : (
                                <i className="bi bi-eye-fill text-xl"></i>
                            )}
                        </button>

                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="pt-3">
                        <PrimaryButton
                            className="w-full justify-center py-3 text-base rounded-lg shadow-md bg-green-700 hover:bg-green-800 text-white active:scale-95"
                            disabled={processing}
                        >
                            {processing ? "Guardando..." : "Cambiar contraseña"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
