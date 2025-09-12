<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id',
        'title',
        'slug',
        'desc',
        'video_url',
        'type',
        'date',
    ];

    // Auto-generate slug if not provided
    protected static function booted()
    {
        static::creating(function ($video) {
            if (empty($video->slug)) {
                $video->slug = Str::slug($video->title) . '-' . uniqid();
            }
        });
    }

    // Relationship with Author
    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function view()
{
    return $this->hasOne(VideoView::class);
}

}
