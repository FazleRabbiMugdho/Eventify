<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'user_id';

    // Laravel will now find the columns we just added in phpMyAdmin
    public $timestamps = true;

    protected $fillable = [
        'user_name',
        'full_name',
        'email',
        'phone',
        'password_hash',
        'google_id',
        'role_id',
        'profile_picture',
        'is_verified',
        'otp',
        'otp_expires_at'
    ];

    protected $casts = [
        'otp_expires_at' => 'datetime',
        'is_verified' => 'boolean',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $keyType = 'int';
    public $incrementing = true;

    // --- JWT Methods ---

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // --- Relationships ---

    public function events()
    {
        return $this->hasMany(Event::class, 'user_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'user_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'user_id');
    }

    //-------

    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}