<script lang="ts">
import TodoDetails from './TodoDetails.svelte';
import StatusToggle from './StatusToggle.svelte';
import CommentsSection from './CommentsSection.svelte';
import type { Todo, Comment } from '../types';

export let todo: Todo;
export let comments: Comment[] = [];
</script>

<div class="details-container">
  <TodoDetails {todo} />
  <div class="action-section">
    <StatusToggle {todo} />
  </div>
  <div class="comments-section">
    <CommentsSection {todo} {comments} />
  </div>
</div>
