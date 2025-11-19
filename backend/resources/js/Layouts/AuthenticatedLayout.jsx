import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showNav, setShowNav] = useState(false);

    // ==========================
    // DARK MODE (igual que tu App principal)
    // ==========================
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("recocycleTheme") === "dark"
    );

    useEffect(() => {
        document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
        localStorage.setItem("recocycleTheme", darkMode ? "dark" : "light");
    }, [darkMode]);

    return (
        <div
            className={`min-h-screen ${
                darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100"
            }`}
        >
            {/* ========================= NAVBAR PRINCIPAL ========================= */}
            <nav
                className={`border-b ${
                    darkMode
                        ? "border-gray-800 bg-gray-950"
                        : "border-gray-200 bg-white"
                } shadow-sm`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* ---------- LOGO + LINKS ---------- */}
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo
                                        className="block h-9 w-auto fill-current text-emerald-600"
                                    />
                                </Link>
                            </div>

                            <div className="hidden sm:ms-10 sm:flex space-x-8">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        {/* ---------- PARTE DERECHA - PERFIL ---------- */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            {/* Toggle Dark Mode */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="me-4 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                title="Cambiar tema"
                            >
                                {darkMode ? (
                                    <i className="bi bi-moon-stars-fill"></i>
                                ) : (
                                    <i className="bi bi-brightness-high-fill"></i>
                                )}
                            </button>

                            {/* Dropdown usuario */}
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition ${
                                                    darkMode
                                                        ? "text-gray-200 hover:text-white"
                                                        : "text-gray-600 hover:text-gray-900"
                                                }`}
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route("profile.edit")}>
                                            Perfil
                                        </Dropdown.Link>

                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Cerrar sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* ---------- BOTÓN HAMBURGUESA ---------- */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowNav(!showNav)}
                                className={`inline-flex items-center justify-center rounded-md p-2 transition ${
                                    darkMode
                                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                }`}
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={showNav ? "hidden" : "inline-flex"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showNav ? "inline-flex" : "hidden"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ========================= NAV RESPONSIVE ========================= */}
                {showNav && (
                    <div className="sm:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>

                        <div
                            className={`border-t pb-1 pt-4 ${
                                darkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                        >
                            <div className="px-4">
                                <div
                                    className={`text-base font-medium ${
                                        darkMode ? "text-gray-100" : "text-gray-800"
                                    }`}
                                >
                                    {user.name}
                                </div>
                                <div
                                    className={`text-sm font-medium ${
                                        darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}
                                >
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>
                                    Perfil
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Cerrar sesión
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* ========================= HEADER INTERNO ========================= */}
            {header && (
                <header
                    className={`shadow ${
                        darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                >
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* ========================= CONTENIDO ========================= */}
            <main className={`${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                {children}
            </main>
        </div>
    );
}
