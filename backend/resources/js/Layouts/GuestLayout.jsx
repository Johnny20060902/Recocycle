export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden text-white">
            
            {/* 🌿 Fondo natural con degradado limpio */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to bottom right, rgba(0, 64, 32, 0.85), rgba(0, 48, 96, 0.85)),
                        url('/images/fondo-reciclaje.jpg')
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(1.1) contrast(1.05)',
                    zIndex: 0,
                }}
            ></div>

            {/* ✨ Efecto ambiental muy sutil */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.1),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05),transparent_70%)] opacity-70 animate-[pulse_6s_ease-in-out_infinite]"></div>

            {/* 🌎 Contenedor principal */}
            <main className="relative z-10 flex flex-col justify-center items-center w-full p-6">
                <div className="max-w-lg w-full flex flex-col justify-center items-center bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.4)] py-10 px-6 sm:px-10 transition-all duration-500 hover:shadow-[0_0_35px_rgba(0,255,128,0.25)]">
                    {children}
                </div>
            </main>

            {/* ♻️ Footer */}
            <footer className="relative z-10 mt-10 text-xs sm:text-sm text-gray-300 text-center">
                <p className="opacity-80 tracking-wide">
                    Hecho con <span className="text-emerald-400 font-semibold">♻️ amor por Recocycle</span>
                </p>
            </footer>
        </div>
    );
}
