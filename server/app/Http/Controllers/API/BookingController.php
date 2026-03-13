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
        $booking = Booking::create($request->all());

        return response()->json([
            'message'=>'Booking Successful',
            'booking'=>$booking
        ],201);
    }

    public function show($id)
    {
        return Booking::find($id);
    }

    public function destroy($id)
    {
        Booking::destroy($id);

        return response()->json([
            'message'=>'Booking Cancelled'
        ]);
    }
}