<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoView extends Model
{
    use HasFactory;

    protected $fillable = ['video_id', 'views'];

    public function video()
    {
        return $this->belongsTo(Video::class);
    }
}
