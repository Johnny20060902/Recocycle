# ===========================
# STAGE 1: PHP + Composer (Laravel backend)
# ===========================
FROM php:8.3-fpm AS php-build

# Paquetes necesarios (rápidos, sin compilar ICU)
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

# Copiar backend completo (asegura que exista artisan antes de composer install)
COPY backend/ .

# Instalar dependencias PRODUCTION
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Limpieza de caches (evitar errores en Render)
RUN php artisan config:clear || true \
 && php artisan route:clear || true \
 && php artisan view:clear || true


# ===========================
# STAGE 2: Build frontend Vite
# ===========================
FROM node:20-alpine AS node-build
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ .
RUN npm run build


# ===========================
# STAGE 3: Imagen final
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

# Composer opcional en producción
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar backend ya con vendor
COPY --from=php-build /var/www/html /var/www/html

# Copiar build de Vite
COPY --from=node-build /app/public/build /var/www/html/public/build

# Copiar configuración correcta de Nginx
COPY infra/nginx/conf.d/recocycle.conf /etc/nginx/conf.d/recocycle.conf

# Eliminar defaults de nginx que causan conflicto
RUN rm -f /etc/nginx/conf.d/default.conf || true \
 && rm -f /etc/nginx/sites-enabled/default || true

# Crear carpetas necesarias de Laravel (evita error: "Please provide a valid cache path")
RUN mkdir -p storage/framework/cache/data \
    && mkdir -p storage/framework/sessions \
    && mkdir -p storage/framework/views \
    && mkdir -p bootstrap/cache

# Config Supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Permisos correctos
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 775 storage bootstrap/cache

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
