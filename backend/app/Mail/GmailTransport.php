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
        $this->client->addScope(Gmail::GMAIL_SEND);
        $this->client->setAccessType('offline');
    }

    public function doSend(SentMessage $sentMessage): void
    {
        $token = Cache::get('gmail_token');

        if (!$token) {
            throw new \Exception("Google OAuth no está autenticado todavía.");
        }

        $this->client->setAccessToken($token);

        // Refrescar token si expiró
        if ($this->client->isAccessTokenExpired()) {
            $refresh = $this->client->getRefreshToken();

            if (!$refresh) {
                throw new \Exception("No se encontró refresh_token para renovar.");
            }

            $newToken = $this->client->fetchAccessTokenWithRefreshToken($refresh);
            Cache::put('gmail_token', $newToken);
        }

        $gmail = new Gmail($this->client);

        // Aseguramos "From" correcto
        $from = env('MAIL_FROM_ADDRESS');
        $fromName = env('MAIL_FROM_NAME', 'Recocycle');

        $raw = $sentMessage->toString();

        // Forzar From en el RAW
        $raw = preg_replace(
            '/^From:.*$/m',
            "From: {$fromName} <{$from}>",
            $raw
        );

        // Base64 URL-safe
        $raw = base64_encode($raw);
        $raw = rtrim(strtr($raw, '+/', '-_'), '=');

        $gmailMessage = new Gmail\Message();
        $gmailMessage->setRaw($raw);

        $gmail->users_messages->send('me', $gmailMessage);
    }

    public function __toString(): string
    {
        return 'gmail';
    }
}
