<x-layouts::app.sidebar :title="$title ?? null">
    <flux:main class="bg-white-teal">
        {{ $slot }}
    </flux:main>
</x-layouts::app.sidebar>
