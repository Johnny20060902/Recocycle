import { Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";

export default function UserLayout({ title, children, auth }) {
  const { post } = useForm();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("userTheme") === "dark"
  );

  /* ========================= 🧩 MODE RESPONSIVO ========================= */
  useEffect(() => {
    const resize = () => setSidebarOpen(window.innerWidth >= 992);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ========================= 🌙 MODO OSCURO ========================= */
  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("userTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ========================= 🔐 LOGOUT ========================= */
  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Salir?",
      text: "Tu sesión será cerrada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c896",
      cancelButtonColor: "gray",
      confirmButtonText: "Sí, salir",
    }).then((res) => {
      if (res.isConfirmed) post(route("logout"));
    });
  };

  /* ========================= ⚡ FLASH MESSAGES ========================= */
  useEffect(() => {
    const flash = window?.page?.props?.flash;
    if (flash?.success) {
      Swal.fire({
        icon: "success",
        title: "♻️ ¡Genial!",
        text: flash.success,
        timer: 2500,
        showConfirmButton: false,
      });
    }
    if (flash?.error) {
      Swal.fire({
        icon: "error",
        title: "❌ Error",
        text: flash.error,
        confirmButtonColor: "#ff4d4f",
      });
    }
  }, []);

  /* ========================= 🧭 MENÚ USUARIO ========================= */
  const menu = [
    {
      name: "Inicio",
      route: "usuario.dashboard",
      icon: "bi bi-house-heart-fill text-success",
    },
    {
      name: "Mis puntos",
      route: "usuario.puntos",
      icon: "bi bi-gem text-warning",
    },
    {
      name: "Reciclar Ahora",
      route: "usuario.reciclar",
      icon: "bi bi-arrow-repeat text-success animate-eco",
    },
    {
      name: "Mis Reciclajes",
      route: "usuario.reciclajes.index",
      icon: "bi bi-journal-check text-info",
    },
    {
      name: "Premios",
      route: "usuario.premios",
      icon: "bi bi-gift text-danger",
    },
    {
      name: "Ranking",
      route: "usuario.ranking",
      icon: "bi bi-trophy text-primary",
    },
  ];

  return (
    <div
      className={`d-flex ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
      style={{
        minHeight: "100vh",
        transition: "background 0.3s ease, color 0.3s ease",
        overflowX: "hidden",
      }}
    >
      {/* ========================= 🟩 SIDEBAR ========================= */}
      {sidebarOpen && (
        <aside
          className="p-3 position-fixed top-0 start-0 h-100 shadow-lg"
          style={{
            width: "250px",
            zIndex: 1040,
            background: "linear-gradient(180deg, #0b3d2e 0%, #006d44 100%)",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            overflowY: "auto",
          }}
        >
          {/* Perfil */}
          <div className="text-center mb-4">
            <img
              src="/images/logo-recocycle.png"
              alt="Usuario"
              className="rounded-circle mb-3 bg-white p-1 shadow-sm"
              style={{
                height: "70px",
                width: "70px",
                objectFit: "cover",
                border: "2px solid #00c896",
              }}
            />
            <h6 className="fw-bold text-light mb-0">
              {auth?.user?.nombres} {auth?.user?.apellidos}
            </h6>
            <small className="opacity-75">Usuario ecológico 🌿</small>
          </div>

          {/* Menú */}
          <ul className="nav flex-column gap-2">
            {menu.map((item) => (
              <li key={item.name}>
                <Link
                  href={route(item.route)}
                  className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${
                    route().current(item.route)
                      ? "bg-success text-white shadow-sm"
                      : "text-white opacity-90 hover-glow"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  <i className={`${item.icon} fs-5`}></i>
                  {item.name}
                </Link>
              </li>
            ))}

            <hr className="border-light opacity-25 my-3" />

            <li>
              <button
                onClick={handleLogout}
                className="btn btn-outline-light w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                <i className="bi bi-box-arrow-right"></i> Salir
              </button>
            </li>
          </ul>
        </aside>
      )}

      {/* ========================= 🟢 PANEL PRINCIPAL ========================= */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: sidebarOpen ? "250px" : "0",
          transition: "margin 0.3s ease",
        }}
      >
        {/* ========================= NAVBAR ========================= */}
        <nav
          className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top"
          style={{
            height: "70px",
            zIndex: 1060,
            background: darkMode
              ? "linear-gradient(90deg, #0b3d2e 0%, #005933 100%)"
              : "linear-gradient(90deg, #009e60 0%, #00d4a1 100%)",
          }}
        >
          <div className="container-fluid d-flex justify-content-between align-items-center px-4">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-light border-0 me-3"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}
            >
              <i className="bi bi-list text-success fs-5"></i>
            </button>

            {/* Logo */}
            <div className="d-flex align-items-center gap-2 mx-auto">
              <img
                src="/images/logo-recocycle.png"
                className="rounded-circle bg-white p-1 shadow-sm"
                style={{ height: "45px", width: "45px" }}
              />
              <h5 className="text-white fw-semibold mb-0">
                {title || "Panel del Usuario"}
              </h5>
            </div>

            {/* Switch mode */}
            <label className="theme-switch mb-0">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </nav>

        {/* ========================= CONTENIDO ========================= */}
        <main
          className="flex-grow-1 p-4"
          style={{
            height: "calc(100vh - 70px)",
            overflowY: "auto",
            background: darkMode ? "#0b0b0b" : "#f8f9fa",
          }}
        >
          {children}
        </main>

        {/* ========================= FOOTER ========================= */}
        <footer
          className={`text-center py-3 shadow-sm border-top ${
            darkMode ? "bg-dark text-secondary" : "bg-white text-muted"
          }`}
        >
          <small>
            © {new Date().getFullYear()} <strong>Recocycle</strong> — Unidos por un planeta más limpio ♻️
            <br />
            <span className="small">Hecho con 💚 en Bolivia</span>
          </small>
        </footer>
      </div>

      {/* ========================= 🎨 ESTILOS EXTRA ========================= */}
      <style>{`
        .hover-glow:hover {
          background: rgba(255,255,255,0.1);
          box-shadow: 0 0 8px rgba(255,255,255,0.25);
        }
        .theme-switch {
          position: relative;
          width: 50px;
          height: 26px;
          display: inline-block;
        }
        .theme-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background: #ccc;
          border-radius: 34px;
          transition: 0.4s;
        }
        .slider:before {
          content: "";
          position: absolute;
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.4s;
        }
        input:checked + .slider {
          background: #00c896;
        }
        input:checked + .slider:before {
          transform: translateX(24px);
        }

        /* 🌿 Animación botón Reciclar */
        .animate-eco {
          animation: ecoPulse 3s ease-in-out infinite;
        }
        @keyframes ecoPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(0,255,150,0)); }
          50% { transform: scale(1.18); filter: drop-shadow(0 0 6px rgba(0,255,150,0.6)); }
        }
      `}</style>
    </div>
  );
}
