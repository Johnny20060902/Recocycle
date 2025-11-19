import { useForm, Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

const ALL_CATEGORIES = [
    "Carton",
    "Vidrios",
    "Baterias",
    "Electronicos",
    "Organicos",
    "Papel",
    "Todo",
];

export default function EmpresaEdit({ auth, empresa }) {
    const { data, setData, errors } = useForm({
        nombre: empresa.nombre || "",
        correo: empresa.correo || "",
        contacto: empresa.contacto || "",
        logo: null,
        categorias: (() => {
            try {
                return Array.isArray(empresa.categorias)
                    ? empresa.categorias
                    : JSON.parse(empresa.categorias);
            } catch {
                return empresa.categorias
                    ? empresa.categorias.split(",").map((c) => c.trim())
                    : [];
            }
        })(),
        activo: empresa.activo ? true : false,

        // 🔑 Campos nuevos para contraseña
        password: "",
        password_confirmation: "",
    });

    const [preview, setPreview] = useState(
        empresa.logo ? `/storage/${empresa.logo}` : null
    );
    const [darkMode, setDarkMode] = useState(
        document.body.getAttribute("data-theme") === "dark"
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 👁‍🗨 Mostrar / ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    useEffect(() => {
        const observer = new MutationObserver(() =>
            setDarkMode(document.body.getAttribute("data-theme") === "dark")
        );
        observer.observe(document.body, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("nombre", data.nombre);
        formData.append("correo", data.correo);
        formData.append("contacto", data.contacto || "");
        formData.append("activo", data.activo ? 1 : 0);

        // 📦 Categorías
        data.categorias.forEach((cat, index) => {
            formData.append(`categorias[${index}]`, cat);
        });

        // 🖼 Logo (solo si se cambió)
        if (data.logo instanceof File) {
            formData.append("logo", data.logo);
        }

        // 🔐 Solo mandamos password si el usuario escribió algo
        if (data.password) {
            formData.append("password", data.password);
            formData.append(
                "password_confirmation",
                data.password_confirmation || ""
            );
        }

        Inertia.post(route("admin.empresas.update", empresa.id), formData, {
            onStart: () => {
                document.body.classList.add("animate__animated", "animate__pulse");
            },
            onFinish: () => {
                document.body.classList.remove("animate__pulse");
                setIsSubmitting(false);
            },
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Empresa actualizada correctamente.",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#6f42c1",
                    background: "#fff",
                    color: "#222",
                    iconColor: "#2ecc71",
                    showClass: {
                        popup: "animate__animated animate__fadeInDown",
                    },
                    hideClass: {
                        popup: "animate__animated animate__fadeOutUp",
                    },
                }).then(() => {
                    Inertia.visit(route("admin.empresas.index"));
                });

                const btn = document.querySelector("#btnGuardar");
                if (btn) {
                    btn.classList.add("animate__animated", "animate__bounceIn");
                    setTimeout(() => btn.classList.remove("animate__bounceIn"), 800);
                }
            },
            onError: () => {
                setIsSubmitting(false);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un problema al actualizar la empresa.",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#6c757d",
                    background: "#fff",
                    color: "#222",
                    showClass: {
                        popup: "animate__animated animate__shakeX",
                    },
                    hideClass: {
                        popup: "animate__animated animate__fadeOut",
                    },
                });
            },
        });
    };

    const handleCheckbox = (cat) => {
        // Lógica de "Todo" igual que en create
        if (cat === "Todo") {
            if (data.categorias.includes("Todo")) {
                // Si ya estaba → limpiamos todas
                setData("categorias", []);
            } else {
                // Marcamos todas
                setData("categorias", ALL_CATEGORIES);
            }
            return;
        }

        let nuevas = [];

        if (data.categorias.includes(cat)) {
            // Quitar categoría
            nuevas = data.categorias.filter((c) => c !== cat);
        } else {
            // Agregar categoría
            nuevas = [...data.categorias, cat];
        }

        const sinTodo = ALL_CATEGORIES.filter((c) => c !== "Todo");
        const tieneTodasMenosTodo = sinTodo.every((c) => nuevas.includes(c));

        if (tieneTodasMenosTodo) {
            if (!nuevas.includes("Todo")) {
                nuevas.push("Todo");
            }
        } else {
            nuevas = nuevas.filter((c) => c !== "Todo");
        }

        setData("categorias", nuevas);
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData("logo", file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    // 🎨 Colores según modo
    const textColor = darkMode ? "#eaeaea" : "#222";
    const secondaryText = darkMode ? "#bfbfbf" : "#555";
    const bgCard = darkMode ? "#181818" : "#ffffff";
    const bgInput = darkMode ? "#222" : "#fff";
    const borderColor = darkMode ? "#333" : "#ddd";

    const inputBaseStyle = {
        backgroundColor: bgInput,
        color: textColor,
        borderColor,
    };

    return (
        <AppLayout title="Editar Empresa" auth={auth}>
            <div className="container py-4 animate__animated animate__fadeIn">
                {/* ======= ENCABEZADO ======= */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2
                        className="fw-bold mb-0"
                        style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}
                    >
                        ✏️ Editar Empresa
                    </h2>
                    <Link
                        href={route("admin.empresas.index")}
                        className={`btn rounded-pill shadow-sm ${
                            darkMode
                                ? "btn-outline-light text-light border-secondary"
                                : "btn-outline-secondary"
                        }`}
                    >
                        <i className="bi bi-arrow-left-circle me-2"></i> Volver al listado
                    </Link>
                </div>

                {/* ======= FORMULARIO ======= */}
                <div
                    className="card border-0 shadow-lg rounded-4 p-4"
                    style={{
                        background: bgCard,
                        color: textColor,
                        transition: "all 0.3s ease",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {/* Nombre */}
                            <div className="col-md-6">
                                <label className="fw-semibold mb-1">
                                    Nombre de la empresa
                                </label>
                                <input
                                    type="text"
                                    className="form-control shadow-sm rounded-pill"
                                    style={inputBaseStyle}
                                    value={data.nombre}
                                    onChange={(e) => setData("nombre", e.target.value)}
                                />
                                {errors?.nombre && (
                                    <small className="text-danger">
                                        {errors.nombre}
                                    </small>
                                )}
                            </div>

                            {/* Contacto */}
                            <div className="col-md-6">
                                <label className="fw-semibold mb-1">
                                    Número de contacto
                                </label>
                                <input
                                    type="text"
                                    className="form-control shadow-sm rounded-pill"
                                    style={inputBaseStyle}
                                    value={data.contacto}
                                    onChange={(e) => setData("contacto", e.target.value)}
                                />
                                {errors?.contacto && (
                                    <small className="text-danger">
                                        {errors.contacto}
                                    </small>
                                )}
                            </div>

                            {/* Correo */}
                            <div className="col-md-6">
                                <label className="fw-semibold mb-1">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    className="form-control shadow-sm rounded-pill"
                                    style={inputBaseStyle}
                                    value={data.correo}
                                    onChange={(e) => setData("correo", e.target.value)}
                                />
                                {errors?.correo && (
                                    <small className="text-danger">
                                        {errors.correo}
                                    </small>
                                )}
                            </div>

                            {/* Logo actual */}
                            <div className="col-md-6">
                                <label className="fw-semibold mb-1">Logo actual</label>
                                <div className="d-flex align-items-center gap-3">
                                    <div
                                        className="border rounded-circle overflow-hidden shadow-sm d-flex justify-content-center align-items-center"
                                        style={{
                                            width: "75px",
                                            height: "75px",
                                            backgroundColor: darkMode
                                                ? "#222"
                                                : "#f8f9fa",
                                        }}
                                    >
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Logo preview"
                                                className="object-fit-cover w-100 h-100"
                                            />
                                        ) : (
                                            <i
                                                className="bi bi-image fs-3"
                                                style={{ color: secondaryText }}
                                            ></i>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="form-control shadow-sm rounded-pill"
                                        style={inputBaseStyle}
                                        onChange={handleLogoChange}
                                    />
                                </div>
                            </div>

                            {/* 🔐 Nueva contraseña */}
                            <div className="col-md-6">
                                <label className="fw-semibold mb-1">
                                    Nueva contraseña (opcional)
                                </label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control shadow-sm rounded-pill"
                                        style={inputBaseStyle}
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="Dejar vacío para no cambiar"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary ms-2 rounded-pill d-flex align-items-center"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                    >
                                        <i
                                            className={`bi ${
                                                showPassword
                                                    ? "bi-eye-slash"
                                                    : "bi-eye"
                                            }`}
                                        ></i>
                                    </button>
                                </div>
                                {errors?.password && (
                                    <small className="text-danger">
                                        {errors.password}
                                    </small>
                                )}
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="col-md-6">
                                <label className="fw-semibold mb-1">
                                    Confirmar nueva contraseña
                                </label>
                                <div className="input-group">
                                    <input
                                        type={showPasswordConfirm ? "text" : "password"}
                                        className="form-control shadow-sm rounded-pill"
                                        style={inputBaseStyle}
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Repite la nueva contraseña"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary ms-2 rounded-pill d-flex align-items-center"
                                        onClick={() =>
                                            setShowPasswordConfirm((prev) => !prev)
                                        }
                                    >
                                        <i
                                            className={`bi ${
                                                showPasswordConfirm
                                                    ? "bi-eye-slash"
                                                    : "bi-eye"
                                            }`}
                                        ></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ======= CATEGORÍAS ======= */}
                        <div className="mt-4">
                            <label className="fw-semibold mb-2">
                                Categorías que maneja:
                            </label>
                            <div className="row">
                                {ALL_CATEGORIES.map((cat) => (
                                    <div className="col-md-3 col-6" key={cat}>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id={cat}
                                                className="form-check-input"
                                                checked={data.categorias.includes(cat)}
                                                onChange={() => handleCheckbox(cat)}
                                            />
                                            <label
                                                htmlFor={cat}
                                                className="form-check-label"
                                                style={{ color: secondaryText }}
                                            >
                                                {cat}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors?.categorias && (
                                <small className="text-danger d-block mt-1">
                                    {errors.categorias}
                                </small>
                            )}
                        </div>

                        {/* ======= ESTADO ======= */}
                        <div className="mt-4">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="activoSwitch"
                                    checked={data.activo}
                                    onChange={(e) =>
                                        setData("activo", e.target.checked)
                                    }
                                />
                                <label
                                    className="form-check-label fw-semibold"
                                    htmlFor="activoSwitch"
                                    style={{ color: secondaryText }}
                                >
                                    Empresa activa
                                </label>
                            </div>
                        </div>

                        {/* ======= BOTÓN GUARDAR ======= */}
                        <div className="text-end mt-4">
                            <button
                                id="btnGuardar"
                                type="submit"
                                disabled={isSubmitting}
                                className={`btn rounded-pill px-4 py-2 fw-semibold shadow-sm ${
                                    isSubmitting
                                        ? "opacity-75 cursor-not-allowed"
                                        : ""
                                }`}
                                style={{
                                    background:
                                        "linear-gradient(90deg, #007bff 0%, #00d4a1 100%)",
                                    color: "#fff",
                                    border: "none",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="bi bi-hourglass-split me-2 animate__animated animate__flash"></i>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save me-2"></i> Guardar
                                        cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
