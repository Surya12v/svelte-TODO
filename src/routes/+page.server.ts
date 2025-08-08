import { createTodo, updateTodo, deleteTodo, updateStatus, addComment} from '$lib/db/queries';
import type { Actions } from './$types';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const file = data.get('image') as File;
    let imagePath: string | undefined = undefined;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${uuidv4()}_${file.name}`;
      imagePath = `/uploads/${filename}`;
      await fs.writeFile(`static${imagePath}`, buffer);
    }

    const todo = {
      id: uuidv4(),
      title: data.get('title') as string,
      name: data.get('name') as string,
      date: new Date(data.get('date') as string),
      dueDate: data.get('dueDate') ? new Date(data.get('dueDate') as string) : undefined,
      image: imagePath,
      description: data.get('description') as string,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await createTodo(todo);
    return { success: true };
  },
    update: async ({ request }) => {
        const data = await request.formData();
        const todo = {
            id: data.get('id') as string,
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
        return { success: true };
    },
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        await deleteTodo(id);
        return { success: true };
    },
    updateStatus: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const completed = data.get('completed') === 'true';
        await updateStatus(id, completed);
        return { success: true };
    },
    addcomment: async ({ request }) => {
        const data = await request.formData();
        const todoId = data.get('todoId') as string;
        const comment = {
            id: uuidv4(),
            todoId,
            text: data.get('comment') as string, // fixed: get the correct field from the form
            createdAt: new Date()
        };
        await addComment(comment);
        return { success: true };
    }
};
