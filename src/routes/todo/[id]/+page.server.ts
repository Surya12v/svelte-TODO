import { getTodoById, getCommentsByTodoId, updateStatus, addComment, updateTodo, createTodo } from '$lib/db/queries';
import { updateTodoStatus } from '$lib/stores/todoStore';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

// Ensure uploads directory exists
const UPLOAD_DIR = 'static/uploads';
try {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
} catch (err) {
  console.error('Failed to create uploads directory:', err);
}

export const load: PageServerLoad = async ({ params }) => {
  if (!params.id || typeof params.id !== 'string') {
    throw error(400, 'Invalid todo ID');
  }

  const todo = await getTodoById(params.id);
  if (!todo) {
    throw error(404, 'Todo not found');
  }

  const comments = await getCommentsByTodoId(params.id);
  return { todo, comments };
};

export const actions: Actions = {
  createTodo: async ({ request }) => {
    try {
      const data = await request.formData();
      const files = data.getAll('images') as File[];
      const imagePaths: string[] = [];

      for (const file of files) {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const filename = `${uuidv4()}${path.extname(file.name)}`;
          const imagePath = `/uploads/${filename}`;
          await fs.writeFile(path.join('static', imagePath), buffer);
          imagePaths.push(imagePath);
        }
      }

      const todo = {
        id: uuidv4(),
        title: data.get('title') as string,
        name: data.get('name') as string,
        date: new Date(),
        dueDate: data.get('dueDate') ? new Date(data.get('dueDate') as string) : undefined,
        images: imagePaths,
        description: data.get('description') as string,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await createTodo(todo);
      return { success: true, id: todo.id };
    } catch (err) {
      console.error('Error creating todo:', err);
      throw error(500, 'Failed to create todo');
    }
  },

  updateTodo: async ({ request, params }) => {
    const data = await request.formData();
    const todo = {
      id: params.id,
      title: data.get('title') as string,
      name: data.get('name') as string,
      date: new Date(data.get('date') as string),
      dueDate: data.get('dueDate') ? new Date(data.get('dueDate') as string) : undefined,
      image: data.get('image') as string,
      description: data.get('description') as string,
      completed: data.get('completed') === 'true',
      createdAt: new Date(data.get('createdAt') as string),
      updatedAt: new Date()
    };
    await updateTodo(todo);    
      return {
    success: true,
    updatedTodo: await getTodoById(params.id)
  };
  },

  updateStatus: async ({ request, params }) => {
  const data = await request.formData();
  const completed = data.get('completed') === 'true';
  await updateStatus(params.id, completed);

  // Update the store
  updateTodoStatus(params.id, completed);

  // Return the updated todo and comments
  return {
    success: true,
    updatedTodo: await getTodoById(params.id),
    comments: await getCommentsByTodoId(params.id)
  };
},

  addComment: async ({ request, params }) => {
  const data = await request.formData();
  const comment = {
    id: uuidv4(),
    todoId: params.id,
    text: data.get('comment') as string,
    createdAt: new Date()
  };
  await addComment(comment);
  // Return the updated comment list
  return {
    success: true,
    comments: await getCommentsByTodoId(params.id)
  };
}
};