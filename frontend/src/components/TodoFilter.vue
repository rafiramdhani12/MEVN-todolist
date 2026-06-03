<script setup lang="ts">
import { useTodoStore } from '../stores/todoStore';

const store = useTodoStore();
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="tabs tabs-boxed bg-base-200/50 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto flex-nowrap no-scrollbar">
      <button
        v-for="f in ['all', 'pending', 'active', 'completed'] as const"
        :key="f"
        @click="store.filter = f"
        class="tab flex-1 sm:flex-none h-10 px-6 rounded-xl text-sm font-bold capitalize transition-all"
        :class="{ 'bg-base-100 text-primary shadow-sm': store.filter === f, 'opacity-40': store.filter !== f }"
      >
        {{ f }}
      </button>
    </div>

    <div class="relative w-full sm:w-64">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        v-model="store.searchQuery"
        type="text"
        placeholder="Search title/desc..."
        class="input input-sm w-full bg-base-200/50 rounded-2xl pl-10 h-12 border-none focus:outline-none font-bold placeholder:opacity-20"
      />
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>