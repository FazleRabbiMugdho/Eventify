<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class ApiAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_via_api()
    {
        $payload = [
            'user_name' => 'Test User',
            'email' => 'testuser@example.com',
            'phone' => '01712345678',
            'password_hash' => 'password123',
        ];

        $response = $this->withHeaders([
            'Accept' => 'application/json',
        ])->postJson('/api/register', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'user' => [
                         'user_name',
                         'email',
                         'phone',
                         'role_id',
                         'user_id',
                         'created_at',
                         'updated_at'
                     ]
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'testuser@example.com',
            'user_name' => 'Test User',
        ]);
    }

    public function test_user_can_login_via_api()
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password_hash' => bcrypt('password123'),
        ]);

        $payload = [
            'email' => 'login@example.com',
            'password' => 'password123',
        ];

        $response = $this->withHeaders([
            'Accept' => 'application/json',
        ])->postJson('/api/login', $payload);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'message',
                     'token',
                     'user' => [
                         'user_id',
                         'user_name',
                         'email',
                         'phone',
                         'role_id',
                         'created_at',
                         'updated_at'
                     ]
                 ]);
    }
}