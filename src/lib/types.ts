export type Todo = {
    id: string;
    title: string;
    name: string;
    date: Date;
    dueDate?: Date;
    images?: string[];
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt?: Date;
};

export type TodoComment = {
    id: string;
    text: string;
    todoId: string;
    createdAt: Date;
};
