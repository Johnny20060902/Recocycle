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

        * {
            box-sizing: border-box;
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
            text-align: center;
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

        h1,
        h2,
        h3 {
            margin: 0;
            color: #003366;
        }

        h2 {
            font-size: 18px;
            letter-spacing: 0.5px;
        }

        h3 {
            font-size: 14px;
        }

        main {
            margin-top: 10px;
        }

        .subtitle {
            font-size: 11px;
            color: #666;
        }

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

        th,
        td {
            border: 1px solid #d4d4d4;
            padding: 6px 8px;
            text-align: center;
        }

        th {
            background: linear-gradient(90deg, #003366 0%, #00c896 100%);
            color: #ffffff;
            font-size: 11px;
        }

        tbody tr:nth-child(even) {
            background-color: #f8f9fb;
        }

        tbody tr:nth-child(odd) {
            background-color: #ffffff;
        }

        tbody tr:hover {
            background-color: #eefcf7;
        }

        .text-left {
            text-align: left;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .badge-estado {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: bold;
        }

        .badge-activo {
            background-color: #e6f9f2;
            color: #0f8558;
            border: 1px solid #0f8558;
        }

        .badge-pendiente {
            background-color: #fff8e1;
            color: #b28704;
            border: 1px solid #b28704;
        }

        .badge-inactivo {
            background-color: #fdecea;
            color: #b71c1c;
            border: 1px solid #b71c1c;
        }

        .rating-text {
            font-weight: bold;
            color: #ff9800;
        }

        .rating-bar-container {
            width: 100%;
            height: 6px;
            background-color: #e0e0e0;
            border-radius: 4px;
            margin-top: 3px;
        }

        .rating-bar-fill {
            height: 100%;
            border-radius: 4px;
            background: linear-gradient(90deg, #ffb300 0%, #ff9800 100%);
        }

        .summary-box {
            margin-top: 18px;
            border-top: 2px solid #00c896;
            padding-top: 10px;
            font-size: 11.5px;
        }

        .summary-grid {
            width: 100%;
            margin-top: 5px;
        }

        .summary-grid td {
            border: none;
            padding: 2px 0;
            font-size: 11px;
        }

        .summary-label {
            font-weight: bold;
            color: #003366;
        }

        .firma {
            margin-top: 35px;
            text-align: right;
            font-size: 11.5px;
        }

        .firma-linea {
            margin-bottom: 2px;
        }

        .firma-nombre {
            font-weight: bold;
        }

        .firma-cargo {
            font-size: 10px;
            color: #555;
        }

        .meta-header {
            font-size: 10px;
            color: #555;
        }

        .small-muted {
            font-size: 9.5px;
            color: #777;
        }
    </style>
</head>

<body>

    <header>
        <table width="100%">
            <tr>
                <td width="18%" align="left">
                    <img src="{{ public_path('images/logo-recocycle.png') }}" class="logo" alt="Logo Recocycle">
                </td>
                <td width="64%" align="center">
                    <h2>Reporte de Recolectores</h2>
                    <div class="subtitle">
                        Generado el {{ $fecha }}<br>
                        <span class="small-muted">Recocycle — Plataforma ecológica integral</span>
                    </div>
                </td>
                <td width="18%" align="right" class="meta-header">
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
        {{-- Título de sección --}}
        <h3 class="section-title">Listado general de recolectores</h3>

        {{-- Tabla principal --}}
        <table>
            <thead>
                <tr>
                    <th style="width: 6%;">ID</th>
                    <th style="width: 25%;">Nombre completo</th>
                    <th style="width: 25%;">Correo electrónico</th>
                    <th style="width: 12%;">Puntaje</th>
                    <th style="width: 16%;">Rating promedio</th>
                    <th style="width: 16%;">Estado</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($recolectores as $r)
                    @php
                        $rating = is_numeric($r->rating_promedio) ? (float) $r->rating_promedio : 0;
                        $ratingPercent = max(0, min(100, ($rating / 5) * 100));
                    @endphp
                    <tr>
                        <td>{{ $r->id }}</td>
                        <td class="text-left">
                            {{ $r->nombres }} {{ $r->apellidos }}
                        </td>
                        <td class="text-left">
                            {{ $r->email ?? '—' }}
                        </td>
                        <td>
                            {{ $r->puntaje ?? 0 }}
                        </td>
                        <td>
                            <span class="rating-text">{{ number_format($rating, 1) }} / 5.0</span>
                            <div class="rating-bar-container">
                                <div class="rating-bar-fill" style="width: {{ $ratingPercent }}%;"></div>
                            </div>
                        </td>
                        <td>
                            @if ($r->estado === 'activo' || $r->estado === true)
                                <span class="badge-estado badge-activo">ACTIVO</span>
                            @elseif ($r->estado === 'pendiente')
                                <span class="badge-estado badge-pendiente">PENDIENTE</span>
                            @else
                                <span class="badge-estado badge-inactivo">INACTIVO</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        {{-- Resumen --}}
        <div class="summary-box">
            <strong>Resumen general</strong>
            <table class="summary-grid">
                <tr>
                    <td class="summary-label" style="width: 25%;">Total de recolectores:</td>
                    <td style="width: 25%;">{{ $recolectores->count() }}</td>
                    <td class="summary-label" style="width: 25%;">Fecha de generación:</td>
                    <td style="width: 25%;">{{ $fecha }}</td>
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

        {{-- Firma --}}
        <div class="firma">
            <p class="firma-linea">___________________________</p>
            <span class="firma-nombre">Administrador General</span><br>
            <span class="firma-cargo">Recocycle</span>
        </div>
    </main>

</body>

</html>
