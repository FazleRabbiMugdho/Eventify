<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
        $table->id('review_id');
        $table->integer('rating');
        $table->string('comment',100);
        $table->string('review_date',50);

        $table->unsignedBigInteger('event_id');
        $table->unsignedBigInteger('user_id');

        $table->foreign('event_id')->references('event_id')->on('events');
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
        Schema::dropIfExists('reviews');
    }
}
