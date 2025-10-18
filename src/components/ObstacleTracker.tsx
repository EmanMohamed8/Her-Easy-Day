import React, { useState } from 'react';
import { AlertTriangle, Users, Zap, Briefcase, Plus, X } from 'lucide-react';
import { ObstacleEntry } from '../types';

interface ObstacleTrackerProps {
  obstacles?: ObstacleEntry[];
  onSaveObstacle: (entry: Omit<ObstacleEntry, 'id' | 'date'>) => void;
  onDeleteObstacle: (obstacleId: string) => void;
}

const ObstacleTracker: React.FC<ObstacleTrackerProps> = ({ 
  obstacles = [], 
  onSaveObstacle, 
  onDeleteObstacle 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [type, setType] = useState<ObstacleEntry['type']>('unexpected-event');
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState<ObstacleEntry['impact']>('medium');
  const [timeAffected, setTimeAffected] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const obstacleTypes = [
    { value: 'visitor', label: 'Visitor', icon: Users, color: 'text-blue-500' },
    { value: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'text-red-500' },
    { value: 'unexpected-event', label: 'Unexpected Event', icon: Zap, color: 'text-yellow-500' },
    { value: 'work-interruption', label: 'Work Interruption', icon: Briefcase, color: 'text-purple-500' },
    { value: 'health-issue', label: 'Health Issue', icon: AlertTriangle, color: 'text-orange-500' },
    { value: 'other', label: 'Other', icon: AlertTriangle, color: 'text-luna-lavender-500' },
  ] as const;

  const impactLevels = [
    { value: 'low', label: 'Low Impact', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium Impact', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High Impact', color: 'bg-red-100 text-red-800' },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSaveObstacle({
        type,
        description: description.trim(),
        impact,
        timeAffected: timeAffected > 0 ? timeAffected : undefined,
        notes: notes || undefined
      });
      
      // Reset form
      setDescription('');
      setType('unexpected-event');
      setImpact('medium');
      setTimeAffected(0);
      setNotes('');
      setShowAddForm(false);
    }
  };

  const getTypeIcon = (obstacleType: ObstacleEntry['type']) => {
    const typeConfig = obstacleTypes.find(t => t.value === obstacleType);
    const Icon = typeConfig?.icon || AlertTriangle;
    return <Icon className={`w-4 h-4 ${typeConfig?.color || 'text-luna-lavender-500'}`} />;
  };

  const getImpactStyle = (impactLevel: ObstacleEntry['impact']) => {
    const impactConfig = impactLevels.find(i => i.value === impactLevel);
    return impactConfig?.color || 'bg-luna-lavender-100 text-luna-lavender-800';
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-luna-pink-500" />
          <h3 className="text-lg font-semibold text-luna-lavender-800">Daily Obstacles</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Obstacle</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-luna-pink-50 rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Type of Obstacle
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ObstacleEntry['type'])}
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            >
              {obstacleTypes.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened?"
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Impact Level
              </label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value as ObstacleEntry['impact'])}
                className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
              >
                {impactLevels.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Time Affected (hours)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={timeAffected}
                onChange={(e) => setTimeAffected(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details, how you handled it..."
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 resize-none"
              rows={2}
            />
          </div>

          <div className="flex space-x-2">
            <button type="submit" className="btn-primary">
              Add Obstacle
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {obstacles.length === 0 ? (
          <p className="text-luna-lavender-500 text-center py-4">No obstacles recorded today</p>
        ) : (
          obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className="p-3 bg-white border border-luna-lavender-200 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <div className="flex items-center space-x-2 mb-1">
                    {getTypeIcon(obstacle.type)}
                    <span className="font-medium text-luna-lavender-800">
                      {obstacle.description}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactStyle(obstacle.impact)}`}>
                      {obstacle.impact} impact
                    </span>
                    {obstacle.timeAffected && (
                      <span className="text-luna-lavender-600">
                        {obstacle.timeAffected}h affected
                      </span>
                    )}
                  </div>
                  
                  {obstacle.notes && (
                    <p className="text-sm text-luna-lavender-600 mt-2">{obstacle.notes}</p>
                  )}
                </div>
                
                <button
                  onClick={() => onDeleteObstacle(obstacle.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ObstacleTracker;