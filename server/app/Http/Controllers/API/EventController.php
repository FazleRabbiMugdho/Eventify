<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only(['update', 'destroy']);
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
        $event->description = substr($validatedData['description'], 0, 100);
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

        // Handle base64 image upload
        if (!empty($validatedData['image_base64'])) {
            $cloudinaryUrl = env('CLOUDINARY_URL');
            $uploaded = false;

            if ($cloudinaryUrl) {
                try {
                    $parsed = parse_url($cloudinaryUrl);
                    $api_key = $parsed['user'] ?? '';
                    $api_secret = $parsed['pass'] ?? '';
                    $cloud_name = $parsed['host'] ?? '';

                    $timestamp = time();
                    $signature = sha1("timestamp=" . $timestamp . $api_secret);

                    $imageData = $validatedData['image_base64'];
                    if (!preg_match('/^data:image\/\w+;base64,/', $imageData)) {
                        $imageData = 'data:image/png;base64,' . $imageData;
                    }

                    $response = \Illuminate\Support\Facades\Http::asForm()->post("https://api.cloudinary.com/v1_1/{$cloud_name}/image/upload", [
                        'file' => $imageData,
                        'api_key' => $api_key,
                        'timestamp' => $timestamp,
                        'signature' => $signature
                    ]);

                    if ($response->successful() && $secureUrl = $response->json('secure_url')) {
                        $event->image_url = $secureUrl;
                        $uploaded = true;
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Cloudinary upload failed: ' . $e->getMessage());
                }
            }

            if (!$uploaded) {
                $imageData = $validatedData['image_base64'];
                if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $matches)) {
                    $extension = $matches[1];
                    $imageData = substr($imageData, strpos($imageData, ',') + 1);
                } else {
                    $extension = 'png';
                }
                $imageData = base64_decode($imageData);
                if ($imageData !== false) {
                    $fileName = 'events/' . uniqid('evt_') . '.' . $extension;
                    \Illuminate\Support\Facades\Storage::disk('public')->put($fileName, $imageData);
                    $event->image_url = $fileName;
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