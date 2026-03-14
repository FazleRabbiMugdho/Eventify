<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTicketsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
  {
        Schema::create('tickets', function (Blueprint $table) {
        $table->id('ticket_id');
        $table->string('ticket_type',50);
        $table->decimal('price',8,2);
        $table->integer('quantity');

        $table->unsignedBigInteger('event_id');
        $table->foreign('event_id')->references('event_id')->on('events');
 });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tickets');
    }
}
