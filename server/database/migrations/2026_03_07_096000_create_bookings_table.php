<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
        $table->id('booking_id');
        $table->string('booking_date',50);

        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('ticket_id');
        $table->unsignedBigInteger('payment_id');

        $table->foreign('user_id')->references('user_id')->on('users');
        $table->foreign('ticket_id')->references('ticket_id')->on('tickets');
});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bookings');
    }
}
