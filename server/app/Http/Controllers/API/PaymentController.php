<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Payment;
use App\Models\Booking;
use Carbon\Carbon;

class PaymentController extends Controller
{
    private $baseUrl;

    public function __construct() {
        $this->baseUrl = env('BKASH_BASE_URL');
    }

    private function getToken() {
        $response = Http::withHeaders([
            'username' => env('BKASH_USERNAME'),
            'password' => env('BKASH_PASSWORD'),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post("{$this->baseUrl}/tokenized/checkout/token/grant", [
            'app_key' => env('BKASH_APP_KEY'),
            'app_secret' => env('BKASH_APP_SECRET'),
        ]);
        
        return $response->json('id_token'); 
    }

    public function createBkashPayment(Request $request) {
        $request->validate([
            'ticket_id' => 'required'
        ]);

        $ticket = \App\Models\Ticket::find($request->ticket_id);
        if (!$ticket) {
            return response()->json(['error' => 'Invalid ticket ID.'], 404);
        }

        // Always get the amount from the database, do not trust client input
        $amount = $ticket->price;

        $token = $this->getToken();

        if (!$token) {
            return response()->json(['error' => 'Could not connect to bKash API.'], 400);
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$token}",
            'X-APP-Key' => env('BKASH_APP_KEY'),
        ])->post("{$this->baseUrl}/tokenized/checkout/create", [
            'mode' => '0011',
            'payerReference' => ' ',
            'callbackURL' => route('bkash.callback', ['ticket_id' => $request->ticket_id, 'user_id' => auth()->id()]),
            'amount' => $amount,
            'currency' => 'BDT',
            'intent' => 'sale',
            'merchantInvoiceNumber' => 'INV' . uniqid()
        ]);

        $result = $response->json();

        if (isset($result['bkashURL'])) {
            return response()->json(['bkashURL' => $result['bkashURL']]);
        }

        return response()->json(['error' => 'bKash Create Payment Failed'], 400);
    }

    public function bkashCallback(Request $request) {
        $status = $request->status;

        // Security check: Make sure the callback hasn't been intercepted/tampered to impersonate someone else
        if ($request->user_id != auth()->id()) {
             return redirect(env('FRONTEND_URL', 'http://localhost:3000') . "/payment/failed?reason=auth_error");
        }

        // CANCELLATION: User manually closed the bKash window -> TREAT AS FAIL
        if ($status == 'cancel') {
            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . "/payment/failed?reason=cancelled");
        }

        //WALLET LOCKED or FAILED
        if ($status == 'failure' || $status == 'failed') {
            return redirect(env('FRONTEND_URL', 'http://localhost:3000') . "/payment/failed?reason=failed");
        }

        //NORMAL SUCCESS: Execute the real payment
        if ($status == 'success') {
            $token = $this->getToken();
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'X-APP-Key' => env('BKASH_APP_KEY'),
            ])->post("{$this->baseUrl}/tokenized/checkout/execute", [
                'paymentID' => $request->paymentID
            ]); 

            $result = $response->json();

            // If the execution is perfectly verified
            if (isset($result['statusCode']) && $result['statusCode'] == '0000') {
                return $this->savePaymentAndRedirect($request, $result['amount'], $result['trxID']);
            }
        }

        // Any other unknown state -> TREAT AS FAIL
        return redirect(env('FRONTEND_URL', 'http://localhost:3000') . "/payment/failed?reason=unknown_error");
    }

    // --- Helper Function to keep database logic clean ---
    private function savePaymentAndRedirect($request, $amount, $trx_id) {
        // Create Booking
        $booking = Booking::create([
            'booking_date' => Carbon::now()->toDateTimeString(),
            'user_id' => $request->user_id,
            'ticket_id' => $request->ticket_id,
            'payment_id' => 0 
        ]);

        // Create Payment
        $payment = Payment::create([
            'pay_amount' => $amount,
            'payment_method' => 'bKash',
            'booking_id' => $booking->booking_id
        ]);

        // Update Link
        $booking->update(['payment_id' => $payment->payment_id]);

        // Redirect to React
        $frontend = env('FRONTEND_URL', 'http://localhost:3000');
        return redirect("{$frontend}/payment/success?booking_id={$booking->booking_id}&trx_id={$trx_id}");
    }
}