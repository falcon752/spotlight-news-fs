<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\CategoryController; // <-- add this

// Public authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthorController::class, 'me']);
    Route::post('/authors/avatar', [AuthorController::class, 'updateAvatar']);
    Route::get('/authors', [AuthorController::class, 'index']); // fetch all authors
    Route::put('/authors/{id}', [AuthorController::class, 'update']); // update author (role etc)
    Route::delete('/authors/{id}', [AuthorController::class, 'destroy']); // delete author

    // Categories CRUD
    Route::apiResource('categories', CategoryController::class);
});
