#!/bin/bash

echo "🔧 Inicializando Laravel automáticamente..."

# ==========================
# 1️⃣ Crear carpetas necesarias
# ==========================
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/storage/app/public

# ==========================
# 2️⃣ Crear archivo de log si no existe
# ==========================
if [ ! -f /var/www/html/storage/logs/laravel.log ]; then
    touch /var/www/html/storage/logs/laravel.log
    echo "📄 Creado laravel.log"
fi

# ==========================
# 3️⃣ Permisos correctos
# ==========================
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

# El log necesita permiso especial
chmod 666 /var/www/html/storage/logs/laravel.log

# ==========================
# 4️⃣ Crear storage:link
# ==========================
if [ ! -L /var/www/html/public/storage ]; then
    php /var/www/html/artisan storage:link || true
fi

# ==========================
# 5️⃣ Limpiar caches
# ==========================
echo "🍃 Limpiando caches..."
php /var/www/html/artisan config:clear || true
php /var/www/html/artisan cache:clear || true
php /var/www/html/artisan view:clear || true
php /var/www/html/artisan route:clear || true

echo "✅ Laravel listo para producción!"
