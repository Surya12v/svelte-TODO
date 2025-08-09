import { createTodo } from '$lib/db/queries';
import type { Actions } from './$types';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from '@sveltejs/kit';
import path from 'path';
import fs from 'fs/promises';
import { get } from 'http';

export const actions: Actions = {
  createTodo: async ({ request }) => {
    const data = await request.formData();
    const files = data.getAll('images') as File[];

    const imagePaths: string[] = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}_${file.name}`;
        const imagePath = `/uploads/${filename}`;
        await fs.writeFile(`static${imagePath}`, buffer);
        imagePaths.push(imagePath);
      }
    }

    const todo = {
      id: uuidv4(),
      title: data.get('title') as string,
      name: data.get('name') as string,
      date: new Date(data.get('date') as string),
      dueDate: data.get('dueDate')
        ? new Date(data.get('dueDate') as string)
        : undefined,
      images: imagePaths, // store multiple paths
      description: data.get('description') as string,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.error('Creating todo:', todo);

    await createTodo(todo);

    return { success: true };
  }
};