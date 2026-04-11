<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{

    public function index()
    {
        return Booking::all();
    }

    public function store(Request $request)
    {
        // OWASP Mass Assignment Prevention & A01:2021 Broken Access Control
        // Force the booking's user_id to be the currently authenticated user's ID
        $data = $request->only(['ticket_id', 'booking_date', 'payment_id']);
        $data['user_id'] = auth()->id();

        $booking = Booking::create($data);

        return response()->json([
            'message' => 'Booking Successful',
            'booking' => $booking
        ], 201);
    }

    public function show($id)
    {
        return Booking::find($id);
    }

    public function destroy($id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // OWASP Broken Access Control (IDOR Prevention)
        if ($booking->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        $booking->delete();

        return response()->json([
            'message' => 'Booking Cancelled'
        ]);
    }
}