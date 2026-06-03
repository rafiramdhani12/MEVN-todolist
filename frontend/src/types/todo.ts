export type TaskStatus = 'pending' | 'active' | 'completed';
export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: number;
}

export type FilterType = 'all' | TaskStatus;
