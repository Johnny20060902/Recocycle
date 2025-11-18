# ===========================
# STAGE 1: PHP + Composer (dependencias)
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

# Solo composer primero (cache mejor)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Copiar el resto del código
COPY . .

# ===========================
# STAGE 2: Build de frontend (Vite/React)
# ===========================
FROM node:20-alpine AS node-build
WORKDIR /app

# Copiar solo lo necesario para Node
COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# ===========================
# STAGE 3: Imagen final con PHP-FPM + Nginx
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

# Composer (por si hace falta en producción)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copiar app + vendor desde el build de PHP
COPY --from=php-build /var/www/html /var/www/html

# Copiar assets compilados desde Node
COPY --from=node-build /app/public/build /var/www/html/public/build

# Config Nginx y Supervisor
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Permisos para Laravel
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 775 storage bootstrap/cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
