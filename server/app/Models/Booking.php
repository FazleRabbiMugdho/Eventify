<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

     protected $primaryKey = 'booking_id';

    protected $fillable = [
        'booking_date',
        'user_id',
        'ticket_id',
        'payment_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class,'ticket_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class,'booking_id');
    }
}
