<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EventController;
use App\Http\Controllers\API\TicketController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\VenueController;

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',[AuthController::class,'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Users
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// Venues
Route::get('/venues', [VenueController::class, 'index']);
Route::get('/venues/{id}', [VenueController::class, 'show']);
Route::post('/venues', [VenueController::class, 'store']);
Route::put('/venues/{id}', [VenueController::class, 'update']);
Route::delete('/venues/{id}', [VenueController::class, 'destroy']);

// Reviews
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'store']);

// Events
Route::get('/events', [EventController::class,'index']);
Route::get('/events/{id}', [EventController::class,'show']);
Route::post('/events', [EventController::class,'store']);
Route::put('/events/{id}', [EventController::class,'update']);
Route::delete('/events/{id}', [EventController::class,'destroy']);

// Tickets
Route::get('/tickets', [TicketController::class,'index']);
Route::get('/tickets/{id}', [TicketController::class,'show']);
Route::post('/tickets', [TicketController::class,'store']);
Route::put('/tickets/{id}', [TicketController::class,'update']);
Route::delete('/tickets/{id}', [TicketController::class,'destroy']);

// Bookings
Route::get('/bookings', [BookingController::class,'index']);
Route::get('/bookings/{id}', [BookingController::class,'show']);
Route::post('/bookings', [BookingController::class,'store']);
Route::delete('/bookings/{id}', [BookingController::class,'destroy']);

// Payments
Route::get('/payments', [PaymentController::class,'index']);
Route::post('/payments', [PaymentController::class,'store']);

// Authenticated user info
Route::middleware('auth:api')->get('/profile',[AuthController::class,'profile']);
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});