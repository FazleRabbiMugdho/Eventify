<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    // List all reviews
    public function index()
    {
        return Review::all();
    }

    // Store a new review
    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer',
            'comment' => 'required|string|max:100',
            'event_id' => 'required|exists:events,event_id',
            'user_id' => 'required|exists:users,user_id',
        ]);

        $review = Review::create([
            'rating' => $request->rating,
            'comment' => $request->comment,
            'review_date' => now(),
            'event_id' => $request->event_id,
            'user_id' => $request->user_id,
        ]);

        return response()->json([
            'message' => 'Review saved successfully',
            'review' => $review
        ], 201);
    }
}