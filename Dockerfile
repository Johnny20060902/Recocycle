# ===========================
# STAGE 1 — PHP + Composer
# ===========================
FROM php:8.3-fpm as php-build

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install gd pdo pdo_pgsql intl zip bcmath exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

# Copiar TODO tu backend (Laravel completo)
COPY backend/ .  

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

RUN php artisan optimize:clear || true
RUN php artisan config:clear || true
RUN php artisan route:clear || true
RUN php artisan view:clear || true



# ===========================
# STAGE 2 — Node / Vite Build
# ===========================
FROM node:20-alpine as node-build

WORKDIR /app

# Archivos de Vite
COPY vite.config.js ./
COPY backend/package*.json ./

# Copiar frontend
COPY backend/resources ./resources
COPY backend/public ./public

RUN npm install
RUN npm run build



# ===========================
# STAGE 3 — Final Production Image
# ===========================
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y nginx supervisor \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copiar Laravel ya listo
COPY --from=php-build /var/www/html /var/www/html

# Copiar build de Vite
COPY --from=node-build /app/public/build /var/www/html/public/build

# Nginx + Supervisor
COPY infra/nginx/conf.d/recocycle.conf /etc/nginx/conf.d/recocycle.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Crear carpetas requeridas por Laravel
RUN mkdir -p storage/framework/{cache/data,sessions,views} \
    && mkdir -p bootstrap/cache

# Permisos correctos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
