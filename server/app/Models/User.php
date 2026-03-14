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

    protected $fillable = [
        'user_name',
        'email',
        'phone',
        'password_hash',
        'role_id'
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