import { getTodos } from '$lib/db/queries';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, depends }) => {
    depends('app:todos'); // force reload when navigating between todos
    const todos = await getTodos();
    return { todos, selectedId: params.id };
};
