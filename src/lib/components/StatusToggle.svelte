<script lang="ts">
  import type { Todo } from '../types';
  export let todo: Todo;
</script>

<form method="post" action="?/updateStatus">
  <input type="hidden" name="id" value={todo.id} />
  <input type="hidden" name="completed" value={!todo.completed} />
  <label>
    <input type="checkbox" checked={todo.completed} on:change={(event) => { (event.target as HTMLInputElement).form?.requestSubmit(); }} />
    {todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
  </label>
</form>
