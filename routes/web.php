<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Api\PageApiController;


Route::get('/', [PageController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('home');

Route::middleware(['auth'])->name('pages.')->group(function () {
    Route::get('/create', [PageController::class, 'create'])->name('create');
    Route::get('/{page}/edit', [PageController::class, 'edit'])->name('edit');
    Route::delete('/{page}', [PageController::class, 'destroy'])->name('destroy');
});

Route::middleware(['auth'])->prefix('api/pages')->group(function () {
    Route::post('/', [PageApiController::class, 'store']);
    Route::put('/{page}', [PageApiController::class, 'update']);
    Route::get('/{page}', [PageApiController::class, 'show']);
});

    
    

require __DIR__.'/settings.php';
