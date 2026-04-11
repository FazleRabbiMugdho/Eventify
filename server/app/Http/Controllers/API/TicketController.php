<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ticket;

class TicketController extends Controller
{

    public function index()
    {
        return Ticket::all();
    }

    public function store(Request $request)
    {
        // OWASP Mass Assignment Prevention
        $ticket = Ticket::create($request->only(['ticket_type', 'price', 'quantity', 'event_id']));

        return response()->json([
            'message' => 'Ticket Created',
            'ticket' => $ticket
        ], 201);
    }

    public function show($id)
    {
        return Ticket::find($id);
    }

    public function update(Request $request, $id)
    {
        $ticket = Ticket::with('event')->find($id);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        // OWASP Broken Access Control (IDOR Prevention)
        if ($ticket->event->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        // OWASP Mass Assignment Prevention
        $ticket->update($request->only(['ticket_type', 'price', 'quantity', 'event_id']));

        return response()->json([
            'message' => 'Ticket Updated'
        ]);
    }

    public function destroy($id)
    {
        $ticket = Ticket::with('event')->find($id);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        // OWASP Broken Access Control (IDOR Prevention)
        if ($ticket->event->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized action'], 403);
        }

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket Deleted'
        ]);
    }
}