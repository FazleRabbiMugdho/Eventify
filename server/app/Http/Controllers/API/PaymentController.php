<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
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
        
        if (!$response->successful()) {
            \Log::error('bKash Token Grant Failed', ['status' => $response->status(), 'body' => $response->json()]);
            return ['error' => 'Token Grant Failed', 'details' => $response->json()];
        }

        $data = $response->json();
        \Log::info('bKash Token Grant Success', ['id_token' => substr($data['id_token'] ?? '', 0, 20) . '...']);
        return $data['id_token'] ?? null;
    }

    public function createBkashPayment(Request $request) {
        $request->validate([
            'ticket_id' => 'required',
            'customer_name' => 'required|string|max:255',
            'customer_email' => ['required', 'email'],
            'customer_phone' => ['required', 'string', 'size:11', 'regex:/^01[3-9]\d{8}$/'],
        ]);

        $ticket = \App\Models\Ticket::find($request->ticket_id);
        if (!$ticket) {
            return response()->json(['error' => 'Invalid ticket ID.'], 404);
        }

        // Always get the amount from the database, do not trust client input
        $amount = $ticket->price;

        $tokenResponse = $this->getToken();

        if (is_array($tokenResponse) && isset($tokenResponse['error'])) {
            return response()->json([
                'error' => 'Could not connect to bKash API.',
                'debug' => $tokenResponse['details']
            ], 400);
        }

        if (!$tokenResponse) {
            return response()->json(['error' => 'Could not obtain bKash token.'], 500);
        }

        $token = $tokenResponse;

        // Generate a short unique reference to cache customer details
        // This keeps the callbackURL short (bKash rejects long URLs)
        $ref = 'bkash_' . uniqid();
        Cache::put($ref, [
            'ticket_id'      => $request->ticket_id,
            'user_id'        => auth()->id(),
            'customer_name'  => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
        ], now()->addMinutes(30));

        // Use a short callbackURL — only pass the cache reference key
        $callbackURL = route('bkash.callback', ['ref' => $ref]);

        $merchantInvoiceNumber = 'INV' . time() . rand(100, 999);

        \Log::info('bKash Create Payment Request', [
            'callbackURL' => $callbackURL,
            'amount'      => number_format($amount, 2, '.', ''),
            'invoice'     => $merchantInvoiceNumber,
        ]);

        // IMPORTANT: bKash tokenized API uses the raw id_token, NOT 'Bearer <token>'
        $response = Http::withHeaders([
            'Authorization'  => $token,
            'X-APP-Key'      => env('BKASH_APP_KEY'),
            'Content-Type'   => 'application/json',
        ])->post("{$this->baseUrl}/tokenized/checkout/create", [
            'mode'                  => '0011',
            'payerReference'        => (string) $request->ticket_id,
            'callbackURL'           => $callbackURL,
            'amount'                => (string) number_format($amount, 2, '.', ''),
            'currency'              => 'BDT',
            'intent'                => 'sale',
            'merchantInvoiceNumber' => $merchantInvoiceNumber,
        ]);

        $result = $response->json();

        \Log::info('bKash Create Payment Response', ['status' => $response->status(), 'body' => $result]);

        if (isset($result['bkashURL'])) {
            return response()->json(['bkashURL' => $result['bkashURL']]);
        }

        return response()->json([
            'error' => 'bKash Create Payment Failed',
            'debug' => $result
        ], 400);
    }

    public function bkashCallback(Request $request) {
        $status = $request->status;

        // Retrieve customer details from cache using the short reference key
        $ref = $request->ref;
        $customerData = $ref ? Cache::get($ref) : null;

        // CANCELLATION: User manually closed the bKash window -> TREAT AS FAIL
        if ($status == 'cancel') {
            if ($ref) Cache::forget($ref);
            return redirect(config('app.frontend_url') . "/payment/failed?reason=cancelled");
        }

        //WALLET LOCKED or FAILED
        if ($status == 'failure' || $status == 'failed') {
            if ($ref) Cache::forget($ref);
            return redirect(config('app.frontend_url') . "/payment/failed?reason=failed");
        }

        //NORMAL SUCCESS: Execute the real payment
        if ($status == 'success') {
            if (!$customerData) {
                \Log::error('bKash Callback: customer data missing from cache', ['ref' => $ref]);
                return redirect(config('app.frontend_url') . "/payment/failed?reason=session_expired");
            }

            $token = $this->getToken();

            if (!$token || is_array($token)) {
                if ($ref) Cache::forget($ref);
                return redirect(config('app.frontend_url') . "/payment/failed?reason=token_error");
            }

            // IMPORTANT: bKash tokenized API uses the raw id_token, NOT 'Bearer <token>'
            $response = Http::withHeaders([
                'Authorization' => $token,
                'X-APP-Key'     => env('BKASH_APP_KEY'),
                'Content-Type'  => 'application/json',
            ])->post("{$this->baseUrl}/tokenized/checkout/execute", [
                'paymentID' => $request->paymentID
            ]);

            $result = $response->json();
            \Log::info('bKash Execute Response', ['status' => $response->status(), 'body' => $result]);

            // If the execution is perfectly verified
            if (isset($result['statusCode']) && $result['statusCode'] == '0000') {
                if ($ref) Cache::forget($ref);
                return $this->savePaymentAndRedirect($customerData, $result['amount'], $result['trxID']);
            }
        }

        // Any other unknown state -> TREAT AS FAIL
        if ($ref) Cache::forget($ref);
        return redirect(config('app.frontend_url') . "/payment/failed?reason=unknown_error");
    }

    // --- Helper Function to keep database logic clean ---
    // $data is now an array (from cache), not a Request object
    private function savePaymentAndRedirect($data, $amount, $trx_id) {
        // Create Booking
        $booking = Booking::create([
            'booking_date'   => Carbon::now()->toDateTimeString(),
            'user_id'        => $data['user_id'],
            'ticket_id'      => $data['ticket_id'],
            'payment_id'     => 0,
            'customer_name'  => $data['customer_name'],
            'customer_email' => $data['customer_email'],
            'customer_phone' => $data['customer_phone'],
        ]);

        // Create Payment
        $payment = Payment::create([
            'pay_amount'     => $amount,
            'payment_method' => 'bKash',
            'booking_id'     => $booking->booking_id
        ]);

        // Update Link
        $booking->update(['payment_id' => $payment->payment_id]);

        // Redirect to React
        $frontend = config('app.frontend_url');
        return redirect("{$frontend}/payment/success?booking_id={$booking->booking_id}&trx_id={$trx_id}");
    }
}