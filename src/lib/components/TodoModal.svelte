<script lang="ts">
  import type { Todo } from '../types';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<div
  class="modal-backdrop"
  role="button"
  tabindex="0"
  aria-label="Close modal"
  on:click={() => dispatch('close')}
  on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') dispatch('close'); }}
>
  <div
    class="modal"
    role="dialog"
    aria-modal="true"
    on:click|stopPropagation
    tabindex="0"
    on:keydown={(e) => { /* Prevent accidental close on modal keydown */ }}
  >
    <div class="modal-header">
      <h2>Create a New Todo</h2>
      <button class="close-btn" on:click={() => dispatch('close')}>×</button>
    </div>
    
    <form action="?/create" method="post" enctype="multipart/form-data" class="modal-form">
      <div class="form-group">
        <label for="todo-title">Title</label>
        <input type="text" id="todo-title" name="title" required placeholder="Enter todo title" />
      </div>

      <div class="form-group">
        <label for="todo-name">Name</label>
        <input type="text" id="todo-name" name="name" required placeholder="Enter your name" />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="todo-date">Date</label>
          <input type="date" id="todo-date" name="date"  />
        </div>

        <div class="form-group">
          <label for="todo-dueDate">Due Date</label>
          <input type="date" id="todo-dueDate" name="dueDate" />
        </div>
      </div>

      <div class="form-group">
        <label for="todo-description">Description</label>
        <textarea id="todo-description" name="description" placeholder="Add a description (optional)" rows="4"></textarea>
      </div>

      <div class="form-group">
        <label for="todo-image" class="file-label">
          <span class="file-icon">📷</span>
          <span>Choose Image (Optional)</span>
        </label>
        <input type="file" id="todo-image" name="image" accept="image/*" class="file-input" />
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" on:click={() => dispatch('close')}>Cancel</button>
        <button type="submit" class="btn btn-primary">Add Todo</button>
      </div>
    </form>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  }

  .modal {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 0;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 24px;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .modal-form {
    padding: 0 24px 24px;
    max-height: calc(90vh - 120px);
    overflow-y: auto;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-row {
    display: flex;
    gap: 16px;
  }

  .form-row .form-group {
    flex: 1;
  }

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  input[type="text"],
  input[type="date"],
  textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  input[type="text"]:focus,
  input[type="date"]:focus,
  textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  input[type="text"]::placeholder,
  textarea::placeholder {
    color: #9ca3af;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .file-label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #f9fafb;
    color: #6b7280;
    font-weight: 500;
  }

  .file-label:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  }

  .file-icon {
    font-size: 1.25rem;
  }

  .file-input {
    display: none;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
  }

  .btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    min-width: 100px;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 640px) {
    .modal {
      width: 95%;
      margin: 20px;
    }

    .modal-header,
    .modal-form {
      padding-left: 16px;
      padding-right: 16px;
    }

    .form-row {
      flex-direction: column;
      gap: 0;
    }

    .form-actions {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }
  }
</style>