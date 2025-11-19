export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden text-white">

            {/* 🌿 Fondo ambiental con degradado profesional */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to bottom right, rgba(0, 64, 32, 0.82), rgba(0, 48, 96, 0.82)),
                        url('/images/fondo-reciclaje.jpg')
                    `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(1.05) contrast(1.05)",
                    zIndex: 0,
                }}
            ></div>

            {/* ✨ Efecto ambiental suave PRO */}
            <div className="
                absolute inset-0 
                opacity-60
                pointer-events-none
                bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_55%), 
                    radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_65%)] 
                animate-[pulse_7s_ease-in-out_infinite]
            "></div>

            {/* 🌎 Caja principal (login/register) */}
            <main className="relative z-10 flex flex-col justify-center items-center w-full p-6">
                <div
                    className="
                        max-w-lg w-full 
                        flex flex-col justify-center items-center 
                        bg-black/30 backdrop-blur-xl
                        border border-white/20 
                        rounded-2xl 
                        shadow-[0_0_25px_rgba(0,0,0,0.45)]
                        py-10 px-6 sm:px-10
                        transition-all duration-500
                        hover:shadow-[0_0_35px_rgba(0,255,128,0.25)]
                    "
                    style={{
                        animation: "fadeIn 0.6s ease-out",
                    }}
                >
                    {children}
                </div>
            </main>

            {/* ♻️ Footer limpio */}
            <footer className="relative z-10 mt-10 text-xs sm:text-sm text-gray-300 text-center">
                <p className="opacity-80 tracking-wide">
                    Con cariño ecológico ♻️ — <span className="text-emerald-400 font-semibold">Recocycle</span>
                </p>
            </footer>
        </div>
    );
}
