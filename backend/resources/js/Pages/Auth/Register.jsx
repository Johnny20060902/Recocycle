import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import "animate.css";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombres: "",
        apellidos: "",
        telefono: "",
        genero: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registro de Usuario" />

            <div className="w-full max-w-2xl bg-white/10 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mx-auto animate__animated animate__fadeIn">
                <h1 className="text-3xl font-bold text-center text-emerald-400 mb-6 drop-shadow-md">
                    ♻️ Registro de Usuario
                </h1>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    {/* Nombres */}
                    <div>
                        <InputLabel
                            htmlFor="nombres"
                            value="Nombres"
                            className="text-white"
                        />
                        <TextInput
                            id="nombres"
                            name="nombres"
                            value={data.nombres}
                            className="mt-1 block w-full text-black rounded-lg shadow-inner"
                            onChange={(e) => setData("nombres", e.target.value)}
                            required
                        />
                        <InputError message={errors.nombres} className="mt-2 text-red-300" />
                    </div>

                    {/* Apellidos */}
                    <div>
                        <InputLabel
                            htmlFor="apellidos"
                            value="Apellidos"
                            className="text-white"
                        />
                        <TextInput
                            id="apellidos"
                            name="apellidos"
                            value={data.apellidos}
                            className="mt-1 block w-full text-black rounded-lg shadow-inner"
                            onChange={(e) => setData("apellidos", e.target.value)}
                            required
                        />
                        <InputError message={errors.apellidos} className="mt-2 text-red-300" />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <InputLabel
                            htmlFor="telefono"
                            value="Teléfono"
                            className="text-white"
                        />
                        <TextInput
                            id="telefono"
                            name="telefono"
                            value={data.telefono}
                            className="mt-1 block w-full text-black rounded-lg shadow-inner"
                            onChange={(e) => setData("telefono", e.target.value)}
                        />
                        <InputError message={errors.telefono} className="mt-2 text-red-300" />
                    </div>

                    {/* Género */}
                    <div>
                        <InputLabel
                            htmlFor="genero"
                            value="Género"
                            className="text-white"
                        />
                        <select
                            id="genero"
                            name="genero"
                            value={data.genero}
                            onChange={(e) => setData("genero", e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-black shadow-inner"
                            required
                        >
                            <option value="">Seleccione una opción</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="No especificado">No especificado</option>
                        </select>
                        <InputError message={errors.genero} className="mt-2 text-red-300" />
                    </div>

                    {/* Correo */}
                    <div className="md:col-span-2">
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
                            className="mt-1 block w-full text-black rounded-lg shadow-inner"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2 text-red-300" />
                    </div>

                    {/* Contraseña */}
                    <div className="relative">
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="text-white"
                        />
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                required
                                className="mt-1 block w-full text-black rounded-lg shadow-inner pr-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-emerald-500 transition"
                            >
                                <i
                                    className={`bi ${
                                        showPassword
                                            ? "bi-eye-fill"
                                            : "bi-eye-slash-fill"
                                    }`}
                                ></i>
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-2 text-red-300" />
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="relative">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirmar contraseña"
                            className="text-white"
                        />
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData("password_confirmation", e.target.value)
                                }
                                required
                                className="mt-1 block w-full text-black rounded-lg shadow-inner pr-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-emerald-500 transition"
                            >
                                <i
                                    className={`bi ${
                                        showConfirmPassword
                                            ? "bi-eye-fill"
                                            : "bi-eye-slash-fill"
                                    }`}
                                ></i>
                            </button>
                        </div>
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2 text-red-300"
                        />
                    </div>

                    {/* Botones */}
                    <div className="md:col-span-2 flex justify-between mt-6">
                        <Link
                            href={route("home")}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition transform hover:scale-105"
                        >
                            Cancelar
                        </Link>

                        <PrimaryButton
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition transform hover:scale-105"
                            disabled={processing}
                        >
                            Guardar
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
