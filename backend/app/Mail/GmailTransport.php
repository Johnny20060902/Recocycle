<?php

namespace App\Mail;

use Google\Client;
use Google\Service\Gmail;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mailer\SentMessage;
use Illuminate\Support\Facades\Cache;
use Psr\Log\LoggerInterface;

class GmailTransport extends AbstractTransport
{
    protected $client;

    public function __construct(LoggerInterface $logger = null)
    {
        parent::__construct($logger);

        $this->client = new Client();
        $this->client->setClientId(env('GMAIL_CLIENT_ID'));
        $this->client->setClientSecret(env('GMAIL_CLIENT_SECRET'));
        $this->client->setRedirectUri(env('GMAIL_REDIRECT_URI'));

        // Permiso para enviar correos
        $this->client->addScope(Gmail::GMAIL_SEND);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('consent');
    }

    public function doSend(SentMessage $sentMessage): void
    {
        // Recuperar token
        $token = Cache::get('gmail_token');

        if (!$token) {
            throw new \Exception("❌ Gmail OAuth no está autenticado. Ejecutá /google/oauth.");
        }

        $this->client->setAccessToken($token);

        // Si expiró, renovar
        if ($this->client->isAccessTokenExpired()) {

            $refresh = Cache::get('gmail_refresh_token');

            if (!$refresh) {
                throw new \Exception("❌ No existe refresh_token almacenado.");
            }

            $newToken = $this->client->fetchAccessTokenWithRefreshToken($refresh);

            Cache::put('gmail_token', $newToken);

            // Si el refresh token viene nuevamente, también lo actualizamos
            if (isset($newToken['refresh_token'])) {
                Cache::put('gmail_refresh_token', $newToken['refresh_token']);
            }
        }

        // Crear servicio Gmail
        $gmail = new Gmail($this->client);

        // ---------------------------
        // FORZAR REMITENTE REAL
        // ---------------------------
        $fromEmail = env('MAIL_FROM_ADDRESS');
        $fromName = env('MAIL_FROM_NAME', 'Recocycle');

        // Convertimos el mensaje completo
        $raw = $sentMessage->toString();

        // Reemplazar encabezado From (Gmail exige remitente autorizado)
        $raw = preg_replace(
            '/^From:.*$/m',
            "From: {$fromName} <{$fromEmail}>",
            $raw
        );

        // Gmail requiere base64 URL-safe
        $raw = base64_encode($raw);
        $raw = rtrim(strtr($raw, '+/', '-_'), '=');

        $gmailMessage = new Gmail\Message();
        $gmailMessage->setRaw($raw);

        // Enviar
        $gmail->users_messages->send('me', $gmailMessage);
    }

    public function __toString(): string
    {
        return 'gmail';
    }
}
