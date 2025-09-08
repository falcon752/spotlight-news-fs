<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\VideoController;

// ----------------------
// Public authentication
// ----------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ----------------------
// Public content routes
// ----------------------
Route::get('/posts', [PostController::class, 'index']);             // Public: list posts
Route::get('/posts/{id}', [PostController::class, 'show']);         // Public: single post

Route::get('/categories', [CategoryController::class, 'index']);    // Public: list categories
Route::get('/categories/{id}', [CategoryController::class, 'show']); // Public: single category

Route::get('/videos', [VideoController::class, 'index']);           // ✅ Public: list videos
Route::get('/videos/{id}', [VideoController::class, 'show']);       // ✅ Public: single video


// ----------------------
// Protected routes
// ----------------------
Route::middleware('auth:sanctum')->group(function () {
    // Current user
    Route::get('/me', [AuthorController::class, 'me']);
    Route::post('/authors/avatar', [AuthorController::class, 'updateAvatar']);

    // Authors CRUD
    Route::get('/authors', [AuthorController::class, 'index']);
    Route::put('/authors/{id}', [AuthorController::class, 'update']);
    Route::delete('/authors/{id}', [AuthorController::class, 'destroy']);

    // Categories CRUD (excluding index/show since public)
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);

    // Posts CRUD (excluding index/show since public)
    Route::post('/posts', [PostController::class, 'store']);
    Route::post('/uploads', [PostController::class, 'uploadImage']);
    Route::delete('/posts/clear', [PostController::class, 'clearAll']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);

    // Videos CRUD (excluding index/show since public)
    Route::post('/videos', [VideoController::class, 'store']);
    Route::put('/videos/{id}', [VideoController::class, 'update']);
    Route::delete('/videos/{id}', [VideoController::class, 'destroy']);
    Route::delete('/videos/clear', [VideoController::class, 'clearAll']);
});
