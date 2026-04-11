<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $primaryKey = 'review_id';

    protected $fillable = [
        'rating',
        'comment',
        'review_date',
        'event_id',
        'user_id'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class,'event_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
