<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    // Handle API registration
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:authors,email',
            'password' => 'required|string|min:6|confirmed', // expects password_confirmation
            'role' => ['required', Rule::in(['Chief Admin', 'Admin'])],
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $avatarPath = null;

        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $avatarName = Str::slug($request->name) . '-' . time() . '.' . $avatar->getClientOriginalExtension();
            $avatarPath = $avatar->storeAs('avatars', $avatarName, 'public'); // storage/app/public/avatars
        }

        $author = Author::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'slug' => Str::slug($request->name),
            'role' => $request->role,
            'avatar' => $avatarPath,
        ]);

        // Login immediately after registration
        Auth::login($author);

        // Return user info with avatar URL
        return response()->json([
            'message' => 'Registration successful',
            'user' => [
                'id' => $author->id,
                'name' => $author->name,
                'email' => $author->email,
                'role' => $author->role,
                'avatar' => $author->avatar ? asset('storage/' . $author->avatar) : null,
            ]
        ]);
    }
}
