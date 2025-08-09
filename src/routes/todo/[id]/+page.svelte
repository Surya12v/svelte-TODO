<script lang="ts">
  import TodoDetails from '$lib/components/TodoDetails.svelte';
  import { invalidate } from '$app/navigation';
  import type { PageData } from './$types';
  import type { Todo, TodoComment } from '$lib/types';

  export let data: PageData;

  // Proper type handling without double casting
  $: ({ todo, comments } = data);
  $: todoComments = (comments || []) as TodoComment[];

  // Enhanced invalidation
  async function handleSuccess() {
    await invalidate(`/todo/${todo.id}`);
    await invalidate('todos'); // If you have a list view to refresh
  }
</script>

<div class="todo-view">
  {#if todo}
    <TodoDetails 
      {todo} 
      comments={todoComments} 
      on:success={handleSuccess}
    />
  {:else}
    <div class="not-found">
      <h2>Todo not found</h2>
      <p>This todo item doesn't exist or was deleted</p>
    </div>
  {/if}
</div>

<style>
  .todo-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .not-found {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ef4444;
    text-align: center;
    gap: 0.5rem;
  }

  .not-found h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  .not-found p {
    margin: 0;
    color: #6b7280;
  }
</style>