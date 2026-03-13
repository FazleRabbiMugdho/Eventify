<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $primaryKey = 'payment_id';

    protected $fillable = [
        'pay_amount',
        'payment_method',
        'booking_id'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class,'booking_id');
    }
}
