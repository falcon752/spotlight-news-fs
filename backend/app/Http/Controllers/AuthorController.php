<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class AuthorController extends Controller
{
    // List all authors
    public function index()
    {
        $authors = Author::all();
        return response()->json($authors);
    }

    // Show a single author
    public function show($id)
    {
        $author = Author::findOrFail($id);
        return response()->json($author);
    }

    // Create a new author
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
            $avatarName = $request->file('avatar')->getClientOriginalName();
            $request->file('avatar')->move(public_path('avatars'), $avatarName);
            $data['avatar'] = $avatarName;
        }

        $data['slug'] = Str::slug($data['name']);
        $data['password'] = Hash::make($data['password']);

        $author = Author::create($data);

        return response()->json($author, 201);
    }

    // Update an author
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
            $avatarName = $request->file('avatar')->getClientOriginalName();
            $request->file('avatar')->move(public_path('avatars'), $avatarName);
            $data['avatar'] = $avatarName;
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $author->update($data);

        return response()->json($author);
    }

    // Delete an author
    public function destroy($id)
    {
        $author = Author::findOrFail($id);
        $author->delete();
        return response()->json(['message' => 'Author deleted successfully']);
    }
}
