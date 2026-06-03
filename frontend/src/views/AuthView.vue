<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const auth = useAuthStore();
const router = useRouter();
const isLogin = ref(true);

const form = ref({
  name: '',
  username: '',
  password: ''
});

const handleSubmit = async () => {
  let success = false;
  if (isLogin.value) {
    success = await auth.login(form.value.username, form.value.password);
  } else {
    success = await auth.register(form.value.name, form.value.username, form.value.password);
  }

  if (success) {
    router.push('/');
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <div class="inline-flex p-4 rounded-3xl bg-primary/10 mb-4 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-4.514A9.01 9.01 0 0012 15a9.01 9.01 0 005.454-1.833m-2.862-3.697a4 4 0 11-8.192 0 4 4 0 018.192 0z" />
          </svg>
        </div>
        <h1 class="text-5xl font-black tracking-tighter mb-2">
          <span class="text-gradient">AmbaTask</span>
        </h1>
        <p class="text-base-content/50 font-medium">Your productivity, elevated.</p>
      </div>

      <div class="glass-card premium-shadow rounded-[2.5rem] p-8 sm:p-10">
        <div class="flex bg-base-200/50 p-1.5 rounded-2xl mb-8">
          <button
            @click="isLogin = true"
            class="flex-1 py-3 text-sm font-bold rounded-xl transition-all"
            :class="isLogin ? 'bg-base-100 shadow-sm text-primary' : 'opacity-50'"
          >
            Login
          </button>
          <button
            @click="isLogin = false"
            class="flex-1 py-3 text-sm font-bold rounded-xl transition-all"
            :class="!isLogin ? 'bg-base-100 shadow-sm text-primary' : 'opacity-50'"
          >
            Register
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div v-if="!isLogin" class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider opacity-40 ml-4">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="John Doe"
              class="input w-full rounded-2xl glass-input h-14"
              required
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider opacity-40 ml-4">Username</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="johndoe"
              class="input w-full rounded-2xl glass-input h-14"
              required
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold uppercase tracking-wider opacity-40 ml-4">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="input w-full rounded-2xl glass-input h-14"
              required
            />
          </div>

          <div v-if="auth.error" class="alert alert-error bg-error/10 border-none text-error text-sm py-3 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div class="flex-1">
              <span>{{ auth.error }}</span>
              <button @click="auth.clearSession" class="btn btn-link btn-xs text-error p-0 h-auto min-h-0 ml-2">Reset Session?</button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="auth.loading"
            class="btn btn-primary w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/30 mt-4"
          >
            <span v-if="auth.loading" class="loading loading-spinner"></span>
            {{ isLogin ? 'Sign In' : 'Create Account' }}
          </button>
        </form>
      </div>

      <p class="text-center mt-10 text-xs font-bold uppercase tracking-widest opacity-20">
        POWERED BY MEVN STACK
      </p>
    </div>
  </div>
</template>