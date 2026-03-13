<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $primaryKey = 'event_id';

    protected $fillable = [
        'event_name',
        'description',
        'start_date_time',
        'venue_id',
        'category_id',
        'user_id'
    ];

     public function venue()
    {
        return $this->belongsTo(Venue::class,'venue_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class,'category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class,'event_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class,'event_id');
    }
}
