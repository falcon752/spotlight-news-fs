<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $data = $request->only('name', 'email', 'message');

        Mail::raw(
            "Name: {$data['name']}\nEmail: {$data['email']}\n\nMessage:\n{$data['message']}",
            function ($message) use ($data) {
                $message->to('contact@spotlightonline.ng')
                        ->subject("New Contact Message from {$data['name']}")
                        ->replyTo($data['email'], $data['name']);
            }
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Your message has been sent. Thank you!'
        ]);
    }
}
