import { getTodoById, updateTodo, deleteTodo, updateStatus } from '../../../../lib/db/queries';
import type { RequestHandler, Actions } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    if (!params.id) {
        return new Response('Bad Request: id is required', { status: 400 });
    }
    const todo = await getTodoById(params.id);
    if (!todo) return new Response('Not found', { status: 404 });
    return new Response(JSON.stringify(todo), { status: 200 });
};

export const PUT: RequestHandler = async ({ params, request }) => {
    const data = await request.json();
    data.id = params.id;
    await updateTodo(data);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const DELETE: RequestHandler = async ({ params }) => {
    if (!params.id) {
        return new Response('Bad Request: id is required', { status: 400 });
    }
    await deleteTodo(params.id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
};

export const _actions: Actions = {
    updateStatus: async ({ request, params }) => {
        const data = await request.formData();
        const id = params.id;
        if (!id) {
            return { success: false, error: 'id is required' };
        }
        const completed = data.get('completed') === 'true';
        await updateStatus(id, completed);
        return { success: true };
    }
};
