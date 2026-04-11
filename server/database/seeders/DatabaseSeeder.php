<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Generates 10 random dummy users using the UserFactory
        User::factory(10)->create();

        // Generates one specific user with known credentials for testing
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            // The password will default to 'password' as defined in your UserFactory
        ]);
    }
}