# ===========================
# STAGE 1: PHP + Composer (Laravel backend)
# ===========================
FROM php:8.3-fpm AS php-build

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

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

# Copiar backend (Laravel completo)
COPY backend/ .

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

RUN php artisan config:clear || true \
 && php artisan route:clear || true \
 && php artisan view:clear || true



# ===========================
# STAGE 2: Build frontend Vite
# ===========================
FROM node:20-alpine AS node-build
WORKDIR /app

# Instalar dependencias
COPY backend/package*.json ./
RUN npm install

# Copiar código completo de frontend
COPY backend/ .

# Generar build de Vite
RUN npm run build



# ===========================
# STAGE 3: Imagen final (Nginx + PHP-FPM + Supervisor)
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

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html


# ===========================
# Copiar Laravel desde stage PHP
# ===========================
COPY --from=php-build /var/www/html /var/www/html


# ===========================
# Copiar build de Vite DESPUÉS
# ===========================
# Crear carpeta build por si no existe
RUN mkdir -p /var/www/html/public/build

# Copiar el build generado
COPY --from=node-build /app/public/build /var/www/html/public/build



# ===========================
# Nginx config
# ===========================
COPY infra/nginx/conf.d/recocycle.conf /etc/nginx/conf.d/recocycle.conf

RUN rm -f /etc/nginx/conf.d/default.conf || true \
 && rm -f /etc/nginx/sites-enabled/default || true


# ===========================
# Directorios Laravel requeridos
# ===========================
RUN mkdir -p storage/framework/cache/data \
    && mkdir -p storage/framework/sessions \
    && mkdir -p storage/framework/views \
    && mkdir -p bootstrap/cache



# ===========================
# Supervisor
# ===========================
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf


# ===========================
# Permisos
# ===========================
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 775 storage bootstrap/cache


EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
