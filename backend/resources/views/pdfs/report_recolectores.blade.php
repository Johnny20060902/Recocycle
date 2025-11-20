@php
    use Carbon\Carbon;
@endphp
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Reporte de Recolectores - Recocycle</title>

    <style>
        @page { margin: 120px 40px 80px 40px; }

        body {
            font-family: "DejaVu Sans", sans-serif;
            font-size: 11.5px;
            color: #222;
        }

        /* HEADER – FIX */
        header {
            position: fixed;
            top: -100px;
            left: 0;
            right: 0;
            height: 90px;
            border-bottom: 3px solid #00c896;
        }

        /* FOOTER */
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

        /* TABLA */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }

        thead { display: table-header-group; }
        tbody { display: table-row-group; }

        th, td {
            border: 1px solid #d4d4d4;
            padding: 6px 8px;
            text-align: center;
        }

        th {
            background: linear-gradient(90deg, #003366, #00c896);
            color: #fff;
            font-size: 11px;
        }

        tbody tr:nth-child(even) { background-color: #f8f9fb; }
        tbody tr:nth-child(odd) { background-color: #ffffff; }

        .text-left { text-align: left; }

        /* Badges */
        .badge-activo {
            background:#e6f9f2; color:#0f8558;
            padding:3px 6px; border-radius:10px;
            border:1px solid #0f8558; font-size:10px;
        }
        .badge-pendiente {
            background:#fff8e1; color:#b28704;
            padding:3px 6px; border-radius:10px;
            border:1px solid #b28704; font-size:10px;
        }
        .badge-inactivo {
            background:#fdecea; color:#b71c1c;
            padding:3px 6px; border-radius:10px;
            border:1px solid #b71c1c; font-size:10px;
        }

        /* Rating */
        .rating-text { font-weight:bold; color:#ff9800; }

        .rating-bar-container {
            width:100%; height:6px;
            background:#e0e0e0; border-radius:4px;
            margin-top:3px;
        }
        .rating-bar-fill {
            height:100%; border-radius:4px;
            background:linear-gradient(90deg,#ffb300,#ff9800);
        }

        /* Summary */
        .summary-box {
            margin-top: 18px;
            border-top: 2px solid #00c896;
            padding-top: 10px;
        }

        .summary-grid td {
            border: none;
            padding: 2px 0;
        }

        .summary-label { font-weight:bold; color:#003366; }

        .firma { margin-top:40px; text-align:right; }
        .firma-linea { margin-bottom:2px; }
    </style>
</head>

<body>

<header>
    <table width="100%">
        <tr>
            <td width="18%" align="left">
                <img src="{{ public_path('images/logo-recocycle.png') }}" class="logo">
            </td>

            <td width="64%" align="center">
                <h2>Reporte de Recolectores</h2>
                <div style="font-size:11px; color:#666;">
                    Generado el {{ $fecha }}<br>
                    <span style="font-size:9px;">Recocycle — Plataforma ecológica integral</span>
                </div>
            </td>

            <td width="18%" align="right" style="font-size:10px; color:#555;">
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

    <h3 style="text-align:center; margin-bottom:8px; color:#003366;">
        LISTADO GENERAL DE RECOLECTORES
    </h3>

    {{-- 🔥 TABLA SIN ESPACIOS NI SALTOS – REQUISITO DOMPDF --}}
    <table><thead><tr>
        <th>ID</th>
        <th>Nombre completo</th>
        <th>Correo</th>
        <th>Teléfono</th>
        <th>Puntaje</th>
        <th>Total reciclajes</th>
        <th>Rating</th>
        <th>Estado</th>
        <th>Fecha registro</th>
    </tr></thead><tbody>
    @foreach ($recolectores as $r)
        @php
            $rating = floatval($r->rating_promedio ?? 0);
            $ratingPercent = ($rating / 5) * 100;
        @endphp

        <tr>
            <td>{{ $r->id }}</td>
            <td class="text-left">{{ $r->nombres }} {{ $r->apellidos }}</td>
            <td class="text-left">{{ $r->email ?? '—' }}</td>
            <td>{{ $r->telefono ?? '—' }}</td>
            <td>{{ $r->puntaje ?? 0 }}</td>
            <td>{{ $r->total_reciclajes ?? 0 }}</td>

            <td>
                <span class="rating-text">{{ number_format($rating,1) }} / 5.0</span>
                <div class="rating-bar-container">
                    <div class="rating-bar-fill" style="width:{{ $ratingPercent }}%"></div>
                </div>
            </td>

            <td>
                @if($r->estado === "activo")
                    <span class="badge-activo">ACTIVO</span>
                @elseif($r->estado === "pendiente")
                    <span class="badge-pendiente">PENDIENTE</span>
                @else
                    <span class="badge-inactivo">INACTIVO</span>
                @endif
            </td>

            <td>{{ $r->created_at ? Carbon::parse($r->created_at)->format('d/m/Y H:i') : '—' }}</td>
        </tr>
    @endforeach
    </tbody></table>

    <div class="summary-box">
        <strong>Resumen general</strong>
        <table class="summary-grid">
            <tr>
                <td class="summary-label">Total:</td> <td>{{ $recolectores->count() }}</td>
                <td class="summary-label">Fecha:</td> <td>{{ $fecha }}</td>
            </tr>
            <tr>
                <td class="summary-label">Activos:</td> <td>{{ $activos }}</td>
                <td class="summary-label">Pendientes:</td> <td>{{ $pendientes }}</td>
            </tr>
            <tr>
                <td class="summary-label">Inactivos:</td> <td>{{ $inactivos }}</td>
                <td class="summary-label">Fuente:</td> <td>Panel administrativo Recocycle</td>
            </tr>
        </table>
    </div>

    <div class="firma">
        <p class="firma-linea">___________________________</p>
        <span><strong>Administrador General</strong><br>Recocycle</span>
    </div>

</main>

</body>
</html>