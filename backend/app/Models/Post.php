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

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_post');
    }

    public function author()
    {
        return $this->belongsTo(Author::class, 'author_id');
    }
}
