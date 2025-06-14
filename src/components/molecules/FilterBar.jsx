import React from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const FilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  selectedPriority, 
  onPriorityChange,
  selectedView,
  onViewChange,
  categories = [],
  onClearFilters 
}) => {
  const views = [
    { value: 'all', label: 'All Tasks', icon: 'List' },
    { value: 'today', label: 'Today', icon: 'Calendar' },
    { value: 'upcoming', label: 'Upcoming', icon: 'Clock' },
    { value: 'completed', label: 'Completed', icon: 'CheckCircle' }
  ];

  const priorities = [
    { value: 'high', label: 'High', variant: 'high' },
    { value: 'medium', label: 'Medium', variant: 'medium' },
    { value: 'low', label: 'Low', variant: 'low' }
  ];

  const activeFiltersCount = [
    selectedCategory,
    selectedPriority,
    searchQuery
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 space-y-4"
    >
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon="Search"
          />
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            icon="X"
          >
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* View Toggles */}
      <div className="flex flex-wrap gap-2">
        {views.map((view) => (
          <Button
            key={view.value}
            variant={selectedView === view.value ? 'primary' : 'ghost'}
            size="sm"
            icon={view.icon}
            onClick={() => onViewChange(view.value)}
          >
            {view.label}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Category:</span>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => onCategoryChange('')}
              className={`
                px-3 py-1 text-xs font-medium rounded-full transition-all duration-150
                ${!selectedCategory 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  px-3 py-1 text-xs font-medium rounded-full transition-all duration-150 flex items-center gap-1
                  ${selectedCategory === category.id 
                    ? 'text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : undefined
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Priority:</span>
          <div className="flex gap-1">
            <button
              onClick={() => onPriorityChange('')}
              className={`
                px-3 py-1 text-xs font-medium rounded-full transition-all duration-150
                ${!selectedPriority 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              All
            </button>
            {priorities.map((priority) => (
              <Badge
                key={priority.value}
                variant={selectedPriority === priority.value ? priority.variant : 'default'}
                className={`
                  cursor-pointer transition-all duration-150
                  ${selectedPriority === priority.value ? '' : 'hover:bg-gray-200'}
                `}
                onClick={() => onPriorityChange(priority.value)}
              >
                {priority.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;