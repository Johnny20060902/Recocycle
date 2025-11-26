@php
    $resetUrl = $url; // Laravel 12 pasa $url automáticamente
@endphp

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Restablecer contraseña - Recocycle</title>

    <style>
        body {
            background: #f0f6f2;
            font-family: 'Segoe UI', sans-serif;
            margin: 0;
            padding: 0;
            color: #2d2d2d;
        }

        .container {
            max-width: 540px;
            background: white;
            margin: 35px auto;
            padding: 35px;
            border-radius: 14px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
            border-top: 6px solid #2e7d4e;
        }

        .logo {
            text-align: center;
            margin-bottom: 25px;
        }

        .logo h1 {
            font-size: 28px;
            margin: 0;
            font-weight: 800;
            color: #2e7d4e;
        }

        .title {
            font-size: 22px;
            font-weight: 700;
            text-align: center;
            color: #2e7d4e;
            margin-bottom: 10px;
        }

        .message {
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 25px;
            color: #444;
            text-align: center;
        }

        .button-container {
            text-align: center;
            margin: 30px 0;
        }

        .button {
            background-color: #2e7d4e;
            color: white;
            padding: 14px 28px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
            transition: all 0.2s;
        }

        .button:hover {
            background-color: #256c43;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }

        .footer a {
            color: #2e7d4e;
            text-decoration: none;
        }

        .small-text {
            font-size: 12px;
            color: #666;
            margin-top: 20px;
            text-align: center;
            line-height: 1.4;
        }

        @media (max-width: 600px) {
            .container {
                padding: 25px;
            }
            .button {
                width: 100%;
            }
        }
    </style>
</head>

<body>

<div class="container">

    <div class="logo">
        <h1>♻️ RECOCYCLE</h1>
    </div>

    <p class="title">Restablecer contraseña</p>

    <p class="message">
        Recibimos una solicitud para restablecer tu contraseña.  
        Hacé clic en el siguiente botón para continuar con el proceso.
    </p>

    <div class="button-container">
        <a href="{{ $resetUrl }}" class="button" target="_blank">
            Restablecer contraseña
        </a>
    </div>

    <p class="small-text">
        Si no solicitaste esta acción, podés ignorar este mensaje.  
        Este enlace caduca en poco tiempo.
    </p>

    <div class="footer">
        © {{ date('Y') }} Recocycle — Plataforma de reciclaje inteligente.  
        <br>
        <a href="https://recocycle-web.onrender.com">Visitar página</a>
    </div>

</div>

</body>
</html>
