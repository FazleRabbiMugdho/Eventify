<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    use HasFactory;

    protected $primaryKey = 'venue_id';

    protected $fillable = [
        'name',
        'location',
        'total_capacity'
    ];

    public function events()
    {
        return $this->hasMany(Event::class,'venue_id');
    }
}
