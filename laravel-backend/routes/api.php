<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public API Routes
Route::prefix('v1')->group(function () {

    // Categories
    Route::get('categories', [CategoryController::class, 'index']);

    // Products
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/featured', [ProductController::class, 'featured']);
    Route::get('products/{slug}', [ProductController::class, 'show']);

    // Orders
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{orderNumber}', [OrderController::class, 'show']);
});

// Admin API Routes
Route::prefix('v1/admin')->group(function () {

    // Authentication
    Route::post('login', [AuthController::class, 'login']);

    // Protected Admin Routes
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);

        // Dashboard
        Route::get('dashboard/stats', [DashboardController::class, 'stats']);

        // Products Management
        Route::get('products', [AdminProductController::class, 'index']);
        Route::post('products', [AdminProductController::class, 'store']);
        Route::put('products/{product}', [AdminProductController::class, 'update']);
        Route::delete('products/{product}', [AdminProductController::class, 'destroy']);
        Route::post('products/{id}/images', [AdminProductController::class, 'uploadImages']);
        Route::delete('products/images/{imageId}', [AdminProductController::class, 'deleteImage']);

        // Categories Management
        Route::get('categories', [AdminCategoryController::class, 'index']);
        Route::post('categories', [AdminCategoryController::class, 'store']);
        Route::put('categories/{category}', [AdminCategoryController::class, 'update']);
        Route::delete('categories/{category}', [AdminCategoryController::class, 'destroy']);

        // Orders Management
        Route::get('orders', [AdminOrderController::class, 'index']);
        Route::get('orders/{id}', [AdminOrderController::class, 'show']);
        Route::put('orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
        Route::put('orders/{id}/payment', [AdminOrderController::class, 'updatePayment']);
    });
});
