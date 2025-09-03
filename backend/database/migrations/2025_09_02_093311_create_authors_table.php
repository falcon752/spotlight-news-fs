<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('authors', function (Blueprint $table) {
        $table->id(); // Primary key
        $table->string('name'); // e.g. John Michael
        $table->string('email')->unique(); // login email
        $table->string('password'); // hashed password
        $table->string('slug')->unique(); // e.g. john-michael
        $table->enum('role', ['Chief Admin', 'Admin', 'Visitor'])->nullable();
        $table->string('avatar')->nullable(); // path or URL to image
        $table->timestamps(); // created_at, updated_at
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('authors');
    }
};
