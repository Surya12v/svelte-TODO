// POST (add comment), GET (fetch comments per todo)

import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	// Logic to add comment
	// ...

	return json({ success: true });
};

export const GET: RequestHandler = async ({ url }) => {
	const todoId = url.searchParams.get('todoId');

	// Logic to fetch comments per todo
	// ...

	return json({ comments: [] });
};