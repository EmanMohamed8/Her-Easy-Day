import React, { useState } from 'react';
import { Plus, Check, X, AlertCircle, Edit2 } from 'lucide-react';
import { Task } from '../types';

interface TaskFormData {
  text: string;
  priority: Task['priority'];
  deadline?: string;
  estimatedDuration?: number;
  canSplit: boolean;
  mustFinishToday: boolean;
  mentalEffort: 'low' | 'medium' | 'high' | 'very-high';
  physicalEffort: 'low' | 'medium' | 'high' | 'very-high';
  notes?: string;
}

interface TaskListProps {
  tasks: Task[];
  onAddTask: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const [newTaskData, setNewTaskData] = useState<TaskFormData>({
    text: '',
    priority: 'medium',
    deadline: '',
    estimatedDuration: undefined,
    canSplit: true,
    mustFinishToday: false,
    mentalEffort: 'medium',
    physicalEffort: 'low',
    notes: ''
  });

  const [editTaskData, setEditTaskData] = useState<TaskFormData>({
    text: '',
    priority: 'medium',
    deadline: '',
    estimatedDuration: undefined,
    canSplit: true,
    mustFinishToday: false,
    mentalEffort: 'medium',
    physicalEffort: 'low',
    notes: ''
  });

  const resetNewTaskForm = () => {
    setNewTaskData({
      text: '',
      priority: 'medium',
      deadline: '',
      estimatedDuration: undefined,
      canSplit: true,
      mustFinishToday: false,
      mentalEffort: 'medium',
      physicalEffort: 'low',
      notes: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskData.text.trim()) {
      const taskData = {
        text: newTaskData.text.trim(),
        priority: newTaskData.priority,
        deadline: newTaskData.deadline ? new Date(newTaskData.deadline) : undefined,
        estimatedDuration: newTaskData.estimatedDuration,
        canSplit: newTaskData.canSplit,
        mustFinishToday: newTaskData.mustFinishToday,
        mentalEffort: newTaskData.mentalEffort,
        physicalEffort: newTaskData.physicalEffort,
        notes: newTaskData.notes?.trim() || undefined
      };
      onAddTask(taskData);
      resetNewTaskForm();
      setShowAddForm(false);
    }
  };

  const handleEditStart = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskData({
      text: task.text,
      priority: task.priority,
      deadline: task.deadline ? task.deadline.toISOString().slice(0, 16) : '', // Format for datetime-local
      estimatedDuration: task.estimatedDuration,
      canSplit: task.canSplit ?? true,
      mustFinishToday: task.mustFinishToday ?? false,
      mentalEffort: task.mentalEffort || 'medium',
      physicalEffort: task.physicalEffort || 'low',
      notes: task.notes || ''
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTaskData.text.trim() && editingTaskId) {
      const taskData = {
        text: editTaskData.text.trim(),
        priority: editTaskData.priority,
        deadline: editTaskData.deadline ? new Date(editTaskData.deadline) : undefined,
        estimatedDuration: editTaskData.estimatedDuration,
        canSplit: editTaskData.canSplit,
        mustFinishToday: editTaskData.mustFinishToday,
        mentalEffort: editTaskData.mentalEffort,
        physicalEffort: editTaskData.physicalEffort,
        notes: editTaskData.notes?.trim() || undefined
      };
      onEditTask(editingTaskId, taskData);
      setEditingTaskId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-luna-lavender-500';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'low': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getEffortColor = (effort: 'low' | 'medium' | 'high' | 'very-high') => {
    switch (effort) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'very-high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatDeadline = (deadline?: Date) => {
    if (!deadline) return '';
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // If it's overdue
    if (diffTime < 0) {
      const overdueDays = Math.abs(diffDays);
      const overdueHours = Math.abs(diffHours) % 24;
      
      if (overdueDays > 0) {
        return overdueHours > 0 
          ? `${overdueDays}d ${overdueHours}h overdue`
          : `${overdueDays} days overdue`;
      } else {
        return `${Math.abs(diffHours)} hours overdue`;
      }
    }
    
    // If it's due today (less than 24 hours)
    if (diffDays === 0) {
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes > 0 ? `${diffMinutes} minutes left` : 'Due now!';
      }
      return `${diffHours} hours left`;
    }
    
    // If it's due tomorrow or later
    if (diffDays === 1) {
      const remainingHours = diffHours % 24;
      return remainingHours > 0 ? `1d ${remainingHours}h left` : 'Tomorrow';
    }
    
    // Multiple days
    const remainingHours = diffHours % 24;
    return remainingHours > 0 
      ? `${diffDays}d ${remainingHours}h left`
      : `${diffDays} days left`;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-luna-lavender-800">Tasks</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-6 bg-luna-pink-50 rounded-lg border border-luna-pink-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Task Description *
              </label>
              <input
                type="text"
                value={newTaskData.text}
                onChange={(e) => setNewTaskData({...newTaskData, text: e.target.value})}
                placeholder="Enter task description..."
                className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
                autoFocus
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Priority
              </label>
              <select
                value={newTaskData.priority}
                onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value as Task['priority']})}
                className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Deadline (Date & Time)
              </label>
              <input
                type="datetime-local"
                value={newTaskData.deadline}
                onChange={(e) => setNewTaskData({...newTaskData, deadline: e.target.value})}
                className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
              />
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={newTaskData.estimatedDuration || ''}
                onChange={(e) => setNewTaskData({...newTaskData, estimatedDuration: e.target.value ? parseInt(e.target.value) : undefined})}
                placeholder="e.g., 30"
                min="1"
                className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
              />
            </div>

            {/* Mental Effort */}
            <div>
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Mental Effort Required
              </label>
              <select
                value={newTaskData.mentalEffort}
                onChange={(e) => setNewTaskData({...newTaskData, mentalEffort: e.target.value as 'low' | 'medium' | 'high' | 'very-high'})}
                className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
              >
                <option value="low">Low Mental Effort</option>
                <option value="medium">Medium Mental Effort</option>
                <option value="high">High Mental Effort</option>
                <option value="very-high">Very High Mental Effort</option>
              </select>
            </div>

            {/* Physical Effort */}
            <div>
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Physical Effort Required
              </label>
              <select
                value={newTaskData.physicalEffort}
                onChange={(e) => setNewTaskData({...newTaskData, physicalEffort: e.target.value as 'low' | 'medium' | 'high' | 'very-high'})}
                className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
              >
                <option value="low">Low Physical Effort</option>
                <option value="medium">Medium Physical Effort</option>
                <option value="high">High Physical Effort</option>
                <option value="very-high">Very High Physical Effort</option>
              </select>
            </div>

            {/* Task Options */}
            <div className="md:col-span-2">
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newTaskData.canSplit}
                    onChange={(e) => setNewTaskData({...newTaskData, canSplit: e.target.checked})}
                    className="rounded border-luna-pink-300 text-luna-pink-500 focus:ring-luna-pink-500"
                  />
                  <span className="text-sm text-luna-lavender-700">Can be split into smaller parts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newTaskData.mustFinishToday}
                    onChange={(e) => setNewTaskData({...newTaskData, mustFinishToday: e.target.checked})}
                    className="rounded border-luna-pink-300 text-luna-pink-500 focus:ring-luna-pink-500"
                  />
                  <span className="text-sm text-luna-lavender-700">Must finish today</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={newTaskData.notes}
                onChange={(e) => setNewTaskData({...newTaskData, notes: e.target.value})}
                placeholder="Any additional details or context..."
                rows={3}
                className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                resetNewTaskForm();
              }}
              className="px-4 py-2 text-luna-lavender-600 hover:text-luna-lavender-800 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Task
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-luna-lavender-500 text-center py-8">No tasks for this day</p>
        ) : (
          tasks.map(task => (
            <div key={task.id}>
              {editingTaskId === task.id ? (
                // Edit form - same comprehensive form as add task
                <form onSubmit={handleEditSubmit} className="p-6 bg-luna-pink-50 rounded-lg border border-luna-pink-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Task Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                        Task Description *
                      </label>
                      <input
                        type="text"
                        value={editTaskData.text}
                        onChange={(e) => setEditTaskData({...editTaskData, text: e.target.value})}
                        className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
                        autoFocus
                        required
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={editTaskData.priority}
                        onChange={(e) => setEditTaskData({...editTaskData, priority: e.target.value as Task['priority']})}
                        className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                        Deadline (Date & Time)
                      </label>
                      <input
                        type="datetime-local"
                        value={editTaskData.deadline}
                        onChange={(e) => setEditTaskData({...editTaskData, deadline: e.target.value})}
                        className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
                      />
                    </div>

                    {/* Estimated Duration */}
                    <div>
                      <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                        Estimated Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={editTaskData.estimatedDuration || ''}
                        onChange={(e) => setEditTaskData({...editTaskData, estimatedDuration: e.target.value ? parseInt(e.target.value) : undefined})}
                        min="1"
                        className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
                      />
                    </div>

                    {/* Mental Effort */}
                    <div>
                      <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                        Mental Effort Required
                      </label>
                      <select
                        value={editTaskData.mentalEffort}
                        onChange={(e) => setEditTaskData({...editTaskData, mentalEffort: e.target.value as 'low' | 'medium' | 'high' | 'very-high'})}
                        className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
                      >
                        <option value="low">Low Mental Effort</option>
                        <option value="medium">Medium Mental Effort</option>
                        <option value="high">High Mental Effort</option>
                        <option value="very-high">Very High Mental Effort</option>
                      </select>
                    </div>

                    {/* Physical Effort */}
                    <div>
                      <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                        Physical Effort Required
                      </label>
                      <select
                        value={editTaskData.physicalEffort}
                        onChange={(e) => setEditTaskData({...editTaskData, physicalEffort: e.target.value as 'low' | 'medium' | 'high' | 'very-high'})}
                        className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
                      >
                        <option value="low">Low Physical Effort</option>
                        <option value="medium">Medium Physical Effort</option>
                        <option value="high">High Physical Effort</option>
                        <option value="very-high">Very High Physical Effort</option>
                      </select>
                    </div>

                    {/* Task Options */}
                    <div className="md:col-span-2">
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editTaskData.canSplit}
                            onChange={(e) => setEditTaskData({...editTaskData, canSplit: e.target.checked})}
                            className="rounded border-luna-pink-300 text-luna-pink-500 focus:ring-luna-pink-500"
                          />
                          <span className="text-sm text-luna-lavender-700">Can be split into smaller parts</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editTaskData.mustFinishToday}
                            onChange={(e) => setEditTaskData({...editTaskData, mustFinishToday: e.target.checked})}
                            className="rounded border-luna-pink-300 text-luna-pink-500 focus:ring-luna-pink-500"
                          />
                          <span className="text-sm text-luna-lavender-700">Must finish today</span>
                        </label>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={editTaskData.notes}
                        onChange={(e) => setEditTaskData({...editTaskData, notes: e.target.value})}
                        rows={3}
                        className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={handleEditCancel}
                      className="px-4 py-2 text-luna-lavender-600 hover:text-luna-lavender-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                // Task display
                <div
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    task.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-luna-lavender-200 hover:border-luna-pink-300'
                  }`}
                >
                  {/* Main task row */}
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
                        task.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-luna-lavender-300 hover:border-luna-pink-500'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 text-white" />}
                    </button>
                    
                    <div className="flex-grow min-w-0">
                      {/* Task title and priority */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 flex-grow">
                          <span className={getPriorityColor(task.priority)}>
                            {getPriorityIcon(task.priority)}
                          </span>
                          <h4
                            className={`font-medium ${
                              task.completed
                                ? 'line-through text-luna-lavender-500'
                                : 'text-luna-lavender-800'
                            }`}
                          >
                            {task.text}
                          </h4>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => handleEditStart(task)}
                            className="flex-shrink-0 p-1 text-luna-pink-600 hover:bg-luna-pink-50 rounded transition-colors"
                            title="Edit task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="flex-shrink-0 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete task"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Task details */}
                      <div className="mt-2 space-y-2">
                        {/* Duration and deadline */}
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          {task.estimatedDuration && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              ⏱️ {formatDuration(task.estimatedDuration)}
                            </span>
                          )}
                          {task.deadline && (
                            <span className={`px-2 py-1 rounded-full ${
                              task.deadline < new Date() 
                                ? 'bg-red-100 text-red-800' 
                                : task.deadline.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              📅 {formatDeadline(task.deadline)}
                            </span>
                          )}
                          {(task.mustFinishToday ?? false) && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                              🔥 Must finish today
                            </span>
                          )}
                          {(task.canSplit ?? true) && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              ✂️ Can split
                            </span>
                          )}
                        </div>

                        {/* Effort indicators */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={`px-2 py-1 rounded-full ${getEffortColor(task.mentalEffort || 'medium')}`}>
                            🧠 {(task.mentalEffort || 'medium').replace('-', ' ')} mental
                          </span>
                          <span className={`px-2 py-1 rounded-full ${getEffortColor(task.physicalEffort || 'low')}`}>
                            💪 {(task.physicalEffort || 'low').replace('-', ' ')} physical
                          </span>
                        </div>

                        {/* Notes */}
                        {task.notes && (
                          <div className="text-sm text-luna-lavender-600 italic">
                            💭 {task.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;