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

# 👉 Copiar TODO el proyecto porque el backend está en la raíz
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Limpieza de Laravel
RUN php artisan config:clear || true \
 && php artisan route:clear || true \
 && php artisan view:clear || true


# ===========================
# STAGE 2 — Node Build
# ===========================
FROM node:20-alpine AS node-build
WORKDIR /app

# Copiamos configs correctas
COPY package*.json ./
COPY vite.config.js ./

# Copiar recursos donde corresponde
COPY resources ./resources
COPY public ./public

RUN npm install
RUN npm run build


# ===========================
# STAGE 3 — Final Image
# ===========================
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y nginx supervisor \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copiar backend Laravel completo
COPY --from=php-build /var/www/html /var/www/html

# Copiar build de Vite
COPY --from=node-build /app/public/build /var/www/html/public/build

# Nginx
COPY infra/nginx/conf.d/recocycle.conf /etc/nginx/conf.d/recocycle.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
