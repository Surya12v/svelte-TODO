import { getTodos } from '$lib/db/queries';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const todos = await getTodos();
  return { todos };
};