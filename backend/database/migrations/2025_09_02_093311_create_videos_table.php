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
        Schema::create('videos', function (Blueprint $table) {
            $table->id(); // Primary key

            // Relationships
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); 
            $table->foreignId('author_id')->constrained()->onDelete('cascade');  

            // Content fields
            $table->string('title'); // e.g. Amazing Space Exploration
            $table->string('slug')->unique(); // e.g. amazing-space-exploration
            $table->text('desc')->nullable(); // video description
            $table->string('video_url'); // YouTube/Vimeo/etc. URL
            $table->string('thumbnail')->nullable(); // e.g. https://img.youtube...

            // Meta
            $table->string('type')->default('video'); // default: video
            $table->timestamp('date')->nullable(); // publish date

            $table->timestamps(); // created_at, updated_at
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
