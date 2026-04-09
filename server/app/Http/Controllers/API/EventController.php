<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only(['store', 'update', 'destroy']);
    }

    public function index()
    {
        return Event::with(['category', 'venue', 'tickets'])->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'event_name' => 'required|string',
            'description' => 'required|string',
            'start_date_time' => 'required',
            'venue' => 'nullable|string',
            'category' => 'nullable|string',
            'price' => 'nullable|numeric',
            'image_base64' => 'nullable|string'
        ]);

        $catName = $validatedData['category'] ?? 'General';
        $category = \App\Models\Category::firstOrCreate(['category_name' => substr($catName, 0, 255)]);

        $venName = $validatedData['venue'] ?? 'TBD';
        $venue = \App\Models\Venue::firstOrCreate(
            ['name' => substr($venName, 0, 255)],
            ['location' => substr($venName, 0, 255), 'total_capacity' => 100]
        );

        $event = new Event();
        $event->event_name = substr($validatedData['event_name'], 0, 100);
        $event->description = $validatedData['description'];
        $event->start_date_time = substr($validatedData['start_date_time'], 0, 50);
        $event->venue_id = $venue->venue_id;
        $event->category_id = $category->category_id;
        $firstUser = \App\Models\User::first();
        if (!$firstUser) {
            $firstUser = new \App\Models\User();
            $firstUser->user_name = 'Demo User';
            $firstUser->email = 'demo@example.com';
            $firstUser->phone = '0000000';
            $firstUser->password_hash = bcrypt('password');
            $firstUser->role_id = 1;
            $firstUser->save();
        }
        $event->user_id = auth()->id() ?? $firstUser->user_id;

        // Handle image upload to Cloudinary
        if (!empty($validatedData['image_base64'])) {
            $imageData = $validatedData['image_base64'];
            
            // If the incoming data is not a data URI, let's format it as one before sending to Cloudinary
            if (!preg_match('/^data:image\/(\w+);base64,/', $imageData) && !str_starts_with($imageData, 'http')) {
                $imageData = "data:image/png;base64," . $imageData;
            }

            if (str_starts_with($imageData, 'http')) {
                $event->image_url = $imageData;
            } else {
                $timestamp = time();
                $apiSecret = env('CLOUDINARY_API_SECRET');
                $signature = sha1("timestamp={$timestamp}{$apiSecret}");

                try {
                    $response = \Illuminate\Support\Facades\Http::post("https://api.cloudinary.com/v1_1/" . env('CLOUDINARY_CLOUD_NAME') . "/image/upload", [
                        'file' => $imageData,
                        'api_key' => env('CLOUDINARY_API_KEY'),
                        'timestamp' => $timestamp,
                        'signature' => $signature,
                    ]);

                    if ($response->successful()) {
                        $event->image_url = $response->json('secure_url');
                    } else {
                        \Log::error("Cloudinary Upload Failed", $response->json());
                    }
                } catch (\Exception $e) {
                    \Log::error("Cloudinary Exception", ['msg' => $e->getMessage()]);
                }
            }
        }

        $event->save();

        if (array_key_exists('price', $validatedData) && $validatedData['price'] !== null) {
            \App\Models\Ticket::create([
                'ticket_type' => 'General',
                'price' => $validatedData['price'],
                'quantity' => 100,
                'event_id' => $event->event_id
            ]);
        }

        return response()->json([
            'message' => 'Event Created',
            'event' => $event
        ], 201);
    }

    public function show($id)
    {
        return Event::with(['category', 'venue', 'tickets'])->find($id);
    }

    public function update(Request $request, $id)
    {
        $event = Event::find($id);
        $event->update($request->all());

        return response()->json([
            'message' => 'Event Updated'
        ]);
    }

    public function destroy($id)
    {
        Event::destroy($id);

        return response()->json([
            'message' => 'Event Deleted'
        ]);
    }
}