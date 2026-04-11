<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

class EventControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Schema::disableForeignKeyConstraints();
    }

    public function test_authenticated_user_can_create_event()
    {
        $user = User::factory()->create();

        $payload = [
            'event_name' => 'AUST CSE Carnival',
            'description' => 'A grand event for CSE students',
            'start_date_time' => '2026-05-15 10:00:00',
            'venue_id' => 1,
            'category_id' => 1,
            'user_id' => $user->user_id
        ];

        $response = $this->actingAs($user, 'api')
                         ->withHeaders(['Accept' => 'application/json'])
                         ->postJson('/api/events', $payload);

        $response->assertStatus(201);

        $this->assertDatabaseHas('events', [
            'event_name' => 'AUST CSE Carnival',
            'user_id' => $user->user_id
        ]);
    }

    public function test_guest_cannot_create_event()
    {
        $payload = [
            'event_name' => 'Unauthorized Event',
            'description' => 'A grand event for CSE students',
            'start_date_time' => '2026-05-15 10:00:00',
            'venue_id' => 1,
            'category_id' => 1,
            'user_id' => 1
        ];

        $response = $this->withHeaders(['Accept' => 'application/json'])
                         ->postJson('/api/events', $payload);

        $this->assertDatabaseMissing('events', [
            'event_name' => 'Unauthorized Event',
        ]);
    }

    public function test_can_list_all_events()
    {
        $response = $this->getJson('/api/events');

        $response->assertStatus(200);
    }
}