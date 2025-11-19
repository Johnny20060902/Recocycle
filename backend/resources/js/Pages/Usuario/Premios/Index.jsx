import UserLayout from "@/Layouts/UserLayout";

export default function PremiosIndex({ auth, premios = [] }) {
  const user = auth?.user;

  return (
    <UserLayout title="Premios del Mes" auth={auth}>
      <div className="container py-5 animate__animated animate__fadeIn">

        {/* ENCABEZADO */}
        <div className="text-center mb-5 px-3">
          <h1 className="fw-bold text-success fs-3">🏆 Premios Disponibles</h1>

          {user ? (
            <p className="fs-6 text-secondary mb-1">
              👋 ¡Hola,{" "}
              <span className="fw-bold text-success">
                {user.nombres} {user.apellidos}
              </span>
              ! Estas son tus recompensas ecológicas 🌿
            </p>
          ) : (
            <p className="text-secondary mb-1">
              Participá y ganá reciclando responsablemente ♻️
            </p>
          )}

          <p className="text-muted small">
            *Los premios cambian cada mes según tu ranking.*
          </p>
        </div>

        {/* LISTA DE PREMIOS */}
        <div className="row g-4 justify-content-center">
          {premios.length > 0 ? (
            premios.map((premio) => (
              <div
                key={premio.id}
                className="col-12 col-sm-10 col-md-6 col-lg-4 d-flex"
              >
                <div
                  className="card border-0 shadow-lg w-100 hover-shadow"
                  style={{
                    borderRadius: "1rem",
                    background: "linear-gradient(145deg,#edfff8,#ffffff)",
                    transition: "transform .2s ease, box-shadow .2s ease",
                  }}
                >
                  {/* Imagen */}
                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{
                      height: "210px",
                      borderTopLeftRadius: "1rem",
                      borderTopRightRadius: "1rem",
                    }}
                  >
                    {premio.archivo ? (
                      <img
                        src={`/storage/${premio.archivo}`}
                        alt={premio.nombre}
                        className="img-fluid"
                        style={{
                          maxHeight: "200px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <i
                        className="bi bi-gift-fill text-success"
                        style={{ fontSize: "4rem" }}
                      ></i>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="card-body text-center px-3">
                    <h5 className="fw-bold text-success">{premio.nombre}</h5>

                    <p className="text-secondary mb-3 small">
                      Fecha límite:{" "}
                      <span className="fw-semibold text-dark">
                        {premio.fecha_limite
                          ? new Date(premio.fecha_limite).toLocaleDateString(
                              "es-BO",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </span>
                    </p>

                    {premio.archivo && (
                      <a
                        href={`/storage/${premio.archivo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success rounded-pill shadow-sm fw-semibold d-flex align-items-center justify-content-center gap-2 mx-auto px-4 py-2"
                      >
                        <i className="bi bi-eye-fill"></i> Ver Premio
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center mt-5">
              <i className="bi bi-emoji-frown text-secondary fs-1"></i>
              <p className="text-secondary mt-3">
                Aún no hay premios disponibles en este momento.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DARK MODE */}
      <style>{`
        body[data-theme="dark"] .card {
          background: linear-gradient(145deg,#1b1b1b,#262626) !important;
          color: #e6e6e6 !important;
        }
        body[data-theme="dark"] .text-success {
          color: #00d4a1 !important;
        }
        body[data-theme="dark"] .text-secondary,
        body[data-theme="dark"] .text-muted {
          color: #b5b5b5 !important;
        }
        body[data-theme="dark"] .hover-shadow:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 15px rgba(0,255,150,0.18);
        }
        body[data-theme="dark"] .bg-light {
          background-color: #1b1b1b !important;
        }
      `}</style>
    </UserLayout>
  );
}
