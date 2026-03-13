<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{

    public function index()
    {
        return Event::all();
    }

    public function store(Request $request)
    {
        $event = Event::create($request->all());

        return response()->json([
            'message' => 'Event Created',
            'event' => $event
        ],201);
    }

    public function show($id)
    {
        return Event::find($id);
    }

    public function update(Request $request,$id)
    {
        $event = Event::find($id);
        $event->update($request->all());

        return response()->json([
            'message'=>'Event Updated'
        ]);
    }

    public function destroy($id)
    {
        Event::destroy($id);

        return response()->json([
            'message'=>'Event Deleted'
        ]);
    }
}