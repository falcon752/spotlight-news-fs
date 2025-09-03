<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;


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
        'avatar' => 'nullable|image|mimes:jpg,jpeg,png,svg,JPG,JPEG,PNG,SVG|max:2048', // <-- updated

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
        'password' => Hash::make($request->password), // <-- hashed password
        'slug' => $slug,
        'role' => $request->role ?? 'Visitor',
        'avatar' => $avatarPath,
    ]);

    return response()->json(['message' => 'Author registered successfully']);
}
public function login(Request $request)
{
    // Validate only email and password
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    // Find author by email
    $author = Author::where('email', $request->email)->first();

    // Check if author exists and password is correct
    if (!$author || !Hash::check($request->password, $author->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // Create a new API token
    $token = $author->createToken('auth_token')->plainTextToken;

    // Return author info and token
    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'author' => [
            'name' => $author->name,
            'email' => $author->email,
            'slug' => $author->slug,
            'role' => $author->role,
            'avatar' => $author->avatar_url, // <-- full URL

        ],
    ]);
}




}
