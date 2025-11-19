# ===========================
# STAGE 1 — PHP + Composer
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
COPY backend/ ./
RUN composer install --no-dev --optimize-autoloader --no-interaction


# ===========================
# STAGE 2 — Node Build
# ===========================
FROM node:20-alpine AS node-build
WORKDIR /app

# 🔥 Capturar variable de entorno desde Render
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
RUN npm run build



# ===========================
# STAGE 3 — FINAL IMAGE
# ===========================
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    nginx supervisor \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install pdo pdo_pgsql gd intl zip bcmath exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 🔥 ELIMINAR TODOS LOS DEFAULTS DE NGINX (LA CLAVE)
RUN rm -f /etc/nginx/conf.d/default.conf \
    && rm -f /etc/nginx/sites-enabled/default \
    && rm -f /etc/nginx/sites-available/default

WORKDIR /var/www/html

# Copiar backend PHP compilado
COPY --from=php-build /var/www/html /var/www/html

# Copiar build de Vite
COPY --from=node-build /app/public/build /var/www/html/public/build

# Configs de Nginx & Supervisord
COPY infra/nginx/conf.d/recocycle.conf /etc/nginx/conf.d/recocycle.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Permisos correctos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache \
    && chmod -R 755 /var/www/html/public

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
