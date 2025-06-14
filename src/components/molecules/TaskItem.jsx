import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import Checkbox from '@/components/atoms/Checkbox';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';

const TaskItem = ({ task, onTaskUpdate, onTaskDelete, categories = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const category = categories.find(c => c.id === task.categoryId);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      const updatedTask = await taskService.toggleComplete(task.id);
      onTaskUpdate(updatedTask);
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error('Task title cannot be empty');
      return;
    }

    setIsUpdating(true);
    try {
      const updatedTask = await taskService.update(task.id, { title: editTitle.trim() });
      onTaskUpdate(updatedTask);
      setIsEditing(false);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.id);
        onTaskDelete(task.id);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const formatDueDate = (date) => {
    if (!date) return null;
    const dueDate = new Date(date);
    
    if (isToday(dueDate)) return 'Today';
    if (isTomorrow(dueDate)) return 'Tomorrow';
    return format(dueDate, 'MMM d, yyyy');
  };

  const getDueDateColor = (date) => {
    if (!date) return 'text-gray-500';
    const dueDate = new Date(date);
    
    if (isPast(dueDate) && !isToday(dueDate)) return 'text-error';
    if (isToday(dueDate)) return 'text-warning';
    return 'text-gray-500';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200
        ${task.completed ? 'opacity-75' : 'hover:shadow-md hover:-translate-y-0.5'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isUpdating}
            size="md"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Task Title */}
          {isEditing ? (
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={isUpdating}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <h3 
              className={`
                text-sm font-medium mb-2 cursor-pointer transition-colors duration-200
                ${task.completed 
                  ? 'text-gray-500 line-through' 
                  : 'text-gray-900 hover:text-primary'
                }
              `}
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </h3>
          )}

          {/* Task Meta */}
          <div className="flex items-center gap-3 text-xs">
            {/* Priority Badge */}
            <Badge variant={task.priority} size="xs">
              {task.priority}
            </Badge>

            {/* Category */}
            {category && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-gray-600">{category.name}</span>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 ${getDueDateColor(task.dueDate)}`}>
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            )}

            {/* Created Date */}
            <div className="text-gray-400 ml-auto">
              {format(new Date(task.createdAt), 'MMM d')}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="sm"
            variant="ghost"
            icon="Edit"
            onClick={() => setIsEditing(true)}
            className="w-8 h-8 p-0"
          />
          <Button
            size="sm"
            variant="ghost"
            icon="Trash2"
            onClick={handleDelete}
            className="w-8 h-8 p-0 text-gray-400 hover:text-error"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;