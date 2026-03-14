<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Venue;

class VenueController extends Controller
{
    // List all venues
    public function index()
    {
        return response()->json(Venue::all());
    }

    // Show a single venue
    public function show($id)
    {
        $venue = Venue::find($id);
        if (!$venue) return response()->json(['message' => 'Venue not found'], 404);

        return response()->json($venue);
    }

    // Create a new venue
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'total_capacity' => 'required|integer|min:1',
        ]);

        $venue = Venue::create($request->only('name', 'location', 'total_capacity'));

        return response()->json(['message' => 'Venue created', 'venue' => $venue], 201);
    }

    // Update a venue
    public function update(Request $request, $id)
    {
        $venue = Venue::find($id);
        if (!$venue) return response()->json(['message' => 'Venue not found'], 404);

        $venue->update($request->only('name', 'location', 'total_capacity'));

        return response()->json(['message' => 'Venue updated', 'venue' => $venue]);
    }

    // Delete a venue
    public function destroy($id)
    {
        $venue = Venue::find($id);
        if (!$venue) return response()->json(['message' => 'Venue not found'], 404);

        $venue->delete();
        return response()->json(['message' => 'Venue deleted']);
    }
}