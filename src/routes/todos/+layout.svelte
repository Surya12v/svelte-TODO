<script lang="ts">
import TodoModal from '$lib/components/TodoModal.svelte';
import { goto } from '$app/navigation';
import type { LayoutData } from './$types';

export let data: LayoutData;
let { todos, selectedId } = data;
let showModal = false;

function openModal() {
  showModal = true;
}
function closeModal() {
  showModal = false;
}
function selectTodo(todo: { id: string }) {
  goto(`/todos/${todo.id}`);
}
</script>

<div class="main-content">
  <main class="content-area">
    <slot />
  </main>
</div>

<style>
.main-content {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 350px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}
.create-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  background: #3b82f6;
  color: #fff;
  border: none;
  font-weight: 600;
  cursor: pointer;
}
.todo-list {
  flex: 1;
  overflow-y: auto;
  margin: 0;
  padding: 0;
}
.content-area {
  flex: 1;
  background: #f8fafc;
  overflow-y: auto;
  padding: 2rem;
}
</style>
