// src/lib/stores/todos.ts
import { writable } from 'svelte/store';
import type { Todo, TodoComment } from '$lib/types';

export const todos = writable<Todo[]>([]);
export const comments = writable<TodoComment[]>([]);

// --- Todos ---
export function setTodos(newTodos: Todo[]) {
  todos.set(newTodos);
}

export function addTodo(todo: Todo) {
  todos.update(current => [todo, ...current]);
}

export function updateTodoStatus(id: String, completed: boolean) {
  console.log('Updating todo status:', id, completed);
  todos.update(current =>
    current.map(todo =>
      String(todo.id) === String(id) ? { ...todo, completed } : todo
    )
  );
  console.log('updated todo status:', id, completed);
}

// --- Comments ---
export function setComments(newComments: TodoComment[]) {
  comments.set(newComments);
}

export function addComment(comment: TodoComment) {
  comments.update(current => [comment, ...current]);
}
