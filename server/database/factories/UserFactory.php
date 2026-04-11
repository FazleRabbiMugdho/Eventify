<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition()
    {
        return [
            'user_name' => $this->faker->name(), // Matches 'user_name'
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(), // Matches 'phone'
            'password_hash' => bcrypt('password'), // Matches 'password_hash'
            'role_id' => 1, // You need a default role ID here
        ];
    }

    public function unverified()
    {
        return $this->state(fn (array $attributes) => []);
    }
}