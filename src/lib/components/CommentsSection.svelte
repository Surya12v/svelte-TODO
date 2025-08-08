<script lang="ts">
  import type { Todo, Comment } from '../types';
  export let todo: Todo;
  export let comments: Comment[] = [];
  let newComment = '';
</script>

<div class="comments-section">
  <h3>Comments</h3>
  {#if comments && comments.length > 0}
    <ul>
      {#each comments as comment}
        <li>{comment.text}</li>
      {/each}
    </ul>
  {:else}
    <p>No comments yet.</p>
  {/if}

  <form method="post" action="?/addcomment" class="comment-form">
    <input type="hidden" name="todoId" value={todo.id} />
    <input type="text" name="comment" bind:value={newComment} placeholder="Add a comment..." required />
    <button type="submit">Add</button>
  </form>
</div>

<style>
  .comments-section {
    margin-top: 1rem;
  }
  .comment-form {
    margin-top: 1rem;
    display: flex;
    gap: 8px;
  }
  .comment-form input[type="text"] {
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
  }
  .comment-form button {
    padding: 8px 16px;
    border-radius: 6px;
    background: #3b82f6;
    color: white;
    border: none;
    cursor: pointer;
  }
</style>