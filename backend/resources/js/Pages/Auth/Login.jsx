import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import Checkbox from "@/Components/Checkbox";
import PrimaryButton from "@/Components/PrimaryButton";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Login({ status, canResetPassword, role = "usuario" }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!processing) {
            post(route("login"), {
                onFinish: () => reset("password"),
            });
        }
    };

    // 🎨 Paleta según el rol
    const colorConfig = {
        admin: {
            gradient: "from-emerald-900 via-green-800 to-emerald-950",
            accent: "text-emerald-300",
            button: "bg-emerald-600 hover:bg-emerald-700",
            ring: "focus:ring-emerald-400",
            title: "👑 Administrador",
            chip: "bg-emerald-700/60 text-emerald-100",
        },
        recolector: {
            gradient: "from-yellow-700 via-amber-600 to-yellow-800",
            accent: "text-yellow-200",
            button: "bg-yellow-500 hover:bg-yellow-600 text-black font-semibold",
            ring: "focus:ring-yellow-400",
            title: "🚛 Recolector",
            chip: "bg-amber-700/70 text-amber-100",
        },
        usuario: {
            gradient: "from-blue-800 via-cyan-700 to-blue-950",
            accent: "text-cyan-300",
            button: "bg-cyan-600 hover:bg-cyan-700 text-white",
            ring: "focus:ring-cyan-400",
            title: "👤 Usuario",
            chip: "bg-cyan-700/70 text-cyan-100",
        },
    };

    const { gradient, accent, button, ring, title, chip } =
        colorConfig[role] || colorConfig.usuario;

    return (
        <GuestLayout>
            <Head title={`Iniciar sesión - ${title}`} />

            <div
                className={`min-h-screen flex flex-col justify-center items-center bg-gradient-to-br ${gradient} relative overflow-hidden`}
            >
                {/* Fondo */}
                <div className="absolute inset-0 bg-[url('/images/fondo-reciclaje.jpg')] bg-cover bg-center opacity-25 blur-sm pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.15),transparent_45%),radial-gradient(circle_at_75%_80%,rgba(255,255,255,0.08),transparent_45%)] animate-pulse pointer-events-none" />

                {/* Tarjeta */}
                <motion.div
                    className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-white/20 text-center mx-3"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* LOGO */}
                    <motion.div
                        className="flex flex-col items-center mb-4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.img
                            src="/images/logo-recocycle.png"
                            alt="Logo Recocycle"
                            className="h-20 w-20 rounded-full border-2 border-white shadow-xl mb-3 mx-auto bg-white/60 p-1"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 2 }}
                        />
                        <span
                            className={`px-3 py-1 text-xs rounded-full uppercase tracking-wide ${chip}`}
                        >
                            Portal{" "}
                            {role === "admin"
                                ? "de gestión"
                                : role === "recolector"
                                ? "de recolección"
                                : "de usuario"}
                        </span>
                    </motion.div>

                    {/* Título */}
                    <h1 className={`text-3xl font-extrabold mb-1 ${accent}`}>
                        {title}
                    </h1>
                    <p className="text-gray-200/90 text-sm mb-6">
                        Bienvenido(a) a{" "}
                        <span className="font-semibold">Recocycle</span>.  
                        Inicia sesión para continuar.
                    </p>

                    {/* FORM */}
                    <form onSubmit={submit} className="w-full text-left space-y-4">
                        {/* Mensaje de estado */}
                        {status && (
                            <motion.div
                                className="mb-2 text-sm font-medium text-emerald-200 bg-emerald-900/50 border border-emerald-500/50 rounded-lg px-3 py-2 text-center"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {status}
                            </motion.div>
                        )}

                        {/* EMAIL */}
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Correo electrónico"
                                className="text-white"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={`mt-1 block w-full text-black rounded-lg border-0 shadow-sm focus:ring-2 ${ring}`}
                                autoComplete="username"
                                isFocused={true}
                                required
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="tucorreo@ejemplo.com"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2 text-red-300 text-xs"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <div className="flex items-center justify-between">
                                <InputLabel
                                    htmlFor="password"
                                    value="Contraseña"
                                    className="text-white"
                                />
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-xs text-gray-200 hover:text-white underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>

                            {/* Campo */}
                            <div className="relative mt-1">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className={`block w-full text-black rounded-lg border-0 shadow-sm pr-11 focus:ring-2 ${ring}`}
                                    autoComplete="current-password"
                                    required
                                    onChange={(e) => setData("password", e.target.value)}
                                    placeholder="••••••••"
                                />

                                {/* Botón ojo */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300 transition"
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7.523 20 3.732 17.057 2.458 12a10.052 10.052 0 0 1 2.223-3.56M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                                            <path d="M6.1 6.1A10 10 0 0 1 12 4c4.477 0 8.268 2.943 9.542 7a10.052 10.052 0 0 1-4.043 5.036" />
                                            <line x1="3" y1="3" x2="21" y2="21" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <InputError
                                message={errors.password}
                                className="mt-2 text-red-300 text-xs"
                            />
                        </div>

                        {/* REMEMBER */}
                        <label className="flex items-center text-gray-200 text-sm gap-2">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span>Recordarme</span>
                        </label>

                        {/* BOTONES */}
                        <div className="pt-4 flex flex-col gap-3">
                            <PrimaryButton
                                className={`${button} w-full px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2`}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></span>
                                        Ingresando...
                                    </>
                                ) : (
                                    "INGRESAR"
                                )}
                            </PrimaryButton>

                            <Link
                                href={route("home")}
                                className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-lg font-medium shadow-md transition hover:scale-[1.02] text-center"
                            >
                                ⬅ Volver al menú principal
                            </Link>
                        </div>

                        {/* Registro */}
                        {role === "usuario" && (
                            <p className="text-center text-sm text-gray-200 mt-5">
                                ¿No tienes cuenta?{" "}
                                <Link
                                    href={route("register")}
                                    className="text-yellow-300 hover:text-yellow-200 underline font-medium"
                                >
                                    Regístrate aquí
                                </Link>
                            </p>
                        )}
                    </form>

                    <footer className="mt-6 text-[11px] text-gray-300/80 text-center">
                        © 2025 <strong>Recocycle</strong> — Todos los derechos reservados.
                    </footer>
                </motion.div>
            </div>
        </GuestLayout>
    );
}
