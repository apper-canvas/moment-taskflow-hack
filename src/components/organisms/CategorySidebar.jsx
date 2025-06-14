import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { categoryService } from '@/services';

const CategorySidebar = ({ 
  categories = [], 
  selectedCategory, 
  onCategorySelect, 
  onCategoriesUpdate,
  taskCounts = {}
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#5B4CFF');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedColors = [
    '#5B4CFF', '#FF6B6B', '#4CAF50', '#FF9800',
    '#2196F3', '#9C27B0', '#FF5722', '#607D8B'
  ];

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryData = {
        name: newCategoryName.trim(),
        color: newCategoryColor
      };

      const newCategory = await categoryService.create(categoryData);
      onCategoriesUpdate([...categories, newCategory]);
      
      setNewCategoryName('');
      setNewCategoryColor('#5B4CFF');
      setIsCreating(false);
      toast.success('Category created successfully!');
    } catch (error) {
      toast.error('Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? Tasks in this category will become uncategorized.')) {
      try {
        await categoryService.delete(categoryId);
        const updatedCategories = categories.filter(c => c.id !== categoryId);
        onCategoriesUpdate(updatedCategories);
        
        if (selectedCategory === categoryId) {
          onCategorySelect('');
        }
        
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
        
        {/* All Tasks */}
        <button
          onClick={() => onCategorySelect('')}
          className={`
            w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors duration-150 mb-2
            ${!selectedCategory 
              ? 'bg-primary text-white' 
              : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <ApperIcon name="List" className="w-4 h-4" />
            <span className="font-medium">All Tasks</span>
          </div>
          <span className="text-sm opacity-75">
            {Object.values(taskCounts).reduce((sum, count) => sum + count, 0)}
          </span>
        </button>

        {/* Category List */}
        <div className="space-y-1">
          {categories.map((category) => (
<motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group"
            >
              <div
                role="button"
                tabIndex="0"
                onClick={() => onCategorySelect(category.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCategorySelect(category.id);
                  }
                }}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors duration-150 cursor-pointer
                  ${selectedCategory === category.id 
                    ? 'text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : undefined
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-75">
{taskCounts[category.Id] || 0}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 hover:bg-white/20 rounded"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Category */}
        <AnimatePresence>
          {isCreating ? (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreateCategory}
              className="mt-4 p-3 bg-gray-50 rounded-lg space-y-3"
            >
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                autoFocus
              />
              
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategoryColor(color)}
                    className={`
                      w-6 h-6 rounded-full border-2 transition-all duration-150
                      ${newCategoryColor === color 
                        ? 'border-gray-800 scale-110' 
                        : 'border-gray-300 hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newCategoryName.trim() || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCategoryName('');
                    setNewCategoryColor('#5B4CFF');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.form>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              icon="Plus"
              onClick={() => setIsCreating(true)}
              className="w-full mt-3 justify-start"
            >
              Add Category
            </Button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategorySidebar;