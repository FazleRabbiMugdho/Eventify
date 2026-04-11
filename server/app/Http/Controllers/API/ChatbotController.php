<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Event;
use App\Models\Venue;
use App\Models\Category;
use App\Models\Ticket;

class ChatbotController extends Controller
{
    public function handleChat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $userMessage = $request->input('message');
        $apiKey = env('GEMINI_API_KEY');
        $primaryModel = env('GEMINI_MODEL', 'gemini-2.5-flash');

        if (!$apiKey) {
            return response()->json(['error' => 'AI configuration missing on server.'], 500);
        }

        $searchParams = $this->extractSearchParameters($userMessage, $apiKey, $primaryModel);
        $eventData = $this->getEventSummary($searchParams);

        try {
            $modelCandidates = array_values(array_unique([
                $primaryModel,
                'gemini-2.5-flash',
                'gemini-flash-latest',
                'gemini-2.0-flash',
            ]));

            foreach ($modelCandidates as $model) {
                $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

                $response = Http::withoutVerifying()
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->timeout(20)
                ->post($url, [
                    'system_instruction' => [
                        'parts' => [
                            ['text' => 'You are a helpful customer support agent for Eventify. 
                             
                             Context: Here are the current events in our database:
                             ' . $eventData . '
                             
                             Instructions: Use the context above to answer user questions about events, locations, and prices. If a user asks for something not in the list, tell them you don\'t see it but they can check our Explore page. Keep answers brief and friendly.']
                        ]
                    ],
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $userMessage]
                            ]
                        ]
                    ]
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $aiReply = $data['candidates'][0]['content']['parts'][0]['text'] ?? "I'm sorry, I couldn't process that.";

