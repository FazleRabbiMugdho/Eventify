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
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            // Accept either 'password' or 'password_hash' to prevent frontend errors
            'password' => 'required_without:password_hash|string|min:6',
            'password_hash' => 'required_without:password|string|min:6',
        ]);

         if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $profilePictureUrl = null;

        // Handle image upload to Cloudinary (Reusing Cloudinary logic style from EventController)
        if (!empty($request->profile_picture)) {
            $imageData = $request->profile_picture;
            
            // If the incoming data is not a data URI, format it
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
                    } else {
                        \Log::error("Cloudinary Upload Failed in Register", $response->json());
                    }
                } catch (\Exception $e) {
                    \Log::error("Cloudinary Exception in Register", ['msg' => $e->getMessage()]);
                }
            }
        }

        $user = User::create([
            'user_name' => $request->user_name,
            'email' => $request->email,
            'phone' => $request->phone,
            // Uses whichever password field the frontend sent
            'password_hash' => Hash::make($request->password ?? $request->password_hash),
            'role_id' => 1,
            'profile_picture' => $profilePictureUrl
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
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