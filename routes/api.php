<?php

use App\Http\Controllers\PageApiController;
use Illuminate\Support\Facades\Route;

Route::get('/auth-check', function () {
    return response()->json([
        'user' => auth('sanctum')->user(),
        'session_id' => session()->getId(),
    ]);
});