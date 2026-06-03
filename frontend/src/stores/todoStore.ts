import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';
import type { Todo, FilterType, TaskStatus, Priority } from '../types/todo';

const API_URL = 'http://localhost:3000/api/tasks';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
    filter: 'all' as FilterType,
    loading: false,
    error: null as string | null,
    currentTheme: localStorage.getItem('vue-todo-theme') || 'light',
    searchQuery: '',
    sortBy: 'newest' as 'newest' | 'oldest' | 'priority'
  }),

  getters: {
    filteredTodos(state) {
      let result = [...state.todos];

      if (state.filter !== 'all') {
        result = result.filter(t => t.status === state.filter);
      }

      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        result = result.filter(t => 
          t.text.toLowerCase().includes(q) || 
          t.description.toLowerCase().includes(q)
        );
      }

      switch (state.sortBy) {
        case 'oldest':
          result.sort((a, b) => a.createdAt - b.createdAt);
          break;
        case 'priority': {
          const pMap = { high: 3, medium: 2, low: 1 };
          result.sort((a, b) => pMap[b.priority] - pMap[a.priority]);
          break;
        }
        default:
          result.sort((a, b) => b.createdAt - a.createdAt);
      }
      return result;
    },

    stats(state) {
      // We can still use local stats for instant reactivity, 
      // but let's add a backend stats sync for demo
      const total = state.todos.length;
      const completed = state.todos.filter(t => t.status === 'completed').length;
      const active = state.todos.filter(t => t.status === 'active').length;
      const pending = state.todos.filter(t => t.status === 'pending').length;
      const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { total, completed, active, pending, progress };
    }
  },

  actions: {
    getHeaders() {
      const auth = useAuthStore();
      return { 'x-user-id': auth.userId };
    },

    async fetchStats() {
      // Demo of calling the new Aggregation Pipeline endpoint
      try {
        const { data } = await axios.get(`${API_URL}/stats`, { headers: this.getHeaders() });
        console.log('Backend Aggregation Stats:', data);
        return data;
      } catch (err: any) {
        console.error('Failed to fetch aggregation stats', err);
      }
    },

    async fetchTodos() {
      this.loading = true;
      try {
        const { data } = await axios.get(API_URL, { headers: this.getHeaders() });
        this.todos = data.map((task: any) => ({
          id: task._id,
          text: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          createdAt: new Date(task.createdAt).getTime()
        }));
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    async addTodo(text: string, description: string = '', priority: Priority = 'low') {
      try {
        const { data } = await axios.post(API_URL, {
          title: text,
          description,
          priority,
          status: 'active'
        }, { headers: this.getHeaders() });
        this.todos.unshift({
          id: data._id,
          text: data.title,
          description: data.description || '',
          status: data.status,
          priority: data.priority,
          createdAt: new Date(data.createdAt).getTime()
        });
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message;
      }
    },

    async updateTodo(id: string, updates: Partial<Todo>) {
      const todo = this.todos.find(t => t.id === id);
      if (!todo) return;

      // Map local Todo fields to backend Task fields
      const backendUpdates: any = {};
      if (updates.text !== undefined) backendUpdates.title = updates.text;
      if (updates.description !== undefined) backendUpdates.description = updates.description;
      if (updates.status !== undefined) backendUpdates.status = updates.status;
      if (updates.priority !== undefined) backendUpdates.priority = updates.priority;

      try {
        const { data } = await axios.put(`${API_URL}/${id}`, backendUpdates, { headers: this.getHeaders() });
        
        // Update local state
        Object.assign(todo, {
          text: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority
        });
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message;
      }
    },

    async toggleTodo(id: string) {
      const todo = this.todos.find(t => t.id === id);
      if (!todo) return;
      
      const newStatus = todo.status === 'completed' ? 'active' : 'completed';
      await this.updateTodo(id, { status: newStatus });
    },

    async deleteTodo(id: string) {
      try {
        await axios.delete(`${API_URL}/${id}`, { headers: this.getHeaders() });
        this.todos = this.todos.filter(t => t.id !== id);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message;
      }
    },

    setTheme(theme: string) {
      this.currentTheme = theme;
      localStorage.setItem('vue-todo-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
});