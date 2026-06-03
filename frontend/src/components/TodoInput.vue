<script setup lang="ts">
import { ref } from 'vue';
import { useTodoStore } from '../stores/todoStore';

const store = useTodoStore();
const text = ref('');
const description = ref('');
const priority = ref<'low' | 'medium' | 'high'>('medium');
const isExpanded = ref(false);

const handleSubmit = async () => {
  if (text.value.trim()) {
    await store.addTodo(text.value, description.value, priority.value);
    text.value = '';
    description.value = '';
    isExpanded.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="glass-card p-2 rounded-3xl premium-shadow overflow-hidden transition-all duration-500" :class="{ 'pb-4': isExpanded }">
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <div class="flex-1 relative">
        <input
          v-model="text"
          type="text"
          placeholder="Type a new task..."
          class="input w-full bg-transparent border-none focus:outline-none text-lg font-bold placeholder:opacity-20 px-6 h-14"
          @focus="isExpanded = true"
        />
      </div>

      <div class="flex items-center gap-2 px-2 pb-2 sm:pb-0">
        <div class="join bg-base-200/50 p-1 rounded-2xl">
          <button
            v-for="p in ['low', 'medium', 'high'] as const"
            :key="p"
            type="button"
            @click="priority = p"
            class="btn btn-ghost btn-xs join-item capitalize font-bold px-4"
            :class="{
              'bg-success/20 text-success': priority === p && p === 'low',
              'bg-warning/20 text-warning': priority === p && p === 'medium',
              'bg-error/20 text-error': priority === p && p === 'high',
              'opacity-30': priority !== p
            }"
          >
            {{ p }}
          </button>
        </div>

        <button
          type="submit"
          :disabled="!text.trim() || store.loading"
          class="btn btn-primary h-12 rounded-2xl px-8 font-black shadow-lg shadow-primary/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Expanded Description Field -->
    <transition name="expand">
      <div v-if="isExpanded" class="px-6 mt-2 space-y-4">
        <textarea
          v-model="description"
          placeholder="Add a more detailed description (optional)..."
          class="textarea w-full bg-base-200/50 border-none focus:outline-none rounded-2xl font-medium placeholder:opacity-20 min-h-[100px] py-4"
        ></textarea>
        <div class="flex justify-end">
          <button type="button" @click="isExpanded = false" class="btn btn-ghost btn-xs opacity-40 hover:opacity-100">
            Collapse
          </button>
        </div>
      </div>
    </transition>
  </form>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
}
</style>