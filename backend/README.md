#  Tinder Clone API (Laravel-10 + Sanctum + Swagger)

A complete backend API for a Tinder-style app built with **Laravel 11**, **Sanctum authentication**, and **Swagger documentation**.

---

## 🚀 Features

- User registration and authentication (Laravel Sanctum)
- People listing, liking, and disliking
- Pagination and eager loading for related data
- Swagger UI for full API documentation
- Seeders for demo users and people
- Ready-to-run setup commands

---

## ⚙️ Requirements

- PHP 8.2+
- Composer
- MySQL
- Laravel 10

---

## 🧭 Installation Guide

### 1 Clone the repository

```bash
git clone https://github.com/laveenakach/TinderApp.git
cd tinderApp

### 2 Install dependencies
composer install

### 3 Set up environment variables
cp .env.example .env

Then open .env and update your database credentials:

DB_DATABASE=tinder_app
DB_USERNAME=root
DB_PASSWORD=

### 4 Generate Laravel app key
php artisan key:generate

### 5 Run migrations and seed demo data
php artisan migrate:fresh --seed

### 6 Install Laravel Sanctum (if not already done)
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

### 7 Serve the application
php artisan serve --host=192.168.0.183 --port=8000

Your backend will now be running at:
👉 http://192.168.0.183:8000

### 8 API Documentation (Swagger)
Swagger UI is available here:
👉 http://192.168.0.183:8000/api/documentation

### 9 For running react native in browser 
cd frontend 
run expo cmd- npx expo start
Then run http://localhost:8081/ in the browser.