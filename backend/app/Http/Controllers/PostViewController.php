<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostView;
use Illuminate\Http\Request;

class PostViewController extends Controller
{
    // Increment a post view and return enriched info
    public function increment(Post $post)
    {
        // Get or create the PostView record
        $postView = PostView::firstOrCreate(
            ['post_id' => $post->id],
            ['views' => 0]
        );

        // Increment the views
        $postView->increment('views');

        // Load the post with author
        $post->load('author');

        return response()->json([
            'post_id' => $post->id,
            'title' => $post->title,
            'views' => $postView->views,
            'author' => [
                'id' => $post->author?->id,
                'name' => $post->author?->name,
                'avatar' => $post->author?->avatar ? asset('storage/' . $post->author->avatar) : null,
            ],
        ]);
    }
}
