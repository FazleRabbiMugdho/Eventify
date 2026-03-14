<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;

class PaymentController extends Controller
{

    public function index()
    {
        return Payment::all();
    }

    public function store(Request $request)
    {
        $payment = Payment::create($request->all());

        return response()->json([
            'message'=>'Payment Successful',
            'payment'=>$payment
        ],201);
    }

}