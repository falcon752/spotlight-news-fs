<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Roles example: ['Admin', 'Chief Admin']
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user(); // or use auth('author')->user() if using custom guard

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return $next($request);
    }
}
