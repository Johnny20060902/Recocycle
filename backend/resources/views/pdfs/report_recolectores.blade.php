@php
    use Carbon\Carbon;
@endphp
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Reporte de Recolectores - Recocycle</title>

    <style>
        @page {
            margin: 100px 40px 80px 40px;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11.5px;
            color: #222;
        }

        header {
            position: fixed;
            top: -80px;
            left: 0;
            right: 0;
            height: 70px;
            border-bottom: 3px solid #00c896;
        }

        footer {
            position: fixed;
            bottom: -60px;
            left: 0;
            right: 0;
            height: 50px;
            border-top: 3px solid #00c896;
            text-align: center;
            font-size: 10px;
            color: #666;
        }

        .logo {
            height: 60px;
            width: 60px;
            border-radius: 50%;
            object-fit: cover;
        }

        h1, h2, h3 {
            margin: 0;
            color: #003366;
        }

        h2 { font-size: 18px; }
        h3 { font-size: 14px; }

        .subtitle {
            font-size: 11px;
            color: #666;
        }

        main { margin-top: 10px; }

        .section-title {
            text-align: center;
            margin-bottom: 8px;
            color: #003366;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }

        th, td {
            border: 1px solid #d4d4d4;
            padding: 6px 8px;
            text-align: center;
        }

        th {
            background: linear-gradient(90deg, #003366 0%, #00c896 100%);
            color: white;
            font-size: 11px;
        }

        tbody tr:nth-child(even) { background-color: #f8f9fb; }
        tbody tr:nth-child(odd)  { background-color: #ffffff; }

        /* Badges */
        .badge-activo {
            background: #e6f9f2;
            color: #0f8558;
            padding: 3px 7px;
            border-radius: 10px;
            font-size: 10px;
            border: 1px solid #0f8558;
        }

        .badge-pendiente {
            background: #fff3cd;
            color: #b68a00;
            padding: 3px 7px;
            border-radius: 10px;
            font-size: 10px;
            border: 1px solid #b68a00;
        }

        .badge-inactivo {
            background: #fdecea;
            color: #b71c1c;
            padding: 3px 7px;
            border-radius: 10px;
            font-size: 10px;
            border: 1px solid #b71c1c;
        }

        /* Rating bar */
        .rating-text { font-weight: bold; color: #ff9800; }

        .rating-bar-container {
            width: 100%;
            height: 6px;
            background: #e0e0e0;
            border-radius: 4px;
            margin-top: 3px;
        }

        .rating-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #ffb300 0%, #ff9800 100%);
            border-radius: 4px;
        }

        /* Summary box */
        .summary-box {
            margin-top: 18px;
            border-top: 2px solid #00c896;
            padding-top: 10px;
            font-size: 11.5px;
        }

        .summary-grid td {
            border: none;
            padding: 3px 0;
        }

        .summary-label {
            font-weight: bold;
            color: #003366;
        }

        .firma {
            margin-top: 40px;
            text-align: right;
        }

        .firma-nombre { font-weight: bold; }
        .firma-cargo { font-size: 10px; color: #666; }

    </style>
</head>

<body>

<header>
    <table width="100%">
        <tr>
            <td width="20%" align="left">
                <img src="{{ public_path('images/logo-recocycle.png') }}"
                     class="logo" alt="Logo">
            </td>

            <td width="60%" align="center">
                <h2>Reporte de Recolectores</h2>
                <div class="subtitle">
                    Generado el {{ $fecha }} <br>
                    <small>Recocycle — Plataforma ecológica integral</small>
                </div>
            </td>

            <td width="20%" align="right" style="font-size: 11px;">
                <strong>Total:</strong> {{ $recolectores->count() }}<br>
                <strong>Año:</strong> {{ date('Y') }}
            </td>
        </tr>
    </table>
</header>

<footer>
    <div>Recocycle — Plataforma ecológica integral ♻️</div>
    <div>© {{ date('Y') }} Todos los derechos reservados.</div>
</footer>

<main>

    <h3 class="section-title">Listado general de recolectores</h3>

    <table>
        <thead>
        <tr>
            <th>ID</th>
            <th>Nombre completo</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Puntaje</th>
            <th>Total reciclajes</th>
            <th>Rating promedio</th>
            <th>Estado</th>
            <th>Fecha de registro</th>
        </tr>
        </thead>

        <tbody>
        @foreach ($recolectores as $r)
            @php
                $rating = (float) ($r->rating_promedio ?? 0);
                $ratingPercent = ($rating / 5) * 100;
            @endphp

            <tr>
                <td>{{ $r->id }}</td>

                <td class="text-left">
                    {{ $r->nombres }} {{ $r->apellidos }}
                </td>

                <td class="text-left">{{ $r->email ?? '—' }}</td>

                <td>{{ $r->contacto ?? '—' }}</td>

                <td>{{ $r->puntaje ?? 0 }}</td>

                <td>{{ $r->total_reciclajes ?? 0 }}</td>

                <td>
                    <span class="rating-text">{{ number_format($rating, 1) }} / 5.0</span>
                    <div class="rating-bar-container">
                        <div class="rating-bar-fill"
                             style="width: {{ $ratingPercent }}%"></div>
                    </div>
                </td>

                <td>
                    @if ($r->estado === 'activo')
                        <span class="badge-activo">ACTIVO</span>
                    @elseif ($r->estado === 'pendiente')
                        <span class="badge-pendiente">PENDIENTE</span>
                    @else
                        <span class="badge-inactivo">INACTIVO</span>
                    @endif
                </td>

                <td>
                    {{ $r->created_at ? Carbon::parse($r->created_at)->format('d/m/Y H:i') : '—' }}
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>

    {{-- RESUMEN --}}
    <div class="summary-box">
        <strong>Resumen general</strong>

        <table class="summary-grid" width="100%">
            <tr>
                <td class="summary-label">Total de recolectores:</td>
                <td>{{ $recolectores->count() }}</td>

                <td class="summary-label">Fecha de generación:</td>
                <td>{{ $fecha }}</td>
            </tr>

            <tr>
                <td class="summary-label">Activos:</td>
                <td>{{ $activos }}</td>

                <td class="summary-label">Pendientes:</td>
                <td>{{ $pendientes }}</td>
            </tr>

            <tr>
                <td class="summary-label">Inactivos:</td>
                <td>{{ $inactivos }}</td>

                <td class="summary-label">Fuente:</td>
                <td>Panel administrativo Recocycle</td>
            </tr>
        </table>
    </div>

    {{-- FIRMA --}}
    <div class="firma">
        <p>______________________________</p>
        <span class="firma-nombre">Administrador General</span><br>
        <span class="firma-cargo">Recocycle</span>
    </div>

</main>

</body>
</html>
