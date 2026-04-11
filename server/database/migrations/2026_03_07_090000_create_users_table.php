<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
        $table->id('user_id');
        $table->string('user_name',50);
        $table->string('email')->unique();

        $table->string('phone')->unique()->nullable(); 
        $table->string('password_hash')->nullable();

        $table->string('google_id')->nullable()->unique();

        $table->integer('role_id')->default(2);
        $table->timestamps();
 });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
