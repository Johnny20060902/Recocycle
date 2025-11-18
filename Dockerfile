# ===========================
# STAGE 1: PHP + Composer (Laravel backend)
# ===========================
FROM php:8.3-fpm AS php-build

# Paquetes necesarios rápidos (no compila ICU)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install gd pdo pdo_pgsql intl zip bcmath exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

# COPIAR TODO EL BACKEND PRIMERO (para que exista artisan)
COPY backend/ .

# Instalar dependencias (PROD)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Optimizar Laravel (sin fallar si faltan claves)
RUN php artisan config:clear || true \
 && php artisan route:clear || true \
 && php artisan view:clear || true


# ===========================
# STAGE 2: Build de frontend (Vite + React)
# ===========================
FROM node:20-alpine AS node-build
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ .
RUN npm run build


# ===========================
# STAGE 3: Imagen final (PHP-FPM + Nginx + Supervisor)
# ===========================
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install gd pdo pdo_pgsql intl zip bcmath exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer (opcional en prod pero útil)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar backend completo ya con vendor
COPY --from=php-build /var/www/html /var/www/html

# Copiar assets compilados
COPY --from=node-build /app/public/build /var/www/html/public/build

# Config Nginx
# Copiar la configuración CORRECTA de nginx
COPY infra/nginx/conf.d/recocycle.conf /etc/nginx/conf.d/recocycle.conf
# eliminar configuraciones por defecto de nginx
RUN rm -f /etc/nginx/conf.d/default.conf || true
RUN rm -f /etc/nginx/sites-enabled/default || true

# Config Supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Permisos Laravel
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 775 storage bootstrap/cache || true

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