                    return response()->json([
                        'reply' => $aiReply
                    ]);
                }

                Log::warning('Gemini model request failed in chat', [
                    'model' => $model,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                if ($response->status() === 429) {
                    return response()->json(['error' => 'AI quota exceeded. Please try again later.'], 429);
                }

                if (in_array($response->status(), [401, 403], true)) {
                    return response()->json(['error' => 'AI authentication failed. Check GEMINI_API_KEY.'], 500);
                }

                if ($response->status() !== 404) {
                    break;
                }
            }

            return response()->json(['error' => 'Failed to connect to AI.'], 500);

        } catch (\Exception $e) {
            Log::error('Chatbot Controller Exception: ' . $e->getMessage());
            return response()->json(['error' => 'AI Service unavailable'], 500);
        }
    }

    public function generateEventContent(Request $request)
    {
        $request->validate([
            'keywords' => 'required|string|max:500'
        ]);

        $keywords = $request->input('keywords');
        $apiKey = env('GEMINI_API_KEY');
        $primaryModel = env('GEMINI_MODEL', 'gemini-2.5-flash');

        if (!$apiKey) {
            return response()->json(['error' => 'API Key missing'], 500);
        }

        $prompt = "You are an expert event promoter and copywriter. Generate event details based on these keywords: '{$keywords}'. 
                   You MUST respond with ONLY a valid JSON object. Do not use markdown formatting like ```json. 
                   The JSON object must have exactly these three keys:
                   'title': A short, catchy event title.
                   'description': An engaging, 2-paragraph promotional description.
                   'tags': A comma-separated string of 3 to 5 relevant hashtags.";

        try {
            $modelCandidates = array_values(array_unique([
                $primaryModel,
                'gemini-2.5-flash',
                'gemini-flash-latest',
                'gemini-2.0-flash',
            ]));

            foreach ($modelCandidates as $model) {
                $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

                $response = Http::withoutVerifying()
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->timeout(60)
                ->post($url, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ]
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $aiReply = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

                    $aiReply = str_replace(['```json', '```'], '', $aiReply);
                    $aiReply = trim($aiReply);

                    $aiReply = trim($aiReply, "\n\r \t");

                    $eventData = json_decode($aiReply, true);

                    if (json_last_error() === JSON_ERROR_NONE && is_array($eventData)) {
                        $title = isset($eventData['title']) && is_string($eventData['title']) ? trim($eventData['title']) : null;
                        $description = isset($eventData['description']) && is_string($eventData['description']) ? trim($eventData['description']) : null;
                        $tags = null;

                        if (isset($eventData['tags'])) {
                            if (is_array($eventData['tags'])) {
                                $tags = implode(',', array_map('trim', $eventData['tags']));
                            } elseif (is_string($eventData['tags'])) {
                                $tags = trim($eventData['tags']);
                            }
                        }

                        if (empty($tags)) {
                            preg_match_all('/#?([A-Za-z0-9_\\-]+)/', $aiReply, $m);
                            if (!empty($m[1])) {
                                $extracted = array_slice($m[1], 0, 5);
                                $parts = array_map(function ($t) { return '#'.ltrim($t, '#'); }, $extracted);
                                $tags = implode(',', $parts);
                            }
                        } else {
                            $parts = array_filter(array_map('trim', explode(',', $tags)));
                            $parts = array_map(function ($t) { return (strpos($t, '#') === 0) ? $t : '#'.ltrim($t, '#'); }, $parts);
                            $tags = implode(',', $parts);
                        }

                        if ($title && $description && $tags) {
                            return response()->json([
                                'title' => $title,
                                'description' => $description,
                                'tags' => $tags
                            ]);
                        }

                        Log::warning('Event generator returned incomplete JSON', ['aiReply' => $aiReply, 'parsed' => $eventData]);
                        return response()->json([
                            'title' => $title ?? 'AI Generated Event',
                            'description' => $description ?? $aiReply,
                            'tags' => $tags ?? '#eventify'
                        ]);
                    } else {
                        Log::warning('Event generator JSON decode failed', ['aiReply' => $aiReply, 'json_error' => json_last_error_msg()]);
                        return response()->json([
                            'title' => 'AI Generated Event',
                            'description' => $aiReply,
                            'tags' => '#eventify'
                        ]);
                    }
                }

                Log::warning('Gemini model request failed in generator', [
                    'model' => $model,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                if ($response->status() === 429) {
                    return response()->json(['error' => 'AI quota exceeded. Please try again later.'], 429);
                }

                if (in_array($response->status(), [401, 403], true)) {
                    return response()->json(['error' => 'AI authentication failed. Check GEMINI_API_KEY.'], 500);
                }

                if ($response->status() !== 404) {
                    break;
                }
            }

            return response()->json(['error' => 'Failed to connect to AI.'], 500);

        } catch (\Exception $e) {
            Log::error('Event Generator Exception: ' . $e->getMessage());
            // This is the ONLY changed line. It exposes the actual crash reason.
            return response()->json([
                'error' => 'AI Service unavailable',
                'debug_info' => $e->getMessage() 
            ], 500);
        }
    }

    /**
     * Helper to use Gemini to extract search intent from user message
     */
    private function extractSearchParameters($message, $apiKey, $primaryModel)
    {
        $prompt = "Extract search parameters from the following user message if they are looking for an event.
User Message: '{$message}'
Return ONLY a valid JSON object. Do not include markdown formatting.
If the user specifies a location or city, set 'location'.
If the user specifies a budget or maximum price, set 'max_budget' (as integer).
If the user specifies an event name or keywords, set 'event_name'.
If no parameters exist or it's a general greeting, return an empty JSON object {}.";

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$primaryModel}:generateContent?key={$apiKey}";
            $response = Http::withoutVerifying()
                ->withHeaders(['Content-Type' => 'application/json'])
                ->timeout(15)
                ->post($url, [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $aiReply = $data['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
                
                // Clean up any markdown
                $aiReply = str_replace(['```json', '```'], '', $aiReply);
                $params = json_decode(trim($aiReply), true);
                
                return is_array($params) ? $params : [];
            }
        } catch (\Exception $e) {
            Log::warning('Chatbot parameter extraction failed: ' . $e->getMessage());
        }
        
        return [];
    }

    /**
     * Helper to fetch upcoming events and format them for AI context.
     */
    private function getEventSummary($searchParams = [])
    {
        try {
            // Fetch upcoming events with venue and tickets
            $query = Event::with(['venue', 'category', 'tickets'])
                ->where('start_date_time', '>=', now()->subDays(1));

            $hasFilters = false;

            if (!empty($searchParams['location'])) {
                $location = strtolower($searchParams['location']);
                $query->whereHas('venue', function($q) use ($location) {
                    $q->where('location', 'LIKE', "%{$location}%")
                      ->orWhere('name', 'LIKE', "%{$location}%");
                });
                $hasFilters = true;
            }

            if (!empty($searchParams['max_budget']) && is_numeric($searchParams['max_budget'])) {
                $budget = (float)$searchParams['max_budget'];
                $query->whereHas('tickets', function($q) use ($budget) {
                    $q->where('price', '<=', $budget);
                });
                $hasFilters = true;
            }

            if (!empty($searchParams['event_name'])) {
                $name = strtolower($searchParams['event_name']);
                $query->where('event_name', 'LIKE', "%{$name}%")
                      ->orWhere('description', 'LIKE', "%{$name}%");
                $hasFilters = true;
            }

            $events = $query->orderBy('start_date_time', 'asc')->limit($hasFilters ? 20 : 30)->get();

            // If it was a filtered search and returned nothing, we still want to provide context
            if ($events->isEmpty() && $hasFilters) {
                $fallbackEvents = Event::with(['venue', 'category', 'tickets'])
                    ->where('start_date_time', '>=', now()->subDays(1))
                    ->orderBy('start_date_time', 'asc')
                    ->limit(10)
                    ->get();
                    
                if ($fallbackEvents->isEmpty()) {
                    return "Database Search Results: No matching events found, and no other upcoming events are available.";
                }

                $summary = "Database Search Results: No exact matches found for the user's specific criteria.\nHowever, here are SOME OTHER available upcoming events they might like:\n";
                $events = $fallbackEvents;
            } else if ($events->isEmpty()) {
                return "No upcoming events found at the moment.";
            } else {
                $summary = "Database Search Results (Found matching events):\n";
            }

            foreach ($events as $event) {
                $priceRange = $event->tickets->isEmpty() 
                    ? "Free" 
                    : "Price: BDT " . $event->tickets->min('price') . " - " . $event->tickets->max('price');
                
                $summary .= "- Event: {$event->event_name}\n";
                $summary .= "  Description: {$event->description}\n";
                $summary .= "  Category: " . ($event->category->category_name ?? 'General') . "\n";
                $summary .= "  Location: " . ($event->venue->location ?? ($event->venue->name ?? 'TBD')) . "\n";
                $summary .= "  Date: {$event->start_date_time}\n";
                $summary .= "  {$priceRange}\n\n";
            }

            return $summary;
        } catch (\Exception $e) {
            Log::error("Chatbot Event Summary Error: " . $e->getMessage());
            return "Error retrieving event data.";
        }
    }
}