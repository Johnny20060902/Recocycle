import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Home({ auth }) {
  return (
    <>
      <Head title="Recocycle - Inicio" />

      <div
        className="min-h-screen flex flex-col justify-center items-center text-white relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/fondo-reciclaje.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#001a00",
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Overlay de color */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-green-900/40 to-black/95" />

        {/* CONTENIDO PRINCIPAL */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-[900px] w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* LOGO + TITULO */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <motion.img
              src="/images/logo-recocycle.png"
              alt="Logo Recocycle"
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-2 border-green-400 shadow-xl bg-white/40 p-1"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">
              <span className="text-green-400">RECO</span>
              <span className="text-yellow-300">CYCLE</span>
            </h1>
          </div>

          {/* FRASE */}
          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-xl mb-10 leading-relaxed italic px-4">
            “Cada botella, cada papel y cada acción cuenta.  
            Reciclar no cambia el mundo en un día,  
            pero sí cambia el día del mundo cada vez que lo haces.” ♻️
          </p>

          {/* CARD LOGIN */}
          <motion.div
            className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-green-600 shadow-2xl rounded-3xl px-6 py-8 sm:px-8 sm:py-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-green-300 mb-3">
              Iniciar sesión
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Ingresa al ecosistema{" "}
              <span className="text-green-400 font-semibold">Recocycle</span> y
              forma parte de una red que transforma residuos en esperanza 🌍
            </p>

            {/* BOTÓN LOGIN */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={route("login")}
                className="block w-full bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500 text-black font-semibold text-base rounded-full px-8 py-3 shadow-md hover:shadow-green-500/30 transition"
              >
                Entrar ahora
              </Link>
            </motion.div>

            {/* REGISTRO */}
            <div className="mt-6">
              <p className="text-gray-300 text-xs sm:text-sm">
                ¿Aún no tienes cuenta?
                <Link
                  href={route("register")}
                  className="ml-2 text-green-300 hover:text-green-400 underline font-semibold"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* SECCIÓN DE TARJETAS */}
        <motion.div
          className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-6 mt-16 w-full max-w-5xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {[
            {
              titulo: "♻ Clasifica",
              color: "text-green-300",
              desc: "Separa tus residuos en vidrio, plástico, cartón y más.",
            },
            {
              titulo: "🚛 Entrega",
              color: "text-yellow-300",
              desc: "Recolectores pasarán por tu zona y recogerán el material.",
            },
            {
              titulo: "🌱 Gana puntos",
              color: "text-blue-300",
              desc: "Acumula puntos y canjéalos por premios ecológicos.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-white/10 p-6 rounded-2xl backdrop-blur-lg hover:bg-white/20 shadow-lg transition-all transform hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <h2 className={`${item.color} font-bold text-xl mb-2`}>
                {item.titulo}
              </h2>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* FOOTER */}
        <footer className="relative z-10 mt-16 pb-5 text-xs sm:text-sm text-gray-400">
          © 2025 <strong>Recocycle</strong> — Todos los derechos reservados.
        </footer>
      </div>
    </>
  );
}
