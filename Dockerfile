# ===========================
# STAGE 1: PHP + Composer (Laravel backend)
# ===========================
FROM php:8.3-fpm AS php-build

# Paquetes necesarios
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

# Instalamos dependencias de Laravel (sin dev, optimizado)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Copiamos TODO el backend Laravel
COPY backend/ .

# ===========================
# STAGE 2: Build de frontend (Vite/React dentro de Laravel backend)
# ===========================
FROM node:20-alpine AS node-build
WORKDIR /app

# Copiamos package.json del backend (donde está Vite/React de Inertia)
COPY backend/package*.json ./

RUN npm install

# Copiamos el código para compilar assets
COPY backend/ .

RUN npm run build

# ===========================
# STAGE 3: Imagen final con PHP-FPM + Nginx + Supervisor
# ===========================
FROM php:8.3-fpm

# Paquetes para PHP + Nginx + Supervisor
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

# Composer (por si se necesita en el contenedor final)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiamos la app Laravel ya con vendor
COPY --from=php-build /var/www/html /var/www/html

# Copiamos los assets compilados de Vite al public de Laravel
COPY --from=node-build /app/public/build /var/www/html/public/build

# Configuración de Nginx y Supervisor (carpeta docker/ en la raíz del repo)
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Permisos para Laravel
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 775 storage bootstrap/cache || true

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
