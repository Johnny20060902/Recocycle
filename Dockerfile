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

COPY backend/ .

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress


# ===========================
# STAGE 2 — Node Build
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
# STAGE 3 — Final Image
# ===========================
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libicu-dev \
    libpng-dev libjpeg-dev libfreetype6-dev \
    nginx supervisor \
    && docker-php-ext-configure gd --with-jpeg --with-freetype \
    && docker-php-ext-install pdo pdo_pgsql gd intl zip bcmath exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ❗Eliminar default.conf sí o sí
RUN rm -f /etc/nginx/conf.d/default.conf

WORKDIR /var/www/html

# Backend Laravel ya compilado
COPY --from=php-build /var/www/html /var/www/html

# Vite build
COPY --from=node-build /app/public/build /var/www/html/public/build

# Nginx config
COPY infra/nginx/conf.d/recocycle.conf /etc/nginx/conf.d/recocycle.conf

# Supervisor config
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ❗ NO copiar .env.example — Render lo espera con variables reales
# COPY backend/.env.example ./

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
