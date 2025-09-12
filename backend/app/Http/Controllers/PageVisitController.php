<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PageVisit;

class PageVisitController extends Controller
{
    // Record a visit
    public function store(Request $request)
    {
        $request->validate([
            'page' => 'required|string',
        ]);

        PageVisit::create([
            'page' => $request->page,
        ]);

        return response()->json(['message' => 'Visit recorded']);
    }

    // Return total visits
    public function total()
    {
        $total = PageVisit::count();
        return response()->json(['total' => $total]);
    }
}
