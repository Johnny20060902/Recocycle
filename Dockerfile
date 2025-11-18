# ===========================
# STAGE 1 — PHP + Composer (Laravel backend)
# ===========================
FROM php:8.3-fpm AS php-build

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install gd pdo pdo_pgsql intl zip bcmath exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

# 👉 Copiar solo el backend Laravel
COPY backend/ .

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

RUN php artisan config:clear || true \
 && php artisan route:clear || true \
 && php artisan view:clear || true



# ===========================
# STAGE 2 — Node: Vite Build
# ===========================
FROM node:20-alpine AS node-build

WORKDIR /app

# Copiar archivos necesarios
COPY backend/package*.json ./
COPY vite.config.js ./
COPY backend/resources ./resources
COPY backend/public ./public

RUN npm install
RUN npm run build



# ===========================
# STAGE 3 — Imagen final (Nginx + PHP-FPM + Supervisor)
# ===========================
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    nginx supervisor \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 👉 Copiar Laravel backend desde stage php-build
COPY --from=php-build /var/www/html /var/www/html

# 👉 Copiar build Vite
COPY --from=node-build /app/public/build /var/www/html/public/build


# ===========================
# Crear carpetas Laravel *DESPUÉS* del COPY
# ===========================
RUN mkdir -p /var/www/html/storage/framework/cache/data && \
    mkdir -p /var/www/html/storage/framework/sessions && \
    mkdir -p /var/www/html/storage/framework/views && \
    mkdir -p /var/www/html/bootstrap/cache


# ===========================
# Permisos correctos
# ===========================
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache


# ===========================
# Nginx Config
# ===========================
COPY infra/nginx/conf.d/recocycle.conf /etc/nginx/conf.d/recocycle.conf

RUN rm -f /etc/nginx/conf.d/default.conf || true \
 && rm -f /etc/nginx/sites-enabled/default || true


# ===========================
# Supervisor
# ===========================
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf


EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
