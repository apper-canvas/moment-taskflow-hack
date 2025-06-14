import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { isToday, isTomorrow, isPast, startOfDay } from 'date-fns';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskInput from '@/components/molecules/TaskInput';
import FilterBar from '@/components/molecules/FilterBar';
import TaskList from '@/components/organisms/TaskList';
import { taskService, categoryService } from '@/services';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedView, setSelectedView] = useState('all');

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.notes && task.notes.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(task => task.categoryId === selectedCategory);
    }

    // Priority filter
    if (selectedPriority) {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    // View filter
    switch (selectedView) {
      case 'today':
        filtered = filtered.filter(task => 
          task.dueDate && isToday(new Date(task.dueDate))
        );
        break;
      case 'upcoming':
        filtered = filtered.filter(task => 
          task.dueDate && !isPast(new Date(task.dueDate)) && !task.completed
        );
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Sort tasks
    return filtered.sort((a, b) => {
      // Completed tasks to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Priority order (high -> medium -> low)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      // Due date (earliest first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      // Created date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, searchQuery, selectedCategory, selectedPriority, selectedView]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const today = tasks.filter(task => 
      task.dueDate && isToday(new Date(task.dueDate)) && !task.completed
    ).length;
    const overdue = tasks.filter(task => 
      task.dueDate && 
      isPast(startOfDay(new Date(task.dueDate))) && 
      !isToday(new Date(task.dueDate)) && 
      !task.completed
    ).length;

    return { total, completed, today, overdue };
  }, [tasks]);

  // Calculate task counts by category
  const taskCounts = useMemo(() => {
    const counts = {};
    tasks.forEach(task => {
      if (task.categoryId) {
        counts[task.categoryId] = (counts[task.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [tasks]);

  // Event handlers
  const handleTaskCreated = (newTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedPriority('');
    setSelectedView('all');
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <Header {...stats} />
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 bg-white border-r border-gray-200 p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-20 bg-white rounded-xl border"></div>
                <div className="h-16 bg-white rounded-xl border"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-white rounded-lg border"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <Header {...stats} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header {...stats} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Category Sidebar */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onCategoriesUpdate={setCategories}
          taskCounts={taskCounts}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Task Input */}
              <TaskInput
                onTaskCreated={handleTaskCreated}
                categories={categories}
              />

              {/* Filters */}
              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
                selectedView={selectedView}
                onViewChange={setSelectedView}
                categories={categories}
                onClearFilters={handleClearFilters}
              />

              {/* Task List */}
              <TaskList
                tasks={filteredTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                categories={categories}
                loading={false}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;