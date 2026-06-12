<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PageApiController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'blocks' => 'required|array',
        ]);

        // Auto-generate unique slug
        $slug = Str::slug($validated['title']);
        $baseSlug = $slug;
        $counter = 1;
        
        while (Page::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $page = Page::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'blocks' => $validated['blocks'],
            'user_id' => auth()->id(),
        ]);

        return response()->json($page, 201);
    }

    public function show(Page $page): JsonResponse
    {
        return response()->json([
            'id' => $page->id,
            'title' => $page->title,
            'slug' => $page->slug,
            'blocks' => $page->blocks,
        ]);
    }

    public function update(Request $request, Page $page): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'blocks' => 'required|array',
        ]);

        // Update slug if title changed
        if ($page->title !== $validated['title']) {
            $slug = Str::slug($validated['title']);
            $baseSlug = $slug;
            $counter = 1;
            
            while (Page::where('slug', $slug)->where('id', '!=', $page->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            
            $validated['slug'] = $slug;
        }

        $page->update($validated);

        return response()->json($page);
    }
}