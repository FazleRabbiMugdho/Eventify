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
            'email' => ['required', 'email', 'unique:users,email', 'regex:/^.+@.+\.com$/i'],
            'phone' => 'required|string|max:20|unique:users,phone',
            // Accept either 'password' or 'password_hash' to prevent frontend errors
            'password' => [
                'required_without:password_hash',
                'string',
                'min:6',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/'
            ],
            'password_hash' => [
                'required_without:password',
                'string',
                'min:6',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/'
            ],
        ], [
            'phone.unique' => 'This phone number is already registered.',
            'password.min' => 'Password should consist at least 6 characters',
            'password.regex' => 'Password must contain uppercase, lowercase, numbers and special characters',
            'password_hash.min' => 'Password should consist at least 6 characters',
            'password_hash.regex' => 'Password must contain uppercase, lowercase, numbers and special characters',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'user_name' => $request->user_name,
            'email' => $request->email,
            'phone' => $request->phone,
            // Uses whichever password field the frontend sent
            'password_hash' => Hash::make($request->password ?? $request->password_hash),
            'role_id' => 1
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
