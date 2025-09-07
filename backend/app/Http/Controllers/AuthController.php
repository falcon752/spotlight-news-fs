<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\Author;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new author
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:authors,email',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'nullable|in:Chief Admin,Admin,Visitor',
            'avatar'   => 'nullable|image|mimes:jpg,jpeg,png,svg,JPG,JPEG,PNG,SVG|max:2048',
        ]);

        // Handle avatar upload if present
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        // Create slug
        $slug = Str::slug($request->name);

        // Create author
        $author = Author::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'slug'     => $slug,
            'role'     => $request->role ?? 'Visitor',
            'avatar'   => $avatarPath,
        ]);

        return response()->json(['message' => 'Author registered successfully'], 201);
    }

    /**
     * Login and issue token with expiry
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Find author by email
        $author = Author::where('email', $request->email)->first();

        // Check credentials
        if (!$author || !Hash::check($request->password, $author->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Create token
        $tokenResult = $author->createToken('auth_token');
        $plainTextToken = $tokenResult->plainTextToken;

        // Set expiry (2 days)
        $author->tokens()
            ->where('id', $tokenResult->accessToken->id)
            ->update([
                'expires_at' => now()->addDays(2),
            ]);

        // Return response
        return response()->json([
            'access_token' => $plainTextToken,
            'token_type'   => 'Bearer',
            'expires_at'   => now()->addDays(2)->toDateTimeString(),
            'author'       => [
                'name'   => $author->name,
                'email'  => $author->email,
                'slug'   => $author->slug,
                'role'   => $author->role,
                'avatar' => $author->avatar_url, // accessor for full URL
            ],
        ]);
    }
}
