<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\People;
use App\Models\Picture;

class PeopleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $people = [
            [
                'name' => 'Aarav Mehta',
                'age' => 26,
                'location' => 'Mumbai',
                'bio' => 'Software developer who loves exploring cafes and beaches.',
                'pictures' => [
                    'https://randomuser.me/api/portraits/men/32.jpg',
                    'https://randomuser.me/api/portraits/men/52.jpg',
                ],
            ],
            [
                'name' => 'Diya Sharma',
                'age' => 24,
                'location' => 'Bangalore',
                'bio' => 'Designer, plant lover 🌿 and foodie 🍕.',
                'pictures' => [
                    'https://randomuser.me/api/portraits/women/45.jpg',
                    'https://randomuser.me/api/portraits/women/46.jpg',
                ],
            ],
            [
                'name' => 'Rohan Patel',
                'age' => 27,
                'location' => 'Ahmedabad',
                'bio' => 'Cyclist 🚴‍♂️ | Tech geek 💻 | Coffee addict ☕',
                'pictures' => [
                    'https://randomuser.me/api/portraits/men/64.jpg',
                ],
            ],
            [
                'name' => 'Ananya Singh',
                'age' => 25,
                'location' => 'Delhi',
                'bio' => 'Artist & traveler ✈️. Always chasing sunsets.',
                'pictures' => [
                    'https://randomuser.me/api/portraits/women/68.jpg',
                ],
            ],
        ];

        foreach ($people as $data) {
            $person = People::create([
                'name' => $data['name'],
                'age' => $data['age'],
                'location' => $data['location'],
                'bio' => $data['bio'],
            ]);

            foreach ($data['pictures'] as $index => $url) {
                Picture::create([
                    'people_id' => $person->id,
                    'path' => $url,
                    'order' => $index + 1,
                ]);
            }
        }
    }
}
