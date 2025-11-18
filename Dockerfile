# ===========================
# STAGE 1 — PHP Dependencies
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

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress


# ===========================
# STAGE 2 — Vite Build
# ===========================
FROM node:20-alpine AS node-build
WORKDIR /app

COPY backend/package*.json ./
COPY backend/vite.config.js ./
COPY backend/postcss.config.js ./
COPY backend/tailwind.config.js ./
COPY backend/jsconfig.json ./

RUN npm install

COPY backend/resources ./resources
COPY backend/public ./public
COPY backend/routes ./routes

RUN npm run build


# ===========================
# STAGE 3 — Production Image
# ===========================
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    nginx supervisor \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install pdo pdo_pgsql gd intl zip bcmath exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Remove nginx defaults (DEBIAN VERSION)
RUN rm -f /etc/nginx/sites-enabled/default \
       /etc/nginx/sites-available/default \
       /etc/nginx/conf.d/default.conf

WORKDIR /var/www/html

# Copy compiled PHP + vendor
COPY --from=php-build /var/www/html /var/www/html

# Copy Vite build
COPY --from=node-build /app/public/build /var/www/html/public/build

# Nginx + Supervisor configs
COPY infra/nginx/conf.d/recocycle.conf /etc/nginx/conf.d/recocycle.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
