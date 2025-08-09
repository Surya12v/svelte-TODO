<script lang="ts">
  import TodoModal from '$lib/components/TodoModal.svelte';
  import { page } from '$app/stores';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
  let showModal = false;

  $: selectedId = $page.params.id;
  $: todos = data.todos;

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }
</script>

<div class="main-layout">
  <aside class="sidebar">
    <div class="sidebar-header">
      <button class="create-btn" on:click={openModal}>+ Create Todo</button>
    </div>
    <ul class="todo-list">
      {#each todos as todo (todo.id)}
        <li class="todo-item {selectedId === todo.id ? 'selected' : ''}">
          <a 
            href="/todo/{todo.id}"
            class="todo-link"
            data-sveltekit-preload-data="hover"
            aria-current={selectedId === todo.id ? 'page' : undefined}
          >
            <span class="todo-title">{todo.title}</span>
          </a>
        </li>
      {/each}
    </ul>
  </aside>

  <main class="content-area">
    <slot />
  </main>

  {#if showModal}
    <TodoModal on:close={closeModal} />
  {/if}
</div>

<style>
* {
  box-sizing: border-box;
}

ul {
  margin: 0;
  padding: 0;
}

  .main-layout {
    display: flex;
    height: 100vh;
    background: #f8fafc;
    overflow: hidden; /* Prevents main layout from scrolling */
  }

  .sidebar {
    width: 30%; /* Fixed 30% width */
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Prevents sidebar container from scrolling */
  }

  .sidebar-header {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0; /* Prevents header from shrinking */
  }

  .create-btn {
    width: 100%;
    padding: 0.75rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .create-btn:hover {
    background: #2563eb;
  }

  .todo-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1rem 0 1rem; /* top right bottom left */
  margin: 0;
  list-style: none;
  box-sizing: border-box; /* Ensures padding is included in height calculations */
 }

  .todo-item {
    margin-bottom: 0.5rem;
  }

  .todo-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    color: inherit;
    text-decoration: none;
    transition: all 0.2s;
  }

  .todo-link:hover {
    background: #f1f5f9;
  }

  .todo-item.selected .todo-link {
    background: #e3f2fd;
    border-left: 3px solid #2196f3;
  }

  .todo-title {
    flex: 1;
    font-size: 0.9rem;
  }

  .content-area {
    width: 70%; /* Fixed 70% width */
    overflow-y: auto; /* Content area has its own scrollbar */
    padding: 2rem;
  }
</style>