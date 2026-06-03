<script setup lang="ts">
import { useTodoStore } from '../stores/todoStore';

const store = useTodoStore();
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="flex flex-col p-4 bg-base-200/30 rounded-3xl border border-white/5">
      <span class="text-3xl font-black text-primary">{{ store.stats.total }}</span>
      <span class="text-[10px] uppercase font-bold opacity-30 tracking-widest mt-1">Total Tasks</span>
    </div>

    <div class="flex flex-col p-4 bg-base-200/30 rounded-3xl border border-white/5">
      <span class="text-3xl font-black text-success">{{ store.stats.completed }}</span>
      <span class="text-[10px] uppercase font-bold opacity-30 tracking-widest mt-1">Completed</span>
    </div>

    <div class="flex flex-col p-4 bg-base-200/30 rounded-3xl border border-white/5">
      <span class="text-3xl font-black text-warning">{{ store.stats.active }}</span>
      <span class="text-[10px] uppercase font-bold opacity-30 tracking-widest mt-1">Active</span>
    </div>

    <div class="flex flex-col p-4 bg-base-200/30 rounded-3xl border border-white/5">
      <span class="text-3xl font-black text-error/60">{{ store.stats.pending }}</span>
      <span class="text-[10px] uppercase font-bold opacity-30 tracking-widest mt-1">Pending</span>
    </div>

    <div class="col-span-2 flex flex-col p-4 bg-primary/10 rounded-3xl border border-primary/10 items-center">
      <span class="text-4xl font-black text-primary">{{ store.stats.progress }}%</span>
      <span class="text-[10px] uppercase font-bold opacity-30 tracking-widest mt-1">Completion Score</span>
    </div>
  </div>
</template>