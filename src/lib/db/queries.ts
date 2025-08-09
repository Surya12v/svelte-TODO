import { db } from './client';
import type { Todo,TodoComment } from '$lib/types';
import { v4 as uuidv4 } from 'uuid';

// SQL query functions (createTodo, getTodos, addComment, etc.)

export async function createTodo(todo: Todo) {
    const sql = `
      INSERT INTO todolist (
        id, title, name, date, dueDate, images, description, completed, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        todo.id,
        todo.title,
        todo.name,
        todo.date,
        todo.dueDate ?? null,
        todo.images ? JSON.stringify(todo.images) : null, // ✅ store as JSON
        todo.description ?? null,
        todo.completed,
        todo.createdAt,
        todo.updatedAt ?? null
    ];
    await db.query(sql, values);
}


export async function getTodos(): Promise<Todo[]> {
    const [rows] = await db.query('SELECT * FROM todolist');
    return (rows as Todo[]).map(todo => ({
        ...todo,
        images: todo.images ? JSON.parse(todo.images as unknown as string) : []
    }));
}

export async function getTodoById(id: string): Promise<Todo | null> {
    const [rows] = await db.query('SELECT * FROM todolist WHERE id = ?', [id]);
    const todos = (rows as Todo[]).map(todo => ({
        ...todo,
        images: todo.images ? JSON.parse(todo.images as unknown as string) : []
    }));
    return todos[0] ?? null;
}


export async function updateTodo(todo: Todo) {
  await db.query(
    `UPDATE todolist 
     SET title=?, name=?, date=?, dueDate=?, images=?, description=?, completed=?, updatedAt=? 
     WHERE id=?`,
    [
      todo.title,
      todo.name,
      todo.date,
      todo.dueDate ?? null,
      todo.images ? JSON.stringify(todo.images) : null,
      todo.description ?? null,
      todo.completed,
      new Date(),
      todo.id
    ]
  );
  
  // Fetch the updated todo
  const [rows] = await db.query('SELECT * FROM todolist WHERE id = ?', [todo.id]);
  const updatedTodo = (rows as Todo[])[0];
  return {
    ...updatedTodo,
    images: updatedTodo.images ? JSON.parse(updatedTodo.images as unknown as string) : []
  };
}

export async function updateStatus(id: string, completed: boolean) {
  await db.query(
    `UPDATE todolist 
     SET completed = ?, updatedAt = ? 
     WHERE id = ?`,
    [completed, new Date(), id]
  );

  // Fetch updated todo
  const [rows] = await db.query('SELECT * FROM todolist WHERE id = ?', [id]);
  const updatedTodo = (rows as Todo[])[0];
  return {
    ...updatedTodo,
    images: updatedTodo.images ? JSON.parse(updatedTodo.images as unknown as string) : []
  };
}

export async function addComment(comment: TodoComment): Promise<TodoComment> {
  await db.query(
    `INSERT INTO comments (id, todoId, text, createdAt)
     VALUES (?, ?, ?, ?)`,
    [
      comment.id,
      comment.todoId,
      comment.text,
      comment.createdAt,
    ]
  );

  // Fetch the inserted comment
  const [rows] = await db.query('SELECT * FROM comments WHERE id = ?', [comment.id]);
  const [dbComment] = rows as Record<string, any>[];
  
  return {
    id: String(dbComment.id),
    todoId: String(dbComment.todoId),
    text: String(dbComment.text),
    createdAt: new Date(dbComment.createdAt),
  };
}

export async function getCommentsByTodoId(todoId: string): Promise<TodoComment[]> {
  const [rows] = await db.query('SELECT * FROM comments WHERE todoId = ?', [todoId]);
  
  return (rows as Record<string, any>[]).map(row => ({
    id: String(row.id),
    todoId: String(row.todoId),
    text: String(row.text),
    createdAt: new Date(row.createdAt),
    updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined
  }));
}

export async function deleteTodo(id: string) {
    await db.query('DELETE FROM todolist WHERE id = ?', [id]);
}
