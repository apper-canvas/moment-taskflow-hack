import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await delay(200);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async create(taskData) {
    await delay(300);
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      completed: false,
      priority: taskData.priority || 'medium',
      categoryId: taskData.categoryId || null,
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      notes: taskData.notes || null
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    this.tasks[index] = { 
      ...this.tasks[index], 
      ...updates,
      completedAt: updates.completed ? new Date().toISOString() : null
    };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const deletedTask = { ...this.tasks[index] };
    this.tasks.splice(index, 1);
    return deletedTask;
  }

  async bulkDelete(ids) {
    await delay(300);
    const deletedTasks = [];
    ids.forEach(id => {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        deletedTasks.push({ ...this.tasks[index] });
        this.tasks.splice(index, 1);
      }
    });
    return deletedTasks;
  }

  async toggleComplete(id) {
    await delay(200);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    this.tasks[index].completed = !this.tasks[index].completed;
    this.tasks[index].completedAt = this.tasks[index].completed ? new Date().toISOString() : null;
    return { ...this.tasks[index] };
  }

  async getByCategory(categoryId) {
    await delay(200);
    return this.tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }));
  }

  async getByPriority(priority) {
    await delay(200);
    return this.tasks.filter(t => t.priority === priority).map(t => ({ ...t }));
  }

  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return this.tasks.filter(t => 
      t.title.toLowerCase().includes(lowercaseQuery) ||
      (t.notes && t.notes.toLowerCase().includes(lowercaseQuery))
    ).map(t => ({ ...t }));
  }
}

export default new TaskService();