FROM php:8.3-fpm

# 🧩 Instalar dependencias necesarias para Laravel, DomPDF y GD
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

# 🧰 Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ⚙️ Configurar Composer y entorno
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

# 🧹 Asegurar permisos correctos
RUN chown -R www-data:www-data /var/www/html

EXPOSE 9000
CMD ["php-fpm"]
