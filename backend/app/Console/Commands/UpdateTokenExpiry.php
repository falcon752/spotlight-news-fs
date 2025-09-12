<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Sanctum\PersonalAccessToken;
use Carbon\Carbon;

class UpdateTokenExpiry extends Command
{
    protected $signature = 'tokens:set-expiry {days=2}';
    protected $description = 'Set expires_at for all existing personal access tokens';

    public function handle()
    {
        $days = (int) $this->argument('days'); // cast here
        $tokens = PersonalAccessToken::whereNull('expires_at')->get();

        foreach ($tokens as $token) {
            $token->expires_at = Carbon::now()->addDays($days);
            $token->save();
        }

        $this->info("Updated " . $tokens->count() . " tokens with {$days}-day expiry.");
    }
}
