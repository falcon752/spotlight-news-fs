<?php



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // allows login
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // API tokens
use Illuminate\Support\Facades\Storage;

class Author extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'slug',
        'email',
        'password',
        'role',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Automatically append avatar_url to JSON
    protected $appends = ['avatar_url'];

    // Relationships
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    // Accessor for avatar full URL
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            // Return full URL to avatar stored in 'storage/app/public/avatars/...'
            return asset('storage/' . $this->avatar);
        }

        // Return default avatar if user has none
        return asset('storage/avatars/default_avatar.png');
    }
}
