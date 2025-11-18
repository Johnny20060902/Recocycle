# ===========================
# STAGE 1: PHP + Composer (Laravel backend)
# ===========================
FROM php:8.3-fpm AS php-build

# Paquetes necesarios rápidos (sin compilar ICU)
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

# Copiamos composer del backend Laravel
COPY backend/composer.json backend/composer.lock ./

# Instalamos dependencias (PROD)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Copiamos TODO el backend Laravel
COPY backend/ .

# Optimizar cache Laravel
RUN php artisan config:clear || true \
 && php artisan route:clear || true \
 && php artisan view:clear || true


# ===========================
# STAGE 2: Build de frontend (Vite/React)
# ===========================
FROM node:20-alpine AS node-build
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ .
RUN npm run build


# ===========================
# STAGE 3: Imagen final con PHP-FPM + Nginx + Supervisor
# ===========================
FROM php:8.3-fpm

# Instalamos Nginx + Supervisor + dependencias
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

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiamos backend completo
COPY --from=php-build /var/www/html /var/www/html

# Copiamos build de Vite
COPY --from=node-build /app/public/build /var/www/html/public/build

# Configuración Nginx / Supervisor
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Permisos Laravel
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 775 storage bootstrap/cache || true

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
