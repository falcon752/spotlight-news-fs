<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // Fetch all posts
    public function index()
    {
        $posts = Post::with(['author', 'category'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($posts);
    }

    // Fetch single post
    public function show($id)
    {
        $post = Post::with(['author', 'category'])->findOrFail($id);
        return response()->json($post);
    }

    // Create a new post
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'required|string', // supports links and HTML content
            'category_id' => 'required|exists:categories,id',
            'author_id' => 'required|exists:authors,id',
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
            'category_id' => $request->category_id,
            'author_id' => $request->author_id,
            'img' => $imgPath,
            'date' => $request->date,
        ]);

        return response()->json($post, 201);
    }

    // Update an existing post
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'desc' => 'sometimes|required|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'author_id' => 'sometimes|required|exists:authors,id',
            'img' => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048',
            'date' => 'nullable|date',
        ]);

        if ($request->hasFile('img')) {
            // Delete old image if exists
            if ($post->img) {
                Storage::disk('public')->delete($post->img);
            }
            $post->img = $request->file('img')->store('posts', 'public');
        }

        $post->update($request->only(['title', 'desc', 'category_id', 'author_id', 'date']));

        return response()->json($post);
    }

    // Delete a post
    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        if ($post->img) {
            Storage::disk('public')->delete($post->img);
        }

        $post->delete();
        return response()->json(['message' => 'Post deleted successfully']);
    }
}
