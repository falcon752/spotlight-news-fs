<?php

namespace App\Http\Controllers;

use App\Models\VideoView;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoViewController extends Controller
{
    // Increment video views
    public function increment(Video $video)
    {
        $videoView = VideoView::firstOrCreate(
            ['video_id' => $video->id],
            ['views' => 0]
        );

        $videoView->increment('views');

        return response()->json([
            'video_id' => $video->id,
            'title' => $video->title,
            'views' => $videoView->views,
            'author' => [
                'id' => $video->author?->id,
                'name' => $video->author?->name,
                'avatar' => $video->author?->avatar ? asset('storage/' . $video->author->avatar) : null,
            ],
        ]);
    }
}
