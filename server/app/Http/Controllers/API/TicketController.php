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
        $ticket = Ticket::create($request->all());

        return response()->json([
            'message'=>'Ticket Created',
            'ticket'=>$ticket
        ],201);
    }

    public function show($id)
    {
        return Ticket::find($id);
    }

    public function update(Request $request,$id)
    {
        $ticket = Ticket::find($id);
        $ticket->update($request->all());

        return response()->json([
            'message'=>'Ticket Updated'
        ]);
    }

    public function destroy($id)
    {
        Ticket::destroy($id);

        return response()->json([
            'message'=>'Ticket Deleted'
        ]);
    }
}