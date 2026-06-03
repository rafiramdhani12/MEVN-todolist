<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { Todo, TaskStatus } from '../types/todo';
import { useTodoStore } from '../stores/todoStore';

const props = defineProps<{ todo: Todo }>();
const store = useTodoStore();

const isEditing = ref(false);
const editForm = ref({
  text: props.todo.text,
  description: props.todo.description,
  status: props.todo.status,
  priority: props.todo.priority
});

const startEdit = () => {
  editForm.value = {
    text: props.todo.text,
    description: props.todo.description,
    status: props.todo.status,
    priority: props.todo.priority
  };
  isEditing.value = true;
};

const saveEdit = async () => {
  await store.updateTodo(props.todo.id, editForm.value);
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const handleStatusChange = async (newStatus: TaskStatus) => {
  await store.updateTodo(props.todo.id, { status: newStatus });
};
</script>

<template>
  <div
    class="group flex flex-col gap-2 glass-card p-5 rounded-3xl transition-all duration-300 hover:scale-[1.01] hover:border-primary/30"
    :class="{ 'opacity-50 grayscale-[0.5]': todo.status === 'completed' }"
  >
    <div v-if="!isEditing" class="flex items-start gap-4">
      <!-- Status Indicator / Checkbox -->
      <div class="relative flex items-center justify-center h-8 w-8 mt-1">
        <button 
          @click="store.toggleTodo(todo.id)"
          class="w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300"
          :class="{
            'bg-primary border-primary text-primary-content': todo.status === 'completed',
            'border-base-content/20 hover:border-primary': todo.status !== 'completed'
          }"
        >
          <svg v-if="todo.status === 'completed'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0" @dblclick="startEdit">
        <div class="flex items-center gap-3">
          <p
            class="text-base font-bold truncate transition-all cursor-pointer select-none"
            :class="{ 'line-through opacity-30': todo.status === 'completed' }"
          >
            {{ todo.text }}
          </p>
          <div
            class="h-2 w-2 rounded-full shadow-[0_0_8px]"
            :class="{
              'bg-success shadow-success/50': todo.priority === 'low',
              'bg-warning shadow-warning/50': todo.priority === 'medium',
              'bg-error shadow-error/50': todo.priority === 'high',
            }"
          ></div>
          <span class="badge badge-xs font-black opacity-30 uppercase tracking-widest text-[8px]">{{ todo.status }}</span>
        </div>
        <p v-if="todo.description" class="text-sm opacity-40 font-medium mt-1 line-clamp-2">
          {{ todo.description }}
        </p>
        <div class="flex items-center gap-2 mt-2">
          <span class="text-[10px] font-black opacity-20 uppercase tracking-widest">
            Created {{ new Date(todo.createdAt).toLocaleDateString() }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button
          @click="startEdit"
          class="btn btn-ghost btn-sm btn-square text-primary/40 hover:text-primary hover:bg-primary/10 rounded-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="store.deleteTodo(todo.id)"
          class="btn btn-ghost btn-sm btn-square text-error/40 hover:text-error hover:bg-error/10 rounded-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Editing Mode -->
    <div v-else class="space-y-4">
      <input
        v-model="editForm.text"
        class="input input-sm w-full bg-base-200/50 border-none focus:outline-none rounded-xl font-bold py-5"
        placeholder="Task title"
      />
      <textarea
        v-model="editForm.description"
        class="textarea w-full bg-base-200/50 border-none focus:outline-none rounded-xl font-medium py-3 min-h-[80px]"
        placeholder="Task description"
      ></textarea>
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <select v-model="editForm.status" class="select select-xs bg-base-200/50 border-none rounded-lg font-bold">
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select v-model="editForm.priority" class="select select-xs bg-base-200/50 border-none rounded-lg font-bold">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <button @click="cancelEdit" class="btn btn-ghost btn-sm rounded-xl font-bold">Cancel</button>
          <button @click="saveEdit" class="btn btn-primary btn-sm rounded-xl font-bold px-6">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>