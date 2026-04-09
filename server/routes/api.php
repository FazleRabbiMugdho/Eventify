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

use App\Http\Controllers\API\ChatbotController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Auth ---
// We point this to UserController@store to use our fixed registration logic
Route::post('/register', [UserController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

// --- Users ---
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::middleware('auth:api')->get('/my-events', [UserController::class, 'myEvents']);
Route::middleware('auth:api')->post('/users', [UserController::class, 'store']);
Route::middleware('auth:api')->put('/users/{id}', [UserController::class, 'update']);
Route::middleware('auth:api')->delete('/users/{id}', [UserController::class, 'destroy']);

// --- Categories ---
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::middleware('auth:api')->post('/categories', [CategoryController::class, 'store']);
Route::middleware('auth:api')->put('/categories/{id}', [CategoryController::class, 'update']);
Route::middleware('auth:api')->delete('/categories/{id}', [CategoryController::class, 'destroy']);

// --- Venues ---
Route::get('/venues', [VenueController::class, 'index']);
Route::get('/venues/{id}', [VenueController::class, 'show']);
Route::middleware('auth:api')->post('/venues', [VenueController::class, 'store']);
Route::middleware('auth:api')->put('/venues/{id}', [VenueController::class, 'update']);
Route::middleware('auth:api')->delete('/venues/{id}', [VenueController::class, 'destroy']);

// --- Reviews ---
Route::get('/reviews', [ReviewController::class, 'index']);
Route::middleware('auth:api')->post('/reviews', [ReviewController::class, 'store']);

// --- Events ---
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);
Route::middleware('auth:api')->post('/events', [EventController::class, 'store']);
Route::middleware('auth:api')->put('/events/{id}', [EventController::class, 'update']);
Route::middleware('auth:api')->delete('/events/{id}', [EventController::class, 'destroy']);

// --- Tickets ---
Route::get('/tickets', [TicketController::class, 'index']);
Route::get('/tickets/{id}', [TicketController::class, 'show']);
Route::middleware('auth:api')->post('/tickets', [TicketController::class, 'store']);
Route::middleware('auth:api')->put('/tickets/{id}', [TicketController::class, 'update']);
Route::middleware('auth:api')->delete('/tickets/{id}', [TicketController::class, 'destroy']);

// --- Bookings ---
Route::get('/bookings', [BookingController::class, 'index']);
Route::get('/bookings/{id}', [BookingController::class, 'show']);
Route::middleware('auth:api')->post('/bookings', [BookingController::class, 'store']);
Route::middleware('auth:api')->delete('/bookings/{id}', [BookingController::class, 'destroy']);

// --- Payments ---
Route::get('/payments', [PaymentController::class, 'index']);
Route::middleware('auth:api')->post('/payments', [PaymentController::class, 'store']);

// --- AI Chatbot ---
Route::post('/chat', [ChatbotController::class, 'handleChat'])->middleware('throttle:30,1');

// --- AI Description ---
Route::post('/generate-event', [ChatbotController::class, 'generateEventContent']);

// --- Authenticated user info ---
Route::middleware('auth:api')->get('/profile', [AuthController::class, 'profile']);
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


// --- Bkash ---
Route::middleware('auth:api')->post('/bkash/create', [PaymentController::class, 'createBkashPayment']);
Route::get('/bkash/callback', [PaymentController::class, 'bkashCallback'])->name('bkash.callback');