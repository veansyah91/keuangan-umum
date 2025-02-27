# Gunakan image base FrankenPHP dengan PHP 8.1
FROM dunglas/frankenphp:latest

# Set working directory
WORKDIR /app

# Install dependencies sistem
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libcurl4-openssl-dev \
    libssl-dev \
    libicu-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libwebp-dev \
    libxpm-dev \
    libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install pdo_mysql zip bcmath opcache intl pcntl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer.json dan composer.lock
COPY composer.json composer.lock ./

# Bersihkan cache Composer dan install dependensi
RUN composer clear-cache && composer install --no-dev --optimize-autoloader --no-scripts

# Copy aplikasi
COPY . .

# Set permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Expose port 80
EXPOSE 80

# Start FrankenPHP dengan Octane
# CMD ["php", "artisan", "octane:start", "--host=0.0.0.0", "--port=80"]
ENTRYPOINT ["php", "artisan", "octane:frankenphp"]
