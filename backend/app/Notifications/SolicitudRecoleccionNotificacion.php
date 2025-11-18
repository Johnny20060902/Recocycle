<?php

namespace App\Notifications;

use App\Models\SolicitudRecoleccion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SolicitudRecoleccionNotificacion extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public SolicitudRecoleccion $solicitud)
    {
    }

    public function via($notifiable)
    {
        return ['database', 'mail']; // Guardará en DB y también enviará correo
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nueva solicitud de recolección')
            ->greeting('Hola ' . $notifiable->nombres . ' 👋')
            ->line('Has recibido una nueva solicitud de recolección.')
            ->line('Recolector: ' . $this->solicitud->recolector->nombres)
            ->line('Fecha: ' . $this->solicitud->fecha_solicitada->format('d/m/Y'))
            ->line('Hora: ' . $this->solicitud->hora_solicitada)
            ->action('Ver solicitud', url('/usuario/solicitudes'))
            ->line('Podés aceptarla o rechazarla desde tu panel.');
    }

    public function toArray($notifiable)
    {
        return [
            'solicitud_id' => $this->solicitud->id,
            'recolector' => $this->solicitud->recolector->nombres,
            'fecha' => $this->solicitud->fecha_solicitada,
            'hora' => $this->solicitud->hora_solicitada,
            'mensaje' => 'Nueva solicitud de recolección pendiente de respuesta.',
        ];
    }
}
