import { Head, Link } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function RecoLayout({ title, children, auth }) {
  return (
    <>
      <Head title={title} />

      <nav className="navbar navbar-expand-lg navbar-light bg-success shadow-sm sticky-top">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold text-white" href="/">
            ♻️ Recocycle
          </Link>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link href={route('dashboard')} className="nav-link text-white">
                  <i className="bi bi-house-door me-1"></i> Inicio
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  href={
                    auth.user.role === 'recolector'
                      ? route('recolector.ranking')
                      : route('usuario.ranking')
                  }
                  className="nav-link text-white"
                >
                  <i className="bi bi-bar-chart-line me-1"></i> Ranking
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  href={route('logout')}
                  method="post"
                  className="nav-link text-white"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4">{children}</main>

      <footer className="bg-light text-center py-3 mt-5 shadow-sm">
        <small className="text-muted">
          © {new Date().getFullYear()} Recocycle — Hecho con 💚 en Bolivia
        </small>
      </footer>
    </>
  );
}
