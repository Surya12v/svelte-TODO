<script lang="ts">
import TodoView from '$lib/components/TodoView.svelte';
import type { PageData } from './$types';

export let data: PageData;
const { todo, comments } = data;
</script>

{#if todo}
  <TodoView {todo} {comments} />
{:else}
  <p>Todo not found.</p>
{/if}