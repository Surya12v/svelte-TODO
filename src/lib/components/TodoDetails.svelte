<script lang="ts">
  import type { Todo, TodoComment } from '../types';
  import { enhance } from '$app/forms';
  import { createEventDispatcher } from 'svelte';
  
  export let todo: Todo;
  export let comments: TodoComment[] = [];
  let newComment = '';

  const dispatch = createEventDispatcher();

  // Enhanced form success handler
  async function handleFormSuccess({ result }: { result: any }) {
    if (result.type === 'success') {
      // Update local state with server response if available
      if (result.data?.updatedTodo) {
        todo = result.data.updatedTodo;
      }
      if (result.data?.comments) {
        comments = result.data.comments;
      }
      if (result.data?.newComment) {
        comments = [...comments, result.data.newComment];
      }
      
      newComment = '';
      dispatch('success');
    }
  }

  // Date formatting utilities (unchanged)
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
            
            <!-- Status Toggle Form -->
            <form 
                method="POST" 
                action="?/updateStatus"
                use:enhance={(form) => {
                    return async ({ result }) => {
                        if (result.type === 'success') {
                            handleFormSuccess({ result });
                        }
                    };
                }}
                class="status-toggle"
            >
                <input type="hidden" name="completed" value={!todo.completed} />
                <button type="submit" class="status-badge" class:completed={todo.completed} class:pending={!todo.completed}>
                    <span class="status-icon">
                        {#if todo.completed}✓{:else}⏳{/if}
                    </span>
                    <span class="status-text">
                        {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </span>
                </button>
            </form>
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

        {#if todo.images && todo.images.length}
        <div class="image-section">
            <h3>Attached Images</h3>
            <div class="image-container">
            {#each todo.images as img}
                <img src={img} alt="Todo attachment" class="todo-image" />
            {/each}
            </div>
        </div>
        {/if}

        <!-- Comments Section -->
        <div class="comments-section">
            <h3>Comments</h3>
            {#if comments && comments.length > 0}
                <ul class="comments-list">
                    {#each comments as comment}
                        <li class="comment-item">
                            <p class="comment-text">{comment.text}</p>
                            <span class="comment-date">{formatDate(comment.createdAt)}</span>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="no-comments">No comments yet</p>
            {/if}

            <form 
                method="POST" 
                action="?/addComment"
                class="comment-form"
                use:enhance={(form) => {
                    return async ({ result }) => {
                        if (result.type === 'success') {
                            handleFormSuccess({ result });
                        }
                    };
                }}
            >
                <input 
                    type="text" 
                    name="comment"
                    bind:value={newComment}
                    placeholder="Add a comment..."
                    required
                    class="comment-input"
                />
                <button type="submit" class="comment-submit">Add Comment</button>
            </form>
        </div>
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

    /* Comments Section Styles */
    .comments-section {
        margin-top: 2rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
    }

    .comments-list {
        list-style: none;
        padding: 0;
        margin: 0 0 1rem 0;
    }

    .comment-item {
        padding: 0.75rem;
        border-bottom: 1px solid #e5e7eb;
    }

    .comment-text {
        margin: 0 0 0.5rem 0;
        color: #374151;
    }

    .comment-date {
        font-size: 0.75rem;
        color: #6b7280;
    }

    .no-comments {
        text-align: center;
        color: #6b7280;
        padding: 1rem;
    }

    .comment-form {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .comment-input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        font-size: 0.875rem;
    }

    .comment-submit {
        padding: 0.5rem 1rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: 500;
        cursor: pointer;
    }

    .comment-submit:hover {
        background: #2563eb;
    }

    .status-toggle {
        margin: 0;
    }

    .status-badge {
        cursor: pointer;
        border: none;
        width: 100%;
    }
</style>