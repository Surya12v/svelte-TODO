import { getTodoById, getCommentsByTodoId } from '$lib/db/queries';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const todo = await getTodoById(params.id);
  const comments = todo ? await getCommentsByTodoId(todo.id) : [];
  return { todo, comments };
};

export const actions: Actions = {
  addcomment: async ({ request, params }) => {
    const data = await request.formData();
    const todoId = params.id;
    const comment = {
      id: uuidv4(),
      todoId,
      text: data.get('comment') as string,
      createdAt: new Date()
    };
    await import('$lib/db/queries').then(m => m.addComment(comment));
    throw redirect(307, `/todos/${todoId}`);
  },
  updateStatus: async ({ request, params }) => {
    const data = await request.formData();
    const id = params.id;
    const completed = data.get('completed') === 'true';
    await import('$lib/db/queries').then(m => m.updateStatus(id, completed));
    throw redirect(307, `/todos/${id}`);
  }
};