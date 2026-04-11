<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
        $table->id ('event_id');
        $table->string('event_name',100);
        $table->string('description',100);
        $table->string('start_date_time',50);

        $table->unsignedBigInteger('venue_id');
        $table->unsignedBigInteger('category_id');
        $table->unsignedBigInteger('user_id');

        $table->foreign('venue_id')->references('venue_id')->on('venues');
        $table->foreign('category_id')->references('category_id')->on('categories');
        $table->foreign('user_id')->references('user_id')->on('users');
 });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
