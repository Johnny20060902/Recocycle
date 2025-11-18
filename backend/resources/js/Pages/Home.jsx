import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Home({ auth }) {
  return (
    <>
      <Head title="Recocycle - Inicio" />

      <div
        className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/fondo-reciclaje.jpg')",
          backgroundColor: "#001a00",
          backgroundBlendMode: "overlay",
        }}
      >
        {/* 🌌 Overlay ambiental */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-green-950/40 to-black/90 animate-fadeIn"></div>

        {/* ✳️ LOGO + TÍTULO */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.img
              src="/images/logo-recocycle.png"
              alt="Logo Recocycle"
              className="h-20 w-20 rounded-full border-2 border-green-400 shadow-2xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <h1 className="text-5xl font-extrabold drop-shadow-md">
              <span className="text-green-400">RECO</span>
              <span className="text-yellow-300">CYCLE</span>
            </h1>
          </div>

          {/* 🌱 Nueva frase motivadora */}
          <p className="text-lg max-w-2xl text-gray-200 mb-10 leading-relaxed italic">
            “Cada botella, cada papel y cada acción cuenta.
            Reciclar no cambia el mundo en un día,
            pero sí cambia el día del mundo cada vez que lo haces.” ♻️
          </p>

          {/* 🔐 LOGIN ÚNICO */}
          <motion.div
            className="bg-white/10 backdrop-blur-lg border border-green-600 shadow-xl rounded-3xl px-8 py-10 max-w-md w-[90%]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-green-300 mb-4">
              Iniciar sesión
            </h2>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Ingresa al ecosistema <span className="text-green-400 font-semibold">Recocycle</span>
              y forma parte de una red que transforma residuos en esperanza.
              Conecta, aporta y ayuda a construir un futuro más limpio 🌿
            </p>


            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href={route("login")}
                className="block bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500 text-black font-semibold text-lg rounded-full px-8 py-3 shadow-md hover:shadow-green-500/30 transition"
              >
                Entrar ahora
              </Link>
            </motion.div>

            <div className="mt-6">
              <p className="text-sm text-gray-400">
                ¿Aún no tienes cuenta?
                <Link
                  href={route("register")}
                  className="ml-2 text-green-300 hover:text-green-400 font-semibold underline decoration-dotted transition"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* 🌿 SECCIÓN INFORMATIVA */}
        <motion.div
          className="relative z-10 grid md:grid-cols-3 gap-8 px-8 mt-20 max-w-5xl text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {[
            {
              titulo: "♻ Clasifica",
              color: "text-green-300",
              desc: "Separa tus residuos en vidrio, plástico, cartón, electrónicos y más.",
            },
            {
              titulo: "🚛 Entrega",
              color: "text-yellow-300",
              desc: "Nuestros recolectores pasarán por tu zona y recogerán el material de forma segura.",
            },
            {
              titulo: "🌱 Gana puntos",
              color: "text-blue-300",
              desc: "Acumula puntos y canjéalos por premios o descuentos ecológicos.",
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
              <p className="text-gray-200 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 🌍 FOOTER */}
        <footer className="relative z-10 mt-20 text-sm text-gray-400 mb-4">
          © 2025 <strong>Recocycle</strong> — Todos los derechos reservados.
        </footer>
      </div>
    </>
  );
}
