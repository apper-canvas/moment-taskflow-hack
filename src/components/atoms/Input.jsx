import React, { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  type = 'text',
  placeholder,
  icon,
  iconPosition = 'left',
  error,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 text-sm bg-white border rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';
  const errorClasses = error ? 'border-error focus:ring-error' : 'border-gray-200 hover:border-gray-300';
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-11' : 'pr-11') : '';

  return (
    <div className="relative">
      {icon && (
        <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0' : 'right-0'} flex items-center ${iconPosition === 'left' ? 'pl-3' : 'pr-3'} pointer-events-none`}>
          <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
        </div>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`${baseClasses} ${errorClasses} ${iconClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;