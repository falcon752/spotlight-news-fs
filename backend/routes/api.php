<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;

// Author and authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->get('/me', [AuthorController::class, 'me']);
Route::middleware('auth:sanctum')->post('/authors/avatar', [AuthorController::class, 'updateAvatar']);

// routes/api.php
Route::middleware('auth:sanctum')->get('/authors', [AuthorController::class, 'index']);
