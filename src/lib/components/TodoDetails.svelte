<script lang="ts">
  import type { Todo, TodoComment } from '../types';
  import { enhance } from '$app/forms';
  import { createEventDispatcher } from 'svelte';
  
  export let todo: Todo;
  export let comments: TodoComment[] = [];
  let newComment = '';

  const dispatch = createEventDispatcher();

  // Image gallery state
  let selectedImage: string | null = null;
  let currentIndex: number = 0;
  let lightboxElement: HTMLDivElement;

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

  // Date formatting utilities
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

  // Image gallery functions
  function openLightbox(img: string, index: number): void {
    selectedImage = img;
    currentIndex = index;
    // Focus the lightbox for keyboard navigation
    setTimeout(() => lightboxElement?.focus(), 10);
  }

  function closeLightbox(): void {
    selectedImage = null;
    currentIndex = 0;
  }

  function nextImage(): void {
    if (todo.images && currentIndex < todo.images.length - 1) {
      currentIndex += 1;
      selectedImage = todo.images[currentIndex];
    }
  }

  function prevImage(): void {
    if (todo.images && currentIndex > 0) {
      currentIndex -= 1;
      selectedImage = todo.images[currentIndex];
    }
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
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
                <div class="image-grid">
                    {#each todo.images as img, index}
                        <div class="image-wrapper">
                            <img 
                                src={img} 
                                alt="Todo attachment {index + 1}" 
                                class="todo-image" 
                                loading="lazy"
                            />
                            <div class="image-overlay">
                                <button 
                                    class="view-full" 
                                    type="button" 
                                    on:click={() => openLightbox(img, index)}
                                    aria-label="View full image"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/>
                                        <path d="M3 16.2V21m0 0h4.8M3 21l6-6"/>
                                        <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"/>
                                        <path d="M3 7.8V3m0 0h4.8M3 3l6 6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
                {#if todo.images.length > 1}
                    <p class="image-count">{todo.images.length} images attached</p>
                {/if}
            </div>
        {/if}

        <!-- Comments Section -->
         <div class="comments-section">
    <h3 class="comments-header">Comments</h3>

    <div class="comments-list-container">
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
    </div>

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

<!-- Lightbox Modal -->
{#if selectedImage}
    <div 
        class="lightbox-backdrop"
        bind:this={lightboxElement}
        role="dialog"
        aria-modal="true"
        tabindex="0"
        on:click={closeLightbox}
        on:keydown={handleKeydown}
    >
        <section 
            class="lightbox-container" 
            role="document"
        >
            <!-- Close Button -->
            <button 
                class="lightbox-close"
                on:click|stopPropagation={closeLightbox}
                aria-label="Close image viewer"
            >
                ✕
            </button>
            <!-- Main Image -->
            <img 
                src={selectedImage} 
                alt="Todo attachment {currentIndex + 1}"
                class="lightbox-image"
            />

            <!-- Image Counter -->
            {#if todo.images && todo.images.length > 1}
                <div class="lightbox-counter">
                    {currentIndex + 1} of {todo.images.length}
                </div>
            {/if}
</section>
        </div>
{/if}



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
        cursor: pointer;
        border: none;
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

    .status-toggle {
        margin: 0;
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
        overflow-y: auto; /* vertical scroll only */
        max-height: 150px; /* adjust as needed */
        margin: 1.5rem 0;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.75rem;
        border: 1px solid #e2e8f0;
    }

    .image-section h3 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: #374151;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .image-section h3::before {
        content: "📷";
        font-size: 1rem;
    }

    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 0.75rem;
    }

    .image-wrapper {
        position: relative;
        aspect-ratio: 16/9;
        background: #f1f5f9;
        border-radius: 0.5rem;
        overflow: hidden;
        border: 2px solid #e2e8f0;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .image-wrapper:hover {
        border-color: #3b82f6;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .todo-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        transition: transform 0.2s ease;
    }

    .image-wrapper:hover .todo-image {
        transform: scale(1.05);
    }

    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .image-wrapper:hover .image-overlay {
        opacity: 1;
    }

    .view-full {
        background: rgba(255, 255, 255, 0.95);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #374151;
        transition: all 0.2s ease;
    }

    .view-full:hover {
        background: white;
        transform: scale(1.1);
    }

    .image-count {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
        text-align: center;
        font-style: italic;
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
    display: flex;
    flex-direction: column;
    height: 400px; /* set height for scroll area */
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
    }

    .comments-header {
        flex-shrink: 0;
        padding: 0.75rem;
        border-bottom: 1px solid #e2e8f0;
        background: #f1f5f9;
        font-size: 1.1rem;
        font-weight: bold;
    }

    .comments-list-container {
        flex: 1;
        overflow-y: auto;
        padding: 0.75rem;
    }

    /* Optional custom scrollbar */
    .comments-list-container::-webkit-scrollbar {
        width: 6px;
    }
    .comments-list-container::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
    }

    .comment-form {
        flex-shrink: 0;
        display: flex;
        gap: 0.5rem;
        padding: 0.75rem;
        border-top: 1px solid #e2e8f0;
        background: #f1f5f9;
    }

    .comment-input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
    }

    .comment-submit {
        padding: 0.5rem 1rem;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .lightbox-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
    }

    .lightbox-container {
        overflow: auto;
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .lightbox-image {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .lightbox-close {
        position: absolute;
        top: -50px;
        right: 0;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #374151;
        font-size: 18px;
        font-weight: bold;
        transition: all 0.2s ease;
    }

    .lightbox-close:hover {
        background: white;
        transform: scale(1.1);
    }

    .lightbox-counter {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.9);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.875rem;
        color: #374151;
        font-weight: 500;
    }


</style>