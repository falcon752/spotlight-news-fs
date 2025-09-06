<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // Fetch all posts with authors & categories
    public function index()
    {
        $posts = Post::with(['author', 'categories'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($posts);
    }

    // Fetch single post
    public function show($id)
    {
        $post = Post::with(['author', 'categories'])->findOrFail($id);
        return response()->json($post);
    }

    // Create new post
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'required|string',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
            'img' => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048',
            'date' => 'nullable|date',
        ]);

        $slug = Str::slug($request->title) . '-' . Str::random(5);

        $imgPath = null;
        if ($request->hasFile('img')) {
            $imgPath = $request->file('img')->store('posts', 'public');
        }

        $post = Post::create([
            'title' => $request->title,
            'slug' => $slug,
            'desc' => $request->desc,
            'author_id' => auth()->id(),
            'img' => $imgPath,
            'date' => $request->date,
        ]);

        $post->categories()->attach($request->categories);
        $post->load(['categories', 'author']);

        return response()->json($post, 201);
    }


public function uploadImage(Request $request)
{
    $request->validate([
        'upload' => 'required|image|mimes:jpg,jpeg,png,svg|max:2048',
    ]);

    $file = $request->file('upload');
    $path = $file->store('posts/inline', 'public');

    $url = asset('storage/' . $path);

    // CKEditor expects JSON with 'url'
    return response()->json([
        'url' => $url,
    ]);
}




    // Update existing post
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'desc' => 'sometimes|required|string',
            'categories' => 'sometimes|array',
            'categories.*' => 'exists:categories,id',
            'img' => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048',
            'date' => 'nullable|date',
        ]);

        if ($request->hasFile('img')) {
            if ($post->img) {
                Storage::disk('public')->delete($post->img);
            }
            $post->img = $request->file('img')->store('posts', 'public');
        }

        $post->update([
            'title' => $request->title ?? $post->title,
            'desc' => $request->desc ?? $post->desc,
            'author_id' => auth()->id(),
            'date' => $request->date ?? $post->date,
        ]);

        if ($request->has('categories')) {
            $post->categories()->sync($request->categories);
        }

        $post->load(['categories', 'author']);

        return response()->json($post);
    }

    // Delete a post
    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        if ($post->img) {
            Storage::disk('public')->delete($post->img);
        }

        $post->categories()->detach();
        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }
}
