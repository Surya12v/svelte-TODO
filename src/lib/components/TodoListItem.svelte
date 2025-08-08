<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Todo } from '../types';

  export let todo: Todo;
  export let selected: boolean = false;

  const dispatch = createEventDispatcher();

  function handleToggle(event: Event) {
    event.stopPropagation();
    dispatch('toggle', { id: todo.id, completed: !todo.completed });
  }

  function handleSelect() {
    dispatch('select', todo);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      handleSelect();
    }
  }
</script>

<li
  class="todo-item"
  class:selected={selected}
  tabindex="0"
  on:click={handleSelect}
  on:keydown={handleKeyDown}
  aria-pressed={selected}
  aria-label={`Todo item: ${todo.title}`}
>
  <span>
    <span
      class="checkbox-button"
      role="checkbox"
      aria-checked={todo.completed}
      aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      tabindex="0"
      on:click|stopPropagation={handleToggle}
      on:keydown|stopPropagation={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleToggle(e);
        }
      }}
    >
      <span class="checkbox {todo.completed ? 'checked' : ''}">
        {#if todo.completed}✓{/if}
      </span>
    </span>
  </span>
  
  <h3 class="todo-title {todo.completed ? 'completed' : ''}">
    {todo.title}
  </h3>

  {#if todo.dueDate}
    <time datetime={todo.dueDate.toISOString()} class="due-date">
      Due: {new Date(todo.dueDate).toLocaleDateString()}
    </time>
  {/if}
</li>

<style>
  .todo-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    list-style: none;
  }

  .todo-item:hover {
    background-color: #f5f5f5;
  }

  .todo-item:focus-visible {
    box-shadow: 0 0 0 2px #2196f3;
  }

  .todo-item.selected {
    background-color: #e3f2fd;
    border-left: 3px solid #2196f3;
  }

  .checkbox-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
  }

  .checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.2em;
    height: 1.2em;
    border: 2px solid #757575;
    border-radius: 3px;
    transition: all 0.2s;
  }

  .checkbox.checked {
    background-color: #2196f3;
    border-color: #2196f3;
    color: white;
  }

  .todo-title {
    flex-grow: 1;
    margin: 0;
  }

  .todo-title.completed {
    text-decoration: line-through;
    color: #9e9e9e;
  }

  .due-date {
    font-size: 0.8rem;
    color: #616161;
    margin-left: auto;
  }
</style>