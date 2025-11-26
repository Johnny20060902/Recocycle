<?php

namespace App\Http\Controllers;

use Google\Client;
use Illuminate\Support\Facades\Cache;

class GoogleOAuthController extends Controller
{
    private function googleClient()
    {
        $client = new Client();
        $client->setClientId(env('GMAIL_CLIENT_ID'));
        $client->setClientSecret(env('GMAIL_CLIENT_SECRET'));
        $client->setRedirectUri(env('GMAIL_REDIRECT_URI'));
        $client->addScope("https://www.googleapis.com/auth/gmail.send");
        $client->setAccessType('offline');
        $client->setPrompt('consent'); // obliga a enviar refresh_token

        return $client;
    }

    public function redirect()
    {
        $client = $this->googleClient();
        return redirect()->away($client->createAuthUrl());
    }

    public function callback()
    {
        $client = $this->googleClient();

        if (!request()->has('code')) {
            return "❌ Error: Google no devolvió el código de autorización.";
        }

        $code = request('code');
        $token = $client->fetchAccessTokenWithAuthCode($code);

        // Si falló
        if (isset($token['error'])) {
            return "❌ Error con Google OAuth: " . $token['error_description'];
        }

        // -------------------------------
        // 🔥 Casos importantes:
        //  - El refresh token SOLO LLEGA 1 VEZ
        //  - Si no llega, hay que recuperar el que ya teníamos
        // -------------------------------

        $refresh = $token['refresh_token'] ?? Cache::get('gmail_refresh_token');

        if (!$refresh) {
            return "❌ Google no envió refresh_token. Vuelve a conectarte usando `prompt=consent` y 'Eliminar acceso' desde Google.";
        }

        // Guardar tokens
        Cache::put('gmail_token', $token);
        Cache::put('gmail_refresh_token', $refresh);

        return "✅ Gmail conectado correctamente.  
Refresh Token guardado permanentemente.  
¡Ya podés enviar correos desde Laravel!";
    }
}
