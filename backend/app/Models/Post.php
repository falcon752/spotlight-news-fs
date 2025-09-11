<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'desc',
        'img',
        'author_id',
        'date',
    ];

    protected $appends = ['img_url']; // ✅ full URL accessor

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_post');
    }

    public function author()
    {
        return $this->belongsTo(Author::class, 'author_id');
    }

    // Full URL accessor for frontend

public function view()
{
    return $this->hasOne(PostView::class);
}

    public function getImgUrlAttribute()
    {
        if ($this->img) {
            return asset('storage/' . $this->img);
        }
        return null; // or default placeholder: asset('storage/posts/default.png');
    }
}
