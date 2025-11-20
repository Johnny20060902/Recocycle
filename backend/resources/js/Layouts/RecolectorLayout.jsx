import { Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function RecolectorLayout({ title, children, auth }) {
  const { post } = useForm();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("recolectorTheme") === "dark"
  );

  // 📱 Sidebar responsivo
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🌙 Modo oscuro persistente
  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("recolectorTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 🔐 Logout
  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión será cerrada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0078ff",
      cancelButtonColor: "#999",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) post(route("logout"));
    });
  };

  // ⚡ Flash messages (éxito / error)
  useEffect(() => {
    const flash = window?.page?.props?.flash;
    if (flash?.success) {
      Swal.fire({
        icon: "success",
        title: "🚛 Éxito",
        text: flash.success,
        timer: 2500,
        showConfirmButton: false,
      });
    } else if (flash?.error) {
      Swal.fire({
        icon: "error",
        title: "❌ Error",
        text: flash.error,
        confirmButtonColor: "#ff4d4f",
      });
    }
  }, []);

  // 🧭 Menú lateral
  const menu = [
    { name: "Inicio", route: "recolector.dashboard", icon: "bi bi-house-door-fill text-info" },
    { name: "Mapa de Recolección", route: "recolector.mapa", icon: "bi bi-map-fill text-success" },
    { name: "Historial", route: "recolector.historial", icon: "bi bi-clock-history text-warning" },
    { name: "Ranking", route: "recolector.ranking", icon: "bi bi-trophy-fill text-light" },
  ];

  return (
    <div
      className={`d-flex ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      {/* ===== SIDEBAR ===== */}
      {sidebarOpen && (
        <aside
          className="p-3 position-fixed top-0 start-0 h-100 shadow-lg text-white"
          style={{
            width: "250px",
            background: "linear-gradient(180deg, #001f3f 0%, #0066a3 100%)",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            zIndex: 1040,
          }}
        >
          <div className="text-center mb-4">
            <img
              src="/images/logo-recocycle.png"
              alt="Recolector"
              className="rounded-circle mb-3 bg-white p-1 shadow-sm"
              style={{
                height: "70px",
                width: "70px",
                objectFit: "cover",
                border: "2px solid #00b4ff",
              }}
            />
            <h6 className="fw-bold text-info mb-0 text-truncate">
              {auth?.user?.nombres} {auth?.user?.apellidos}
            </h6>
            <small className="opacity-75">Recolector activo 🧤</small>
          </div>

          <ul className="nav flex-column gap-2">
            {menu.map((item) => (
              <li key={item.name}>
                <Link
                  href={route(item.route)}
                  className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${route().current(item.route)
                      ? "bg-info text-white shadow-sm"
                      : "text-white opacity-85 hover-glow"
                    }`}
                  style={{
                    transition: "all 0.2s ease",
                    fontWeight: 500,
                  }}
                >
                  <i className={`${item.icon} fs-5`}></i>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            <hr className="border-light opacity-25 my-3" />
            <li>
              <button
                onClick={handleLogout}
                className="btn btn-outline-light w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Salir</span>
              </button>
            </li>
          </ul>
        </aside>
      )}

      {/* ===== CONTENEDOR PRINCIPAL ===== */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: sidebarOpen ? "250px" : "0",
          transition: "margin 0.3s ease",
        }}
      >
        {/* ===== NAVBAR ===== */}
        <nav
          className={`navbar navbar-expand-lg shadow-sm sticky-top ${darkMode ? "navbar-dark" : "navbar-light"
            }`}
          style={{
            background: darkMode
              ? "linear-gradient(90deg, #000c1a 0%, #002a4d 100%)"
              : "linear-gradient(90deg, #00b4ff 0%, #0078ff 100%)",
            height: "70px",
          }}
        >
          <div className="container-fluid d-flex justify-content-between align-items-center px-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-light border-0 me-3"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}
              title="Mostrar / Ocultar menú"
            >
              <i className="bi bi-list text-info fs-5"></i>
            </button>

            <div className="d-flex align-items-center gap-2 mx-auto">
              <img
                src="/images/logo-recocycle.png"
                alt="Logo"
                className="rounded-circle bg-white p-1 shadow-sm"
                style={{
                  height: "45px",
                  width: "45px",
                  border: "2px solid white",
                }}
              />
              <h5
                className="text-white fw-semibold mb-0"
                style={{
                  fontSize: "1.1rem",
                  letterSpacing: "0.4px",
                }}
              >
                {title || "Panel del Recolector"}
              </h5>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* Switch Dark Mode */}
              <label className="theme-switch mb-0">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  aria-label="Alternar modo oscuro"
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </nav>

        {/* ===== CONTENIDO ===== */}
        <main
          className="flex-grow-1 p-4"
          style={{
            minHeight: "calc(100vh - 70px)",
            background: darkMode ? "#0b0b0b" : "#f8f9fa",
          }}
        >
          {children}
        </main>

        {/* ===== FOOTER ===== */}
        <footer
          className={`text-center py-3 shadow-sm border-top ${darkMode
              ? "bg-dark text-secondary border-secondary"
              : "bg-white text-muted"
            }`}
        >
          <small>
            © {new Date().getFullYear()} <strong>Recocycle</strong> — Unidos por un planeta limpio 🌎
            <br />
            <span className="small">Hecho con 💙 por el equipo de recolectores</span>
          </small>
        </footer>
      </div>

      {/* ===== ESTILOS ===== */}
      <style>{`
        .hover-glow:hover {
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
        }
        .theme-switch {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 26px;
        }
        .theme-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #00b4ff;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
      `}</style>
    </div>
  );
}
