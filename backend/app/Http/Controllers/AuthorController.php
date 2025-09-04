<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class AuthorController extends Controller
{
    // List all authors with full avatar URLs
    public function index()
    {
        $authors = Author::all()->map(function ($author) {
            return [
                'id' => $author->id,
                'name' => $author->name,
                'email' => $author->email,
                'slug' => $author->slug,
                'role' => $author->role,
                'avatar_url' => $author->avatar_url,
            ];
        });

        return response()->json($authors);
    }

    // Show a single author
    public function show($id)
    {
        $author = Author::findOrFail($id);
        return response()->json([
            'id' => $author->id,
            'name' => $author->name,
            'email' => $author->email,
            'slug' => $author->slug,
            'role' => $author->role,
            'avatar_url' => $author->avatar_url,
        ]);
    }

    // Fetch currently authenticated author
    public function me(Request $request)
    {
        $author = $request->user();
        if (!$author) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'author' => [
                'id' => $author->id,
                'name' => $author->name,
                'email' => $author->email,
                'slug' => $author->slug,
                'role' => $author->role,
                'avatar' => $author->avatar_url,
            ],
        ]);
    }

    // Create new author
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:authors,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:Chief Admin,Admin,Visitor',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $data['slug'] = Str::slug($data['name']);
        $data['password'] = Hash::make($data['password']);

        $author = Author::create($data);

        return response()->json([
            'id' => $author->id,
            'name' => $author->name,
            'email' => $author->email,
            'slug' => $author->slug,
            'role' => $author->role,
            'avatar_url' => $author->avatar_url,
        ], 201);
    }

    // Update author (role, name, avatar, etc.)
    public function update(Request $request, $id)
    {
        $author = Author::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:authors,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|in:Chief Admin,Admin,Visitor',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $author->update($data);

        return response()->json([
            'id' => $author->id,
            'name' => $author->name,
            'email' => $author->email,
            'slug' => $author->slug,
            'role' => $author->role,
            'avatar_url' => $author->avatar_url,
        ]);
    }

    // Update avatar only
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $author = $request->user();
        if ($request->hasFile('avatar')) {
            $author->avatar = $request->file('avatar')->store('avatars', 'public');
            $author->save();
        }

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar_url' => $author->avatar_url,
        ]);
    }

    // Delete author
    public function destroy($id)
    {
        $author = Author::findOrFail($id);
        $author->delete();
        return response()->json(['message' => 'Author deleted successfully']);
    }
}
