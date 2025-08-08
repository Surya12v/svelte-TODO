import { db } from './client';
import type { Todo } from '$lib/types';
import { v4 as uuidv4 } from 'uuid';

// SQL query functions (createTodo, getTodos, addComment, etc.)

export async function createTodo(todo: Todo) {
    const sql = `INSERT INTO todolist (id, title, name, date, dueDate, image, description, completed, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        todo.id,
        todo.title,
        todo.name,
        todo.date,
        todo.dueDate ?? null,
        todo.image ?? null,
        todo.description ?? null,
        todo.completed,
        todo.createdAt,
        todo.updatedAt ?? null
    ];
    await db.query(sql, values);
}

export async function getTodos(): Promise<Todo[]> {
    const [rows] = await db.query('SELECT * FROM todolist');
    return rows as Todo[];
}

export async function getTodoById(id: string): Promise<Todo | null> {
    const [rows] = await db.query('SELECT * FROM todolist WHERE id = ?', [id]);
    const todos = rows as Todo[];
    return todos[0] ?? null;
}

export async function updateTodo(todo: Todo) {
    const sql = `UPDATE todolist SET title=?, name=?, date=?, dueDate=?, image=?, description=?, completed=?, updatedAt=? WHERE id=?`;
    const values = [
        todo.title,
        todo.name,
        todo.date,
        todo.dueDate ?? null,
        todo.image ?? null,
        todo.description ?? null,
        todo.completed,
        todo.updatedAt ?? new Date(),
        todo.id
    ];
    await db.query(sql, values);
}

export async function updateStatus(id: string, completed: boolean) {
    const sql = `UPDATE todolist SET completed = ?, updatedAt = ? WHERE id = ?`;
    const values = [completed, new Date(), id];
    await db.query(sql, values);
}

export async function addComment(comment: { id: string, todoId: string, text: string, createdAt: Date }) {
    const sql = `INSERT INTO comments (id, todoId, text, createdAt) VALUES (?, ?, ?, ?)`;
    const values = [comment.id, comment.todoId, comment.text, comment.createdAt];
    await db.query(sql, values);
}

export async function getCommentsByTodoId(todoId: string): Promise<Comment[]> {
    const [rows] = await db.query('SELECT * FROM comments WHERE todoId = ?', [todoId]);
    return rows as Comment[];
}

export async function deleteTodo(id: string) {
    await db.query('DELETE FROM todolist WHERE id = ?', [id]);
}
