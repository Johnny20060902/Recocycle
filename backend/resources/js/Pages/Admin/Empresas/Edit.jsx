/* global route */

import { useForm, Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import "animate.css";

export default function EmpresaEdit({ auth, empresa, categorias }) {
    // Extraer IDs de categorías que ya tiene la empresa
    const categoriasEmpresaIds = empresa.categorias?.map(c => c.id) ?? [];

    const { data, setData, errors } = useForm({
        nombre: empresa.nombre || "",
        correo: empresa.correo || "",
        contacto: empresa.contacto || "",
        logo: null,
        categorias: categoriasEmpresaIds,  // ← IDs reales
        activo: empresa.activo ? true : false,
        password: "",
        password_confirmation: "",
    });

    const [preview, setPreview] = useState(
        empresa.logo ? `/storage/${empresa.logo}` : null
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [darkMode, setDarkMode] = useState(
        document.body.getAttribute("data-theme") === "dark"
    );

    useEffect(() => {
        const obs = new MutationObserver(() =>
            setDarkMode(document.body.getAttribute("data-theme") === "dark")
        );
        obs.observe(document.body, { attributes: true });
        return () => obs.disconnect();
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

        // ⬅ Enviar categorías como IDs reales
        data.categorias.forEach((id, index) => {
            formData.append(`categorias[${index}]`, id);
        });

        if (data.logo instanceof File) {
            formData.append("logo", data.logo);
        }

        if (data.password) {
            formData.append("password", data.password);
            formData.append("password_confirmation", data.password_confirmation);
        }

        Inertia.post(route("admin.empresas.update", empresa.id), formData, {
            onFinish: () => setIsSubmitting(false),
            onSuccess: () =>
                Swal.fire({
                    icon: "success",
                    title: "Actualizado",
                    text: "La empresa se actualizó correctamente.",
                    confirmButtonColor: "#00d4a1",
                }).then(() => Inertia.visit(route("admin.empresas.index"))),
            onError: () =>
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Revisa los campos.",
                    confirmButtonColor: "#d33",
                }),
        });
    };

    const handleCategoriaChange = (catId) => {
        if (data.categorias.includes(catId)) {
            setData("categorias", data.categorias.filter((id) => id !== catId));
        } else {
            setData("categorias", [...data.categorias, catId]);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData("logo", file);
        if (file) setPreview(URL.createObjectURL(file));
    };

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

                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0" style={{ color: darkMode ? "#4dd2a1" : "#007bff" }}>
                        ✏️ Editar Empresa
                    </h2>

                    <Link
                        href={route("admin.empresas.index")}
                        className={`btn rounded-pill shadow-sm ${darkMode ? "btn-outline-light" : "btn-outline-secondary"}`}
                    >
                        <i className="bi bi-arrow-left-circle me-2"></i>
                        Volver
                    </Link>
                </div>

                {/* FORM */}
                <div className="card border-0 shadow-lg rounded-4 p-4"
                    style={{ background: bgCard, color: textColor }}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">

                            {/* Nombre */}
                            <div className="col-md-6">
                                <label className="fw-semibold mb-1">Nombre de la empresa</label>
                                <input
                                    type="text"
                                    className="form-control shadow-sm rounded-pill"
                                    style={inputBaseStyle}
                                    value={data.nombre}
                                    onChange={(e) => setData("nombre", e.target.value)}
                                />
                                {errors?.nombre && <small className="text-danger">{errors.nombre}</small>}
                            </div>

                            {/* Contacto */}
                            <div className="col-md-6">
                                <label className="fw-semibold mb-1">Contacto</label>
                                <input
                                    type="text"
                                    className="form-control shadow-sm rounded-pill"
                                    style={inputBaseStyle}
                                    value={data.contacto}
                                    onChange={(e) => setData("contacto", e.target.value)}
                                />
                                {errors?.contacto && <small className="text-danger">{errors.contacto}</small>}
                            </div>

                            {/* Correo */}
                            <div className="col-md-6">
                                <label className="fw-semibold mb-1">Correo</label>
                                <input
                                    type="email"
                                    className="form-control shadow-sm rounded-pill"
                                    style={inputBaseStyle}
                                    value={data.correo}
                                    onChange={(e) => setData("correo", e.target.value)}
                                />
                                {errors?.correo && <small className="text-danger">{errors.correo}</small>}
                            </div>

                            {/* Logo */}
                            <div className="col-md-6">
                                <label className="fw-semibold mb-1">Logo</label>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-circle overflow-hidden shadow-sm"
                                        style={{
                                            width: "75px",
                                            height: "75px",
                                            backgroundColor: bgInput,
                                            border: `1px solid ${borderColor}`,
                                        }}
                                    >
                                        {preview ? (
                                            <img src={preview} className="w-100 h-100 object-fit-cover" />
                                        ) : (
                                            <i className="bi bi-image fs-3" style={{ color: secondaryText }}></i>
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

                        </div>

                        {/* Categorías */}
                        <div className="mt-4">
                            <label className="fw-semibold mb-2">Categorías:</label>

                            <div className="row">
                                {categorias.map((cat) => (
                                    <div className="col-md-3 col-6" key={cat.id}>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id={`cat-${cat.id}`}
                                                className="form-check-input"
                                                checked={data.categorias.includes(cat.id)}
                                                onChange={() => handleCategoriaChange(cat.id)}
                                            />
                                            <label style={{ color: secondaryText }}
                                                className="form-check-label"
                                                htmlFor={`cat-${cat.id}`}
                                            >
                                                {cat.nombre}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {errors?.categorias && (
                                <small className="text-danger">{errors.categorias}</small>
                            )}
                        </div>

                        {/* Estado */}
                        <div className="mt-4">
                            <div className="form-check form-switch">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="activoSwitch"
                                    checked={data.activo}
                                    onChange={(e) => setData("activo", e.target.checked)}
                                />
                                <label htmlFor="activoSwitch" className="form-check-label fw-semibold">
                                    Empresa activa
                                </label>
                            </div>
                        </div>

                        {/* Botón */}
                        <div className="text-end mt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`btn rounded-pill px-4 py-2 fw-semibold shadow-sm ${
                                    isSubmitting ? "opacity-75" : ""
                                }`}
                                style={{
                                    background: "linear-gradient(90deg, #007bff 0%, #00d4a1 100%)",
                                    color: "#fff",
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="bi bi-hourglass-split me-2 animate__animated animate__flash"></i>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save me-2"></i>
                                        Guardar cambios
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
