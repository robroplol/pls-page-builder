<x-layouts::app :title="__('Create Page')">
    <div class="p-4">
        <div class="mb-4 flex justify-between items-center">
            <a href="{{ route('home') }}" class="text-blue-600 hover:underline">
                ← Back to All Pages
            </a>
            <button id="save-page" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Create Page
            </button>
        </div>

        @include('pages.editor')
    </div>

    @push('scripts')
    <script>
        window.editorMode = 'create';
        window.pageData = null;
        
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('save-page')?.addEventListener('click', function() {
                saveToServer(null, true);
            });
        });
    </script>
    @endpush
</x-layouts::app>