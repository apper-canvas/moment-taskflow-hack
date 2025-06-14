import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const Header = ({ 
  totalTasks = 0, 
  completedTasks = 0, 
  todayTasks = 0,
  overdueTasks = 0 
}) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: 'Total', value: totalTasks, icon: 'List', color: 'text-gray-600' },
    { label: 'Completed', value: completedTasks, icon: 'CheckCircle', color: 'text-success' },
    { label: 'Today', value: todayTasks, icon: 'Calendar', color: 'text-primary' },
    { label: 'Overdue', value: overdueTasks, icon: 'AlertCircle', color: 'text-error' }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">TaskFlow</h1>
            <p className="text-sm text-gray-500">Efficient Task Management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <ApperIcon name={stat.icon} className={`w-4 h-4 ${stat.color}`} />
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </motion.div>
          ))}
          
          {/* Completion Rate */}
          {totalTasks > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 pl-6 border-l border-gray-200"
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">{completionRate}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
              <div className="w-12 h-12 relative">
                <svg
                  className="w-12 h-12 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <motion.path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#5B4CFF"
                    strokeWidth="2"
                    strokeDasharray={`${completionRate}, 100`}
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${completionRate}, 100` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;