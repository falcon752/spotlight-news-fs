<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // allows login
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // API tokens
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class Author extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'name',
        'slug',
        'email',
        'password',
        'role',
        'avatar',
    ];

    /**
     * Hidden attributes for serialization
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Attribute casting
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Append custom attributes to JSON
     */
    protected $appends = ['avatar_url'];

    /**
     * Relationships
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    /**
     * Accessor for avatar full URL
     */
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            return asset('storage/' . $this->avatar);
        }

        // Default avatar
        return asset('storage/avatars/default_avatar.png');
    }

    /**
     * Helper: set all personal access tokens expiry (for existing tokens)
     *
     * @param int $days Number of days from now
     */
    public function setTokenExpiry(int $days = 2)
    {
        foreach ($this->tokens as $token) {
            if (!$token->expires_at) {
                $token->expires_at = Carbon::now()->addDays($days);
                $token->save();
            }
        }
    }
}
