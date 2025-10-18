import React, { useState } from 'react';
import { Plus, Check, X, AlertCircle, Edit2 } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string, priority: Task['priority']) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, text: string, priority: Task['priority']) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState<Task['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim(), newTaskPriority);
      setNewTaskText('');
      setNewTaskPriority('medium');
      setShowAddForm(false);
    }
  };

  const handleEditStart = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTaskText(task.text);
    setEditTaskPriority(task.priority);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTaskText.trim() && editingTaskId) {
      onEditTask(editingTaskId, editTaskText.trim(), editTaskPriority);
      setEditingTaskId(null);
      setEditTaskText('');
      setEditTaskPriority('medium');
    }
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
    setEditTaskText('');
    setEditTaskPriority('medium');
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
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-luna-pink-50 rounded-lg">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Enter task..."
            className="w-full p-2 border border-luna-pink-200 rounded-lg mb-3 focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
              className="p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
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
                // Edit form
                <form onSubmit={handleEditSubmit} className="p-4 bg-luna-pink-50 rounded-lg border border-luna-pink-200">
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    className="w-full p-2 border border-luna-pink-200 rounded-lg mb-3 focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex items-center justify-between">
                    <select
                      value={editTaskPriority}
                      onChange={(e) => setEditTaskPriority(e.target.value as Task['priority'])}
                      className="p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <div className="flex space-x-2">
                      <button type="submit" className="btn-primary">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleEditCancel}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                // Task display
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                    task.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-luna-lavender-200 hover:border-luna-pink-300'
                  }`}
                >
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-luna-lavender-300 hover:border-luna-pink-500'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  
                  <div className="flex items-center space-x-2 flex-grow">
                    <span className={getPriorityColor(task.priority)}>
                      {getPriorityIcon(task.priority)}
                    </span>
                    <span
                      className={`flex-grow ${
                        task.completed
                          ? 'line-through text-luna-lavender-500'
                          : 'text-luna-lavender-800'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
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
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;