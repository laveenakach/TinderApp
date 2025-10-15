<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PeopleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All endpoints are public for demo/testing purposes.
*/

# Authentication endpoints
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

# People endpoints (fully public)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('people', [PeopleController::class, 'index']);
    Route::post('people/{id}/like', [PeopleController::class, 'like']);
    Route::post('people/{id}/dislike', [PeopleController::class, 'dislike']);
    Route::get('liked', [PeopleController::class, 'likedList']);
    Route::post('/logout', [AuthController::class, 'logout']);
});