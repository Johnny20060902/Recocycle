/* global route */

import { useForm, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

export default function Edit({ auth, usuario }) {
    // Normalizar estado para registros viejos
    const normalizarEstado = (raw) => {
        if (raw === true) return "activo";
        if (raw === false) return "inactivo";
        if (["activo", "inactivo", "pendiente"].includes(raw)) return raw;
        return "activo";
    };

    const { data, setData, put, processing, errors } = useForm({
        nombres: usuario?.nombres ?? "",
        apellidos: usuario?.apellidos ?? "",
        email: usuario?.email ?? "",
        role: usuario?.role ?? "usuario",
        estado: normalizarEstado(usuario?.estado),

        // 🔐 NUEVO: campos ISO
        password: "",
        password_confirmation: "",
    });

    const [darkMode, setDarkMode] = useState(
        document.body.getAttribute("data-theme") === "dark"
    );
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // Detectar cambios en modo oscuro
    useEffect(() => {
        const observer = new MutationObserver(() =>
            setDarkMode(document.body.getAttribute("data-theme") === "dark")
        );
        observer.observe(document.body, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const secondaryText = darkMode ? "#bdbdbd" : "#555";
    const cardBg = darkMode ? "#181818" : "#ffffff";
    const textColor = darkMode ? "#eaeaea" : "#222";

    // Guardar cambios
    const handleSubmit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: "¿Guardar cambios?",
            text: "Los datos del usuario serán actualizados.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#00c896",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Cancelar",
        }).then((res) => {
            if (res.isConfirmed) {
                put(route("admin.usuarios.update", usuario.id), {
                    preserveScroll: true,
                    onSuccess: () =>
                        Swal.fire("✅ Éxito", "Usuario actualizado.", "success"),
                    onError: () =>
                        Swal.fire("❌ Error", "No se pudo actualizar.", "error"),
                });
            }
        });
    };

    return (
        <AppLayout title="Editar Usuario" auth={auth}>
            <div className="container py-4 animate__animated animate__fadeInUp">

                {/* ENCABEZADO */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                    <div>
                        <h2
                            className="fw-bold mb-1"
                            style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
                        >
                            ✏️ Editar Usuario
                        </h2>
                        <p className="mb-0" style={{ color: secondaryText }}>
                            Modifica la información del usuario seleccionado.
                        </p>
                    </div>

                    <Link
                        href={route("admin.usuarios.index")}
                        className="btn btn-outline-secondary rounded-pill shadow-sm fw-semibold d-flex align-items-center gap-2 mt-3 mt-md-0"
                    >
                        <i className="bi bi-arrow-left-circle"></i> Volver al listado
                    </Link>
                </div>

                {/* FORMULARIO */}
                <div
                    className="card border-0 shadow-lg rounded-4 p-4"
                    style={{
                        background: cardBg,
                        color: textColor,
                        transition: "all 0.3s ease",
                    }}
                >
                    <form onSubmit={handleSubmit}>

                        <div className="row g-4">

                            {/* NOMBRES */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Nombres</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-lg rounded-3 ${
                                        errors.nombres ? "is-invalid" : ""
                                    }`}
                                    value={data.nombres}
                                    onChange={(e) => setData("nombres", e.target.value)}
                                    placeholder="Ej: Santiago"
                                />
                                {errors.nombres && (
                                    <div className="invalid-feedback">{errors.nombres}</div>
                                )}
                            </div>

                            {/* APELLIDOS */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Apellidos</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-lg rounded-3 ${
                                        errors.apellidos ? "is-invalid" : ""
                                    }`}
                                    value={data.apellidos}
                                    onChange={(e) => setData("apellidos", e.target.value)}
                                    placeholder="Ej: Abasto Ortega"
                                />
                                {errors.apellidos && (
                                    <div className="invalid-feedback">{errors.apellidos}</div>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    className={`form-control form-control-lg rounded-3 ${
                                        errors.email ? "is-invalid" : ""
                                    }`}
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    placeholder="usuario@ejemplo.com"
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">{errors.email}</div>
                                )}
                            </div>

                            {/* PASSWORD ISO27001 OPCIONAL */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Nueva contraseña (opcional)
                                </label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className={`form-control form-control-lg rounded-3 ${
                                            errors.password ? "is-invalid" : ""
                                        }`}
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="Dejar vacío para mantener la actual"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="invalid-feedback d-block">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* CONFIRMACION */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Confirmar contraseña
                                </label>
                                <div className="input-group">
                                    <input
                                        type={showPasswordConfirm ? "text" : "password"}
                                        className={`form-control form-control-lg rounded-3 ${
                                            errors.password_confirmation ? "is-invalid" : ""
                                        }`}
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData("password_confirmation", e.target.value)
                                        }
                                        placeholder="Repite la nueva contraseña"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPasswordConfirm(prev => !prev)}
                                    >
                                        <i className={showPasswordConfirm ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <div className="invalid-feedback d-block">
                                        {errors.password_confirmation}
                                    </div>
                                )}
                            </div>

                            {/* ROL */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Rol del usuario</label>
                                <select
                                    className={`form-select form-select-lg rounded-3 ${
                                        errors.role ? "is-invalid" : ""
                                    }`}
                                    value={data.role}
                                    onChange={(e) => setData("role", e.target.value)}
                                >
                                    <option value="admin">Administrador 👑</option>
                                    <option value="recolector">Recolector 🚛</option>
                                    <option value="usuario">Usuario 🌱</option>
                                </select>
                                {errors.role && (
                                    <div className="invalid-feedback">{errors.role}</div>
                                )}
                            </div>

                            {/* ESTADO */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Estado</label>
                                <select
                                    className={`form-select form-select-lg rounded-3 ${
                                        errors.estado ? "is-invalid" : ""
                                    }`}
                                    value={data.estado}
                                    onChange={(e) => setData("estado", e.target.value)}
                                >
                                    <option value="activo">Activo ✅</option>
                                    <option value="inactivo">Inactivo ❌</option>
                                    <option value="pendiente">Pendiente ⏳</option>
                                </select>
                                {errors.estado && (
                                    <div className="invalid-feedback">{errors.estado}</div>
                                )}
                            </div>
                        </div>

                        {/* BOTÓN GUARDAR */}
                        <div className="d-flex justify-content-end mt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-success btn-lg rounded-pill px-4 shadow-sm fw-semibold d-flex align-items-center gap-2"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #00c896 0%, #00d4a1 100%)",
                                }}
                            >
                                <i className="bi bi-save2"></i>
                                {processing ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
