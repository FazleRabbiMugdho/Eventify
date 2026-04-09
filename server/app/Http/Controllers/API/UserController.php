<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // List all users
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Show a single user
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    // Create a new user
    // Create a new user
    public function store(Request $request)
    {
        $request->validate([
            'user_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password_hash' => 'required|string|min:6',
        ]);

        $user = User::create([
            'user_name' => $request->user_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password_hash' => Hash::make($request->password_hash),
            'role_id' => 1,
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    // Update a user
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->update($request->only(['user_name', 'full_name', 'email', 'phone', 'role_id']));
        if ($request->password_hash) {
            $user->password_hash = Hash::make($request->password_hash);
            $user->save();
        }

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    // Delete a user
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    // Get My Events (Hosting and Attending)
    public function myEvents()
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $hosting = \App\Models\Event::with(['category', 'venue', 'tickets.bookings'])
            ->where('user_id', $userId)
            ->get();

        $attending = \App\Models\Event::with(['category', 'venue', 'tickets'])
            ->whereHas('tickets.bookings', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->distinct() // Important in case the user booked multiple tickets for the same event
            ->get();

        return response()->json([
            'hosting' => $hosting,
            'attending' => $attending
        ]);
    }
}