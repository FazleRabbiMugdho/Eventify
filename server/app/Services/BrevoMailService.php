<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class BrevoMailService
{
    protected string $apiKey;
    protected string $fromEmail;
    protected string $fromName;
    protected string $apiUrl = 'https://api.brevo.com/v3/smtp/email';

    public function __construct()
    {
        $this->apiKey    = env('BREVO_API_KEY', '');
        $this->fromEmail = env('MAIL_FROM_ADDRESS', 'noreply@eventify.com');
        $this->fromName  = env('MAIL_FROM_NAME', 'Eventify');
    }

    /**
     * Send an email using Brevo's HTTP API (works on Railway — no SMTP needed).
     *
     * @param  string  $toEmail
     * @param  string  $toName
     * @param  string  $subject
     * @param  string  $htmlContent
     * @return bool
     * @throws \Exception
     */
    public function send(string $toEmail, string $toName, string $subject, string $htmlContent): bool
    {
        $response = Http::withHeaders([
            'api-key'      => $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept'       => 'application/json',
        ])->post($this->apiUrl, [
            'sender' => [
                'name'  => $this->fromName,
                'email' => $this->fromEmail,
            ],
            'to' => [
                [
                    'email' => $toEmail,
                    'name'  => $toName,
                ],
            ],
            'subject'     => $subject,
            'htmlContent' => $htmlContent,
        ]);

        if (!$response->successful()) {
            $body = $response->body();
            Log::error('Brevo API error', ['status' => $response->status(), 'body' => $body]);
            throw new \Exception('Brevo API error (' . $response->status() . '): ' . $body);
        }

        return true;
    }

    /**
     * Send OTP verification email.
     */
    public function sendOtp(string $toEmail, string $userName, string $otp): bool
    {
        $html = View::make('emails.otp_mail', [
            'otp'      => $otp,
            'userName' => $userName,
        ])->render();

        return $this->send($toEmail, $userName, 'Email Verification Code - Eventify', $html);
    }

    /**
     * Send password reset email.
     */
    public function sendPasswordReset(string $toEmail, string $userName, string $otp): bool
    {
        $html = View::make('emails.password_reset', [
            'otp'      => $otp,
            'userName' => $userName,
        ])->render();

        return $this->send($toEmail, $userName, 'Password Reset - Verification Code', $html);
    }
}
