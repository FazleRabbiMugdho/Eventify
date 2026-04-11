<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_name' => 'required|string|max:255',
            'email' => ['required', 'email', 'unique:users,email', 'regex:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{3}$/'],
            'phone' => [
                'required',
                'string',
                'size:11',
                'regex:/^01[3-9]\d{8}$/',
                'unique:users,phone'
            ],
            'password_hash' => [
                'required',
                'string',
                'min:6',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/'
            ],
        ], [
            'phone.size' => 'Phone number must be exactly 11 digits.',
            'phone.regex' => 'Invalid Bangladeshi phone number (should start with 013-019).',
            'phone.unique' => 'This phone number is already registered.',
            'password_hash.min' => 'Password should consist at least 6 characters',
            'password_hash.regex' => 'Password must contain uppercase, lowercase, numbers and special characters',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $profilePictureUrl = null;

        // Handle image upload to Cloudinary
        if (!empty($request->profile_picture)) {
            $imageData = $request->profile_picture;
            
            if (!preg_match('/^data:image\/(\w+);base64,/', $imageData) && !str_starts_with($imageData, 'http')) {
                $imageData = "data:image/png;base64," . $imageData;
            }

            if (str_starts_with($imageData, 'http')) {
                $profilePictureUrl = $imageData;
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
                        $profilePictureUrl = $response->json('secure_url');
                    }
                } catch (\Exception $e) {
                    \Log::error("Cloudinary Exception in Register", ['msg' => $e->getMessage()]);
                }
            }
        }

        // Generate 6-digit OTP
        $otp = sprintf("%06d", mt_rand(1, 999999));
        $otpExpiresAt = now()->addMinutes(10);

        $user = User::create([
            'user_name' => $request->user_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password_hash' => Hash::make($request->password_hash),
            'role_id' => 1,
            'profile_picture' => $profilePictureUrl,
            'is_verified' => 0,
            'otp' => $otp,
            'otp_expires_at' => $otpExpiresAt
        ]);

        // Send OTP Email
        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\OtpMail($otp, $user->user_name));
        } catch (\Exception $e) {
            \Log::error("Failed to send OTP email: " . $e->getMessage());
            // Optionally: handle mail failure (e.g., still allow registration but inform user)
        }

        return response()->json([
            'message' => 'Registration successful. Please check your email for the verification code.',
            'email' => $user->email
        ], 201);
    }

    // VERIFY OTP
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'otp'   => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->is_verified) {
            return response()->json(['message' => 'User is already verified'], 400);
        }

        if ($user->otp !== $request->otp) {
            return response()->json(['message' => 'Invalid verification code'], 400);
        }

        if (now()->gt($user->otp_expires_at)) {
            return response()->json(['message' => 'Verification code has expired'], 400);
        }

        // Mark as verified
        $user->is_verified = 1;
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        // Auto-login
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Account verified successfully',
            'token' => $token,
            'user' => $user
        ], 200);
    }

    // RESEND OTP
    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user->is_verified) {
            return response()->json(['message' => 'User is already verified'], 400);
        }

        // Generate new OTP
        $otp = sprintf("%06d", mt_rand(1, 999999));
        $user->otp = $otp;
        $user->otp_expires_at = now()->addMinutes(10);
        $user->save();

        // Send Email
        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\OtpMail($otp, $user->user_name));
        } catch (\Exception $e) {
            \Log::error("Failed to resend OTP email: " . $e->getMessage());
            return response()->json(['message' => 'Failed to send email. Please try again later.'], 500);
        }

        return response()->json(['message' => 'Verification code resent successfully'], 200);
    }

    // FORGOT PASSWORD
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();

        // Generate OTP
        $otp = sprintf("%06d", mt_rand(1, 999999));
        $user->otp = $otp;
        $user->otp_expires_at = now()->addMinutes(10);
        $user->save();

        // Send Email
        try {
            \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\PasswordResetMail($otp, $user->user_name));
        } catch (\Exception $e) {
            \Log::error("Failed to send password reset email: " . $e->getMessage());
            return response()->json(['message' => 'Failed to send reset email. Please try again.'], 500);
        }

        return response()->json(['message' => 'Password reset code sent to your email.']);
    }

    // RESET PASSWORD
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'otp'   => 'required|string|size:6',
            'password' => [
                'required',
                'string',
                'min:6',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/'
            ],
        ], [
            'password.regex' => 'Password must contain uppercase, lowercase, numbers and special characters',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user->otp !== $request->otp) {
            return response()->json(['message' => 'Invalid reset code'], 400);
        }

        if (now()->gt($user->otp_expires_at)) {
            return response()->json(['message' => 'Reset code has expired'], 400);
        }

        // Update Password
        $user->password_hash = Hash::make($request->password);
        $user->otp = null;
        $user->otp_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Password has been reset successfully.']);
    }

    // LOGIN
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        // Check if user exists and password matches our password_hash column
        if (!$user || !Hash::check($credentials['password'], $user->password_hash)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        // Check verification status
        if (!$user->is_verified) {
            return response()->json([
                'message' => 'Please verify your email before logging in.',
                'not_verified' => true,
                'email' => $user->email
            ], 403);
        }


        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);
    }

    // LOGOUT
    public function logout()
    {
        try {
            $token = JWTAuth::getToken();

            if (!$token) {
                return response()->json([
                    'message' => 'Token not provided',
                ], 400);
            }

            JWTAuth::invalidate($token);
        } catch (TokenExpiredException $e) {
            return response()->json([
                'message' => 'Token has expired',
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'message' => 'Token is invalid',
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'Could not invalidate token',
            ], 400);
        }

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }


    // PROFILE (Protected)
    public function profile()
    {
        return response()->json(auth()->user());
    }
}
