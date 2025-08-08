export type Todo = {
    id: string;
    title: string;
    name: string;
    date: Date;
    dueDate?: Date;
    image?: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt?: Date;
};

export type Comment = {
    id: string;
    text: string;
    todoId: string;
    createdAt: Date;
    updatedAt?: Date;
};
