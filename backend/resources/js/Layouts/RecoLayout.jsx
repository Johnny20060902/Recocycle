import { Head, Link } from "@inertiajs/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function RecoLayout({ title, children, auth }) {
    const role = auth?.user?.role;

    return (
        <>
            <Head title={title} />

            {/* ========== NAVBAR PRO ========== */}
            <nav
                className="navbar navbar-expand-lg shadow-sm sticky-top"
                style={{
                    background:
                        "linear-gradient(90deg, #0f5132 0%, #198754 50%, #20c997 100%)",
                }}
            >
                <div className="container-fluid px-4">
                    {/* Logo */}
                    <Link className="navbar-brand fw-bold text-white d-flex align-items-center gap-2" href="/">
                        <i className="bi bi-recycle fs-4"></i>
                        <span>Recocycle</span>
                    </Link>

                    {/* Botón hamburguesa */}
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#recoNavbar"
                    >
                        <i className="bi bi-list text-white fs-2"></i>
                    </button>

                    {/* Enlaces */}
                    <div className="collapse navbar-collapse" id="recoNavbar">
                        <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3 mt-3 mt-lg-0">

                            {/* Inicio */}
                            <li className="nav-item">
                                <Link
                                    href={route("dashboard")}
                                    className="nav-link text-white fw-semibold d-flex align-items-center gap-1"
                                >
                                    <i className="bi bi-house-door"></i>
                                    Inicio
                                </Link>
                            </li>

                            {/* Ranking (cambia según rol) */}
                            <li className="nav-item">
                                <Link
                                    href={
                                        role === "recolector"
                                            ? route("recolector.ranking")
                                            : route("usuario.ranking")
                                    }
                                    className="nav-link text-white fw-semibold d-flex align-items-center gap-1"
                                >
                                    <i className="bi bi-bar-chart-line"></i>
                                    Ranking
                                </Link>
                            </li>

                            {/* Logout */}
                            <li className="nav-item">
                                <Link
                                    method="post"
                                    href={route("logout")}
                                    className="nav-link text-white fw-semibold d-flex align-items-center gap-1"
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    Cerrar sesión
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* ========== CONTENIDO ========== */}
            <main className="container py-4">
                <div className="animate__animated animate__fadeIn">
                    {children}
                </div>
            </main>

            {/* ========== FOOTER PRO ========== */}
            <footer className="bg-light text-center py-3 mt-5 shadow-sm">
                <small className="text-muted">
                    © {new Date().getFullYear()} <strong>Recocycle</strong> — Hecho con 💚 en Bolivia
                </small>
            </footer>

            {/* ========== HOVER Y DETALLES EXTRAS ========== */}
            <style>{`
                .nav-link:hover {
                    text-shadow: 0 0 6px rgba(255,255,255,0.4);
                    transform: translateY(-1px);
                    transition: all 0.2s ease-in-out;
                }
            `}</style>
        </>
    );
}
