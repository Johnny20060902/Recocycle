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
mkdir -p /var/www/html/bootstrap/cache

# ==========================
# 2️⃣ Crear archivo de log si no existe
# ==========================
if [ ! -f /var/www/html/storage/logs/laravel.log ]; then
    touch /var/www/html/storage/logs/laravel.log
    echo "📄 Creado laravel.log"
fi

# ==========================
# 3️⃣ Permisos correctos
# Render **no usa www-data**
# Usa el usuario propio del container.
# ==========================
echo "🔐 Corrigiendo permisos..."
chown -R root:root /var/www/html/storage || true
chown -R root:root /var/www/html/bootstrap/cache || true

chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache
chmod 666 /var/www/html/storage/logs/laravel.log

# ==========================
# 4️⃣ Crear storage:link seguro
# ==========================
if [ ! -L /var/www/html/public/storage ]; then
    echo "🔗 Creando storage:link..."
    php /var/www/html/artisan storage:link --force || true
fi

# ==========================
# 5️⃣ Limpiar caches sin romper deploy
# ==========================
echo "🍃 Limpiando caches..."

php /var/www/html/artisan config:clear || true
php /var/www/html/artisan cache:clear || true
php /var/www/html/artisan view:clear || true
php /var/www/html/artisan route:clear || true

# Evita que Laravel tire error si no existe .env aún
php /var/www/html/artisan optimize || true

echo "✅ Laravel listo para producción!"
exit 0
