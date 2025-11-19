import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        if (!processing) {
            post(route("password.store"), {
                onFinish: () => reset("password", "password_confirmation"),
            });
        }
    };

    return (
        <GuestLayout>
            <Head title="Restablecer contraseña" />

            <div className="w-full max-w-md mx-auto bg-white/70 dark:bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-md animate__animated animate__fadeIn">
                <h1 className="text-2xl font-bold text-center text-green-700 dark:text-emerald-300 mb-5">
                    🔐 Restablecer contraseña
                </h1>

                <form onSubmit={submit} className="space-y-5">
                    {/* EMAIL */}
                    <div>
                        <InputLabel htmlFor="email" value="Correo electrónico" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* PASSWORD */}
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
                            onChange={(e) => setData("password", e.target.value)}
                            required
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirmar contraseña"
                        />

                        <TextInput
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    {/* BUTTON */}
                    <div className="pt-2">
                        <PrimaryButton
                            disabled={processing}
                            className="w-full justify-center py-3 text-base rounded-lg shadow-sm active:scale-[0.97] transition"
                        >
                            Restablecer contraseña
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
