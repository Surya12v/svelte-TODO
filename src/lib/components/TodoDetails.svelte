<!-- Detailed view of selected todo (right side) -->
<script lang="ts">
  import type { Todo } from '../types';
  export let todo: Todo;

  function formatDate(date: Date | string | undefined): string {
    if (!date) return 'Not set';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  function isOverdue(dueDate: Date | string | undefined): boolean {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }
</script>

<div class="todo-details">
    {#if todo}
        <div class="details-header">
            <h2 class="todo-title">{todo.title}</h2>
            <div class="status-badge" class:completed={todo.completed} class:pending={!todo.completed}>
                <span class="status-icon">
                    {#if todo.completed}
                        ✓
                    {:else}
                        ⏳
                    {/if}
                </span>
                <span class="status-text">
                    {todo.completed ? 'Completed' : 'Pending'}
                </span>
            </div>
        </div>

        {#if todo.description}
            <div class="description-section">
                <h3>Description</h3>
                <p class="description-text">{todo.description}</p>
            </div>
        {/if}

        <div class="date-section">
            <div class="date-item">
                <span class="date-label">📅 Created</span>
                <span class="date-value">{formatDate(todo.date)}</span>
            </div>
            
            {#if todo.dueDate}
                <div class="date-item" class:overdue={isOverdue(todo.dueDate)}>
                    <span class="date-label">⏰ Due Date</span>
                    <span class="date-value">{formatDate(todo.dueDate)}</span>
                    {#if isOverdue(todo.dueDate) && !todo.completed}
                        <span class="overdue-indicator">Overdue</span>
                    {/if}
                </div>
            {/if}
        </div>

        {#if todo.image}
            <div class="image-section">
                <h3>Attached Image</h3>
                <div class="image-container">
                    <img src={todo.image} alt="Todo attachment" class="todo-image" />
                </div>
            </div>
        {/if}
    {:else}
        <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>No Todo Selected</h3>
            <p>Select a todo from the list to view its details</p>
        </div>
    {/if}
</div>

<style>
    .todo-details {
        padding: 24px;
        border-left: 1px solid #e5e7eb;
        background: #fafafa;
        height: 100%;
        overflow-y: auto;
        min-height: 400px;
    }

    .details-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
        gap: 16px;
    }

    .todo-title {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: #1f2937;
        line-height: 1.2;
        flex: 1;
    }

    .status-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
        white-space: nowrap;
        transition: all 0.2s ease;
    }

    .status-badge.completed {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
    }

    .status-badge.pending {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fde68a;
    }

    .status-icon {
        font-size: 1rem;
    }

    .description-section {
        margin-bottom: 28px;
    }

    .description-section h3 {
        margin: 0 0 12px 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: #374151;
    }

    .description-text {
        margin: 0;
        padding: 16px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        line-height: 1.6;
        color: #4b5563;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .date-section {
        margin-bottom: 28px;
    }

    .date-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        margin-bottom: 8px;
        transition: all 0.2s ease;
    }

    .date-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .date-item.overdue {
        border-color: #fca5a5;
        background: #fef2f2;
    }

    .date-label {
        font-weight: 500;
        color: #6b7280;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .date-value {
        font-weight: 600;
        color: #1f2937;
    }

    .overdue-indicator {
        background: #ef4444;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .image-section {
        margin-bottom: 24px;
    }

    .image-section h3 {
        margin: 0 0 12px 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: #374151;
    }

    .image-container {
        background: white;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
        padding: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .todo-image {
        width: 100%;
        max-width: 300px;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease;
    }

    .todo-image:hover {
        transform: scale(1.02);
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        color: #6b7280;
        padding: 48px 24px;
    }

    .empty-icon {
        font-size: 4rem;
        margin-bottom: 16px;
        opacity: 0.5;
    }

    .empty-state h3 {
        margin: 0 0 8px 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #374151;
    }

    .empty-state p {
        margin: 0;
        font-size: 0.875rem;
        line-height: 1.5;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        .todo-details {
            padding: 16px;
            border-left: none;
            border-top: 1px solid #e5e7eb;
        }

        .details-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
        }

        .todo-title {
            font-size: 1.5rem;
        }

        .status-badge {
            align-self: flex-start;
        }

        .date-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }

        .date-value {
            font-size: 0.875rem;
        }

        .todo-image {
            max-width: 100%;
        }
    }

    /* Dark mode support (optional) */
    @media (prefers-color-scheme: dark) {
        .todo-details {
            background: #111827;
            border-left-color: #374151;
        }

        .todo-title {
            color: #f9fafb;
        }

        .description-text,
        .date-item {
            background: #1f2937;
            border-color: #374151;
            color: #e5e7eb;
        }

        .date-value {
            color: #f9fafb;
        }

        .image-container {
            background: #1f2937;
            border-color: #374151;
        }
    }
</style>