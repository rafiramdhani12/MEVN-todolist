<script setup lang="ts">
import { onMounted } from 'vue';
import { useTodoStore } from '../stores/todoStore';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import TodoHeader from '../components/TodoHeader.vue';
import TodoInput from '../components/TodoInput.vue';
import TodoFilter from '../components/TodoFilter.vue';
import TodoItem from '../components/TodoItem.vue';
import TodoStats from '../components/TodoStats.vue';

const store = useTodoStore();
const auth = useAuthStore();
const router = useRouter();

onMounted(() => {
  store.fetchTodos();
});

const handleLogout = () => {
  auth.logout();
  router.push('/auth');
};
</script>

<template>
  <div class="min-h-screen py-8 sm:py-12 px-4">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Profile & Header Section -->
      <div class="flex items-center justify-between glass-card p-6 rounded-[2.5rem] premium-shadow">
        <div class="flex items-center gap-4">
          <div class="avatar">
            <div class="w-14 rounded-2xl bg-primary text-primary-content flex items-center justify-center text-2xl font-black">
              {{ auth.user?.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div>
            <h2 class="text-xl font-black">Hi, {{ auth.user?.name.split(' ')[0] }}! 👋</h2>
            <p class="text-xs font-bold opacity-40 uppercase tracking-widest">Premium Member</p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button 
            @click="handleLogout" 
            class="btn btn-ghost hover:bg-error/10 text-error gap-2 rounded-2xl font-bold px-6 border border-transparent hover:border-error/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Main Content -->
        <div class="lg:col-span-8 space-y-6">
          <TodoInput />
          <TodoFilter />

          <div v-if="store.loading" class="flex flex-col items-center justify-center py-20 gap-4 opacity-20">
            <span class="loading loading-spinner loading-lg"></span>
            <span class="text-xs font-bold uppercase tracking-widest">Syncing Tasks...</span>
          </div>

          <div v-else-if="store.filteredTodos.length === 0" class="text-center py-20 glass-card rounded-[2.5rem]">
            <div class="bg-base-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 class="text-2xl font-black">All Clean!</h3>
            <p class="text-sm opacity-40 font-medium mt-1">No tasks matching your current filter.</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-4">
            <transition-group name="list">
              <TodoItem
                v-for="todo in store.filteredTodos"
                :key="todo.id"
                :todo="todo"
              />
            </transition-group>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-4 space-y-6">
          <div class="glass-card p-6 rounded-[2.5rem] premium-shadow">
            <h3 class="text-sm font-black uppercase tracking-widest opacity-30 mb-6 px-2">Overview</h3>
            <TodoStats />
          </div>

          <div class="glass-card p-6 rounded-[2.5rem] premium-shadow">
             <h3 class="text-sm font-black uppercase tracking-widest opacity-30 mb-6 px-2">Customize</h3>
             <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="t in ['light', 'dark', 'cupcake']"
                  :key="t"
                  @click="store.setTheme(t)"
                  class="btn btn-sm capitalize rounded-xl font-bold"
                  :class="store.currentTheme === t ? 'btn-primary' : 'btn-ghost bg-base-200/50'"
                >
                  {{ t }}
                </button>
             </div>
          </div>
        </div>
      </div>

      <footer class="text-center py-10 opacity-20">
        <p class="text-[10px] font-black uppercase tracking-[0.2em]">VueTask Premium v2.0 • 2024</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>