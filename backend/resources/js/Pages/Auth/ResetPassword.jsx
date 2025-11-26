import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showRules, setShowRules] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Restablecer contraseña" />

            <div className="w-full max-w-md mx-auto bg-white/75 dark:bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-md animate__animated animate__fadeIn">

                <h1 className="text-2xl font-bold text-center text-green-700 dark:text-emerald-300 mb-4">
                    🔐 Crear nueva contraseña
                </h1>

                <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 text-center">
                    Ingresá tu nueva contraseña cumpliendo las reglas de seguridad ISO-27001.
                </p>

                <form onSubmit={submit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <InputLabel htmlFor="email" value="Correo electrónico" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            disabled
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Nueva contraseña */}
                    <div>
                        <InputLabel htmlFor="password" value="Nueva contraseña" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            isFocused={true}
                            onChange={(e) => {
                                setData('password', e.target.value);
                                setShowRules(true);
                            }}
                        />

                        <InputError message={errors.password} className="mt-2" />

                        {showRules && (
                            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs space-y-1 text-gray-700 dark:text-gray-300 border">
                                <p className="font-semibold text-green-700 dark:text-emerald-300 mb-1">
                                    Requisitos ISO-27001:
                                </p>
                                <ul className="space-y-1">
                                    <li>• Mínimo 8 caracteres</li>
                                    <li>• Al menos 1 letra mayúscula</li>
                                    <li>• Al menos 1 letra minúscula</li>
                                    <li>• Al menos 1 número</li>
                                    <li>• Al menos 1 carácter especial (!@#$%^&*)</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Confirmación */}
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirmar contraseña" />

                        <TextInput
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />

                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    {/* Botón */}
                    <div className="pt-2">
                        <PrimaryButton
                            className="w-full justify-center py-3 text-base rounded-lg shadow-sm active:scale-[0.97]"
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
