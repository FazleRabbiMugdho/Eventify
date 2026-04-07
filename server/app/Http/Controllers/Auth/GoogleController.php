<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')
            ->stateless()
            ->with([
            'prompt' => 'select_account'  // forces account picker every time
            ])
            ->redirect();
    }

    public function callback()
    {
    try {
        $googleUser = Socialite::driver('google')->stateless()->user();
        
        $user = User::where('email', $googleUser->email)->first();

        if ($user) {
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->id]);
            }
        } else {
            $user = User::create([
                'user_name' => $googleUser->name,
                'email'     => $googleUser->email,
                'google_id' => $googleUser->id,
                'role_id'   => 2, // Default role
                // password_hash and phone remain null
            ]);
        }

        $token = auth('api')->login($user);

        return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/auth/callback?token=' . $token);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Google Auth Failed', 'details' => $e->getMessage()], 500);
    }
    }
}