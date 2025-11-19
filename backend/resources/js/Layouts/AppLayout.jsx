import { Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";

export default function AppLayout({ title, children, auth }) {
  const { post } = useForm();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("recocycleTheme") === "dark"
  );

  // 📱 Sidebar responsivo
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🌙 Persistencia modo oscuro
  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("recocycleTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 🔐 Logout
  const handleLogout = (e) => {
    e.preventDefault();
    post(route("logout"));
  };

  // 🧭 Rol actual
  const role = auth?.user?.role || "usuario";
  console.log("ROL DETECTADO:", role, auth?.user);

  const roleLabel =
    role === "admin"
      ? "Administrador del sistema 👑"
      : role === "usuario"
        ? "Usuario activo 🌱"
        : "Recolector activo 🚛";

  // 🧩 Menús por rol
  const menuByRole = {
    admin: [
      { name: "Dashboard", route: "admin.dashboard", icon: "bi bi-speedometer2 text-info" },
      { name: "Recolectores", route: "admin.empresas.index", icon: "bi bi-building text-warning" },
      { name: "Usuarios", route: "admin.usuarios.index", icon: "bi bi-people-fill text-primary" },
      { name: "Reportes", route: "admin.reportes.index", icon: "bi bi-bar-chart-line-fill text-warning" },
      { name: "Ranking", route: "admin.ranking.index", icon: "bi bi-trophy-fill text-warning" },
      { name: "Premios", route: "admin.premios.index", icon: "bi bi-award-fill text-success" },
      { name: "Categorías", route: "admin.categorias.index", icon: "bi bi-tags-fill text-success" },
    ],
    usuario: [
      { name: "Dashboard", route: "usuario.dashboard", icon: "bi bi-house text-info" },
      { name: "Reciclar", route: "usuario.reciclar", icon: "bi bi-recycle text-success" },
      { name: "Mis Reciclajes", route: "usuario.reciclajes.index", icon: "bi bi-box2-heart text-primary" },
      { name: "Ranking", route: "usuario.ranking", icon: "bi bi-trophy-fill text-warning" },
      { name: "Premios", route: "usuario.premios", icon: "bi bi-gift-fill text-success" },
    ],
    recolector: [
      { name: "Dashboard", route: "recolector.dashboard", icon: "bi bi-map text-info" },
      { name: "Rutas", route: "recolector.rutas", icon: "bi bi-signpost-2 text-success" },
      { name: "Historial", route: "recolector.historial", icon: "bi bi-clock-history text-warning" },
      { name: "Ranking", route: "recolector.ranking", icon: "bi bi-trophy-fill text-primary" },
    ],
  };
  const menu = menuByRole[role] || [];

  // ⚡ Alertas globales
  useEffect(() => {
    const flash = window?.page?.props?.flash;
    if (flash?.success) {
      Swal.fire({
        icon: "success",
        title: "♻️ Éxito",
        text: flash.success,
        confirmButtonColor: "#00c896",
      });
    } else if (flash?.error) {
      Swal.fire({
        icon: "error",
        title: "❌ Error",
        text: flash.error,
        confirmButtonColor: "#e63946",
      });
    }
  }, []);

  return (
    <div
      className={`d-flex ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        transition: "background 0.3s ease",
      }}
    >
      {/* ======= SIDEBAR IZQUIERDO ======= */}
      {sidebarOpen && (
        <aside
          className="p-3 position-fixed top-0 start-0 h-100 shadow-lg text-white"
          style={{
            width: "250px",
            background: "linear-gradient(180deg, #0b132b 0%, #1c2541 100%)",
            zIndex: 1040,
            borderRight: "1px solid rgba(255,255,255,0.1)",
            overflowY: "auto",
          }}
        >
          <div className="text-center mb-4">
            <img
              src="/images/logo-recocycle.png"
              alt="Logo"
              className="rounded-circle mb-3 bg-white p-1 shadow-sm"
              style={{
                height: "70px",
                width: "70px",
                objectFit: "cover",
                border: "2px solid #00c896",
              }}
            />
            <h6 className="fw-bold text-info mb-0">
              {auth?.user?.nombres} {auth?.user?.apellidos}
            </h6>
            <small className="opacity-75">{roleLabel}</small>
          </div>

          <ul className="nav flex-column gap-2">
            {menu.map((item) => (
              <li key={item.name}>
                <Link
                  href={route(item.route)}
                  className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${route().current(item.route)
                    ? "bg-success text-white shadow-sm"
                    : "text-white opacity-90 hover-glow"
                    }`}
                  style={{ transition: "all 0.2s ease", fontWeight: "500" }}
                >
                  <i className={`${item.icon} fs-5`}></i>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            <hr className="border-light opacity-25 my-3" />
            <li>
              <form onSubmit={handleLogout}>
                <button
                  type="submit"
                  className="btn btn-outline-danger w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Cerrar sesión</span>
                </button>
              </form>
            </li>
          </ul>
        </aside>
      )}

      {/* ======= CONTENEDOR DERECHA ======= */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: sidebarOpen ? "250px" : "0", transition: "margin 0.3s ease" }}
      >
        {/* ======= NAVBAR SUPERIOR ======= */}
        <nav
          className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top d-flex align-items-center"
          style={{
            background: darkMode
              ? "linear-gradient(90deg, #0b0b0b 0%, #1a1a1a 100%)"
              : "linear-gradient(90deg, #0066ff 0%, #00d4a1 100%)",
            height: "70px",
            zIndex: 1060,
          }}
        >
          <div className="container-fluid d-flex justify-content-between align-items-center px-4">
            {/* BOTÓN HAMBURGUESA */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-light border-0 d-flex align-items-center justify-content-center me-3"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}
              title="Mostrar / Ocultar menú"
            >
              <i className="bi bi-list text-primary fs-5"></i>
            </button>

            {/* LOGO + TÍTULO */}
            <div className="d-flex align-items-center gap-2 mx-auto">
              <img
                src="/images/logo-recocycle.png"
                alt="Recocycle"
                className="rounded-circle bg-white p-1 shadow-sm"
                style={{ height: "45px", width: "45px", border: "2px solid white" }}
              />
              <h5
                className="text-white fw-semibold mb-0"
                style={{
                  fontSize: "1.1rem",
                  letterSpacing: "0.4px",
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}
              >
                {title || "Dashboard del Administrador"}
              </h5>
            </div>

            {/* SWITCH Y BOTÓN SALIR */}
            <div className="d-flex align-items-center gap-3">
              <label className="theme-switch mb-0">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider round"></span>
              </label>

              <form onSubmit={handleLogout}>
                <button
                  type="submit"
                  className="btn btn-light d-flex align-items-center gap-2 px-3 py-2 border shadow-sm"
                  style={{
                    borderRadius: "50px",
                    color: "#007aff",
                    fontWeight: "500",
                    borderColor: "rgba(0,0,0,0.1)",
                    background: "#ffffff",
                  }}
                >
                  <i className="bi bi-box-arrow-right fs-5"></i> Salir
                </button>
              </form>
            </div>
          </div>
        </nav>

        {/* ======= CONTENIDO PRINCIPAL ======= */}
        <main className="flex-grow-1 p-4" style={{ minHeight: "calc(100vh - 70px)" }}>
          {children}
        </main>

        {/* ======= FOOTER ======= */}
        <footer
          className={`text-center py-3 shadow-sm border-top ${darkMode ? "bg-dark text-secondary border-secondary" : "bg-white text-muted"
            }`}
        >
          <small>
            © {new Date().getFullYear()} <strong>Recocycle</strong> — Plataforma ecológica integral ♻️
            <br />
            <span className="small">Hecho con 💚 en Bolivia</span>
          </small>
        </footer>
      </div>

      {/* ======= ESTILOS EXTRA ======= */}
      <style>{`
        .hover-glow:hover {
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
        }
        .theme-switch {
          position: relative;
          display: inline-block;
          width: 50px;
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
          background-color: #007aff;
        }
        input:checked + .slider:before {
          transform: translateX(24px);
        }
        body[data-theme="dark"],
        .bg-dark {
          background-color: #0e0e0e !important;
          color: #f5f5f5 !important;
        }
      `}</style>
    </div>
  );
}
