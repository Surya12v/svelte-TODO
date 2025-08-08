# SvelteKit Todo App Execution Workflow

## 1. Form Submission (Create/Update)
- User fills out the todo form (e.g., in the modal) and submits it.
- The form uses `method="post"` and an `action` (e.g., `?/create` or `?/update-status`).
- SvelteKit sends the form data to the corresponding action in `+page.server.ts`.

## 2. Server Action & API Call
- The server action (e.g., `create`, `update`, `update-status`) receives the form data.
- It processes the data, handles file uploads if needed, and calls the appropriate database query (e.g., `createTodo`, `updateTodo`).
- The database (MySQL) is updated accordingly.

## 3. CRUD Operations
- **Create:** Adds a new todo to the `todolist` table.
- **Read:** Todos are fetched from the database in `+layout.server.ts` using `getTodos()` and passed to the page as data.
- **Update:** Status or other fields are updated via form actions and `updateTodo`/`update-status` queries.
- **Delete:** A delete action removes a todo from the database.

## 4. Re-fetching & Displaying the List
- After any create, update, or delete action, SvelteKit reloads the page or data.
- The `load` function in `+layout.server.ts` fetches the latest todos from the database.
- The UI receives the updated list via the `data` prop and displays all todos.

## 5. Display
- The left panel shows the list of todos (with status, strike-through if closed).
- The right panel shows details and comments for the selected todo.
- Any changes (add, update, delete) are reflected immediately after the action completes.

