<!-- Main UI page (uses components) -->

<script lang="ts">
import TodoModal from '$lib/components/TodoModal.svelte';
import TodoDetails from '$lib/components/TodoDetails.svelte';
import CommentsSection from '$lib/components/CommentsSection.svelte';
import StatusToggle from '$lib/components/StatusToggle.svelte';
import { goto } from '$app/navigation';
import type { PageData } from './$types';

export let data: PageData;

interface Todo {
    id: string;
    title: string;
    name: string;
    date: Date;
    dueDate?: Date;
    image?: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

let showModal = false;
let todos: Todo[] = data.todos;
let selectedTodo: Todo | null = todos.length > 0 ? todos[0] : null;
let searchQuery = '';
let filterStatus = 'all'; // 'all', 'completed', 'pending'

// Computed filtered todos
$: filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         todo.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'completed' && todo.completed) ||
                         (filterStatus === 'pending' && !todo.completed);
    
    return matchesSearch && matchesFilter;
});

// Stats
$: completedCount = todos.filter(t => t.completed).length;
$: pendingCount = todos.filter(t => !t.completed).length;
$: totalCount = todos.length;

function openModal() {
    showModal = true;
}

function closeModal() {
    showModal = false;
}


</script>

<svelte:head>
    <title>Todo Manager</title>
</svelte:head>

<div class="app-container">
    <!-- Modal -->
    {#if showModal}
        <TodoModal on:close={closeModal} />
    {/if}
</div>

<style>
    :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        background: #f8fafc;
        color: #1e293b;
    }

    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #f8fafc;
    }
</style>