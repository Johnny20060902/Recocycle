# ===========================
# STAGE 1 — PHP + Composer
# ===========================
FROM php:8.3-fpm AS php-build

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install gd pdo pdo_pgsql intl zip bcmath exif

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

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./

RUN npm run build


# ===========================
# STAGE 3 — Final Image
# ===========================
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    nginx supervisor \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install pdo pdo_pgsql gd intl zip bcmath exif

RUN rm -f /etc/nginx/conf.d/default.conf

WORKDIR /var/www/html

# Copiar backend PHP
COPY --from=php-build /var/www/html /var/www/html

# Copiar build
COPY --from=node-build /app/public/build /var/www/html/public/build

COPY infra/nginx/conf.d/recocycle.conf /etc/nginx/conf.d/recocycle.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
