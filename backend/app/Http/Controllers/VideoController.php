<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VideoController extends Controller
{
    // Get all videos
    public function index()
    {
        return response()->json(Video::with('author')->latest()->get());
    }

    // Show single video
    public function show($id)
    {
        $video = Video::with('author')->findOrFail($id);
        return response()->json($video);
    }

    // Store a new video
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'video_url' => 'required|url',
        ]);

        $video = Video::create([
            'author_id' => Auth::id(),
            'title' => $request->title,
            'desc' => $request->desc,
            'video_url' => $request->video_url,
            'type' => 'video',
            'date' => now(),
        ]);

        return response()->json($video, 201);
    }

    // Update video
    public function update(Request $request, $id)
    {
        $video = Video::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'video_url' => 'required|url',
        ]);

        $video->update($request->only('title', 'desc', 'video_url'));

        return response()->json($video);
    }

    // Delete video
    public function destroy($id)
    {
        $video = Video::findOrFail($id);
        $video->delete();

        return response()->json(['message' => 'Video deleted successfully.']);
    }

    // Delete ALL videos
    public function clearAll()
    {
        Video::truncate(); // ⚡ completely empties the table
        return response()->json(['message' => 'All videos deleted successfully.']);
    }


}
