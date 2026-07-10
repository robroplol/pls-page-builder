<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;

class PageController extends Controller
{
    public function index(): View
    {
        $pages = Page::with('user')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(15);

        return view('pages.index', compact('pages'));
    }

    public function create(): View
    {
        return view('pages.create');
    }

    public function edit(Page $page): View
    {
        return view('pages.edit', compact('page'));
    }

    public function show(Page $page): View
    {
        $generatedHtml = $this->htmlGenerator->generate($page);
        return view('pages.show', compact('page', 'generatedHtml'));
    }

    public function destroy(Page $page): RedirectResponse
    {
        $page->forceDelete();
        return redirect()->route('home')->with('success', 'Page deleted successfully');
    }
}