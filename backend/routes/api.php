<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/me', [AuthorController::class, 'me']); // ✅ any logged-in user
    Route::post('/authors/avatar', [AuthorController::class, 'updateAvatar']); // ✅ any logged-in user
});

// Role-protected routes
Route::middleware(['auth:sanctum', 'role:Chief Admin,Admin'])->group(function () {
    // put your admin-only routes here (like manage users, posts, etc.)
});
