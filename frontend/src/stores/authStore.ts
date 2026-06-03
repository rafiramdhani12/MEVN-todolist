import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

interface User {
  _id: string;
  name: string;
  username: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userId: (state) => state.user?._id || null,
  },

  actions: {
    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post(`${API_URL}/login`, { username, password });
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Login failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(name: string, username: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post(`${API_URL}/register`, { name, username, password });
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.error || 'Registration failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.error = null;
      localStorage.removeItem('user');
    },

    clearSession() {
      this.logout();
      window.location.reload();
    }
  }
});