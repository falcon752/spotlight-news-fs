<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('authors')->insert([
            'name' => 'Olalekan Akindoju',
            'slug' => Str::slug('Olalekan Akindoju'),
            'email' => 'olalekanakindoju@gmail.com',
            'password' => Hash::make('spotlightng234'), // hashed password
            'role' => 'Chief Admin',
            'avatar' => 'olalekan.jpeg', // place this file in public/
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
