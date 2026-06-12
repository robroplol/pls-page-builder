<x-layouts::app :title="__('Edit Page - ' . $page->title)" class="">
    <div class="p-4" data-page-id="{{ $page->id }}">
        <div class="mb-4 flex justify-between items-center">
            <a href="{{ route('home') }}" class="text-blue-600 hover:underline">
                ← Back to All Pages
            </a>
            <button id="save-page" class="px-4 py-2 rounded ">
                Save Changes
            </button>
        </div>
        @include('pages.editor')
    </div>

    @push('scripts')
    <script>
        window.editorMode = 'edit';
        window.pageData = @json([
            'id' => $page->id,
            'title' => $page->title,
            'blocks' => $page->blocks
        ]);        

        document.addEventListener('appReady', function() {
            if (window.pageData && window.pageData.blocks && window.pageData.blocks.length > 0) {
                window.restoreEditorState(window.pageData);
            }
            window.setupAutoSave(window.pageData.id, 120000);
            document.getElementById('save-page')?.addEventListener('click', function() {
                saveToServer(window.pageData.id, true);
            });
        });
    </script>
    @endpush
</x-layouts::app>