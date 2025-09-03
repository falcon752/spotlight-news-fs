<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Author;
use Illuminate\Support\Str;


class AuthController extends Controller
{
    public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:authors,email',
        'password' => 'required|string|min:6|confirmed',
        'role' => 'nullable|in:Chief Admin,Admin,Visitor',
        'avatar' => 'nullable|image|max:2048', // optional
    ]);

    // Handle avatar upload if present
    $avatarPath = null;
    if ($request->hasFile('avatar')) {
        $avatarPath = $request->file('avatar')->store('avatars', 'public');
    }

    // Create slug
    $slug = \Str::slug($request->name);

    $author = Author::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => $request->password, // hashed automatically
        'slug' => $slug,
        'role' => $request->role ?? 'Visitor',
        'avatar' => $avatarPath,
    ]);

    return response()->json(['message' => 'Author registered successfully']);
}
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $author = Author::where('email', $request->email)->first();

    if (!$author || !\Hash::check($request->password, $author->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $author->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'author' => [
            'name' => $author->name,
            'email' => $author->email,
            'slug' => $author->slug,
            'role' => $author->role,
            'avatar' => $author->avatar,
        ],
    ]);
}



}
