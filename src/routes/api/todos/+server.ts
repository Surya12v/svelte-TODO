import { getTodos, createTodo } from '../../../lib/db/queries';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const todos = await getTodos();
    return new Response(JSON.stringify(todos), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    await createTodo(data);
    return new Response(JSON.stringify({ success: true }), { status: 201 });
};
