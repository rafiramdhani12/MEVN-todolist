<script setup lang="ts">
import { onMounted } from 'vue';
import { useTodoStore } from './stores/todoStore';

const store = useTodoStore();

onMounted(() => {
  // Initialize theme from store
  document.documentElement.setAttribute('data-theme', store.currentTheme);
});
</script>

<template>
  <div class="min-h-screen bg-premium transition-colors duration-500">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bg-premium {
  background: radial-gradient(circle at top right, oklch(var(--p) / 0.15), transparent),
              radial-gradient(circle at bottom left, oklch(var(--s) / 0.15), transparent);
  background-attachment: fixed;
}
</style>