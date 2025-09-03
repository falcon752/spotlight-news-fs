<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Author;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    // Handle API login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:authors,email',
            'password' => 'required|string',
        ]);

        $author = Author::where('email', $request->email)->first();

        if (!$author || !Hash::check($request->password, $author->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Check role
        if (!in_array($author->role, ['Chief Admin', 'Admin'])) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        // Login the user
        Auth::login($author);

        // Return user info with avatar URL
        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $author->id,
                'name' => $author->name,
                'email' => $author->email,
                'role' => $author->role,
                'avatar' => $author->avatar ? asset('storage/' . $author->avatar) : null,
            ]
        ]);
    }

    // Handle API logout
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
