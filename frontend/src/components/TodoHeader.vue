<script setup lang="ts">
import { useTodoStore } from '../stores/todoStore';

const store = useTodoStore();
</script>

<template>
  <header class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
    <div class="flex items-center gap-3">
      <div class="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <div>
        <h1 class="text-3xl font-black tracking-tight">VueTodo</h1>
        <p class="text-xs opacity-50 font-bold uppercase tracking-wider">Productivity MEVN</p>
      </div>
    </div>

    <div class="flex items-center gap-4 bg-base-100 p-2 rounded-2xl shadow-sm border border-base-content/5">
      <div class="flex flex-col items-end px-2 border-r border-base-content/10">
        <span class="text-xl font-black text-primary">{{ store.stats.progress }}%</span>
        <span class="text-[10px] uppercase opacity-40 font-bold tracking-tighter">Completed</span>
      </div>

      <div class="join bg-base-200 p-1 rounded-xl">
        <button
          v-for="t in ['light', 'dark', 'cupcake']"
          :key="t"
          @click="store.setTheme(t)"
          class="btn btn-ghost btn-xs join-item capitalize font-bold"
          :class="{ 'btn-active bg-base-100 shadow-sm': store.currentTheme === t }"
        >
          {{ t }}
        </button>
      </div>
    </div>
  </header>
</template>