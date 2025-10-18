import React, { useState } from 'react';
import { Clock, Plus, X, Play, Pause } from 'lucide-react';
import { TimeEntry } from '../types';

interface TimeTrackerProps {
  timeEntry?: TimeEntry;
  onSaveTime: (entry: Omit<TimeEntry, 'id' | 'date'>) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ timeEntry, onSaveTime }) => {
  const [availableHours, setAvailableHours] = useState(timeEntry?.availableHours || 8);
  const [plannedHours, setPlannedHours] = useState(timeEntry?.plannedHours || 6);
  const [actualProductiveHours, setActualProductiveHours] = useState(timeEntry?.actualProductiveHours || 0);
  const [timeBlocks, setTimeBlocks] = useState(timeEntry?.timeBlocks || []);
  const [notes, setNotes] = useState(timeEntry?.notes || '');
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [newBlockStart, setNewBlockStart] = useState('09:00');
  const [newBlockEnd, setNewBlockEnd] = useState('10:00');
  const [newBlockActivity, setNewBlockActivity] = useState('');

  const handleAddTimeBlock = () => {
    if (newBlockActivity.trim()) {
      const newBlock = {
        start: newBlockStart,
        end: newBlockEnd,
        activity: newBlockActivity.trim(),
        completed: false
      };
      
      setTimeBlocks([...timeBlocks, newBlock]);
      setNewBlockActivity('');
      setShowAddBlock(false);
    }
  };

  const handleToggleBlock = (index: number) => {
    const updatedBlocks = timeBlocks.map((block, i) => 
      i === index ? { ...block, completed: !block.completed } : block
    );
    setTimeBlocks(updatedBlocks);
  };

  const handleDeleteBlock = (index: number) => {
    setTimeBlocks(timeBlocks.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSaveTime({
      availableHours,
      plannedHours,
      actualProductiveHours: actualProductiveHours > 0 ? actualProductiveHours : undefined,
      timeBlocks: timeBlocks.length > 0 ? timeBlocks : undefined,
      notes: notes || undefined
    });
  };

  const calculateDuration = (start: string, end: string): number => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  };

  const totalPlannedBlockTime = timeBlocks.reduce((total, block) => 
    total + calculateDuration(block.start, block.end), 0
  );

  const completedBlockTime = timeBlocks
    .filter(block => block.completed)
    .reduce((total, block) => total + calculateDuration(block.start, block.end), 0);

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-luna-pink-500" />
        <h3 className="text-lg font-semibold text-luna-lavender-800">Time Management</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Available Hours
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={availableHours}
              onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Planned Hours
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={plannedHours}
              onChange={(e) => setPlannedHours(parseFloat(e.target.value))}
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Productive Hours
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={actualProductiveHours}
              onChange={(e) => setActualProductiveHours(parseFloat(e.target.value))}
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            />
          </div>
        </div>

        {/* Time Blocks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-luna-lavender-800">Time Blocks</h4>
            <button
              onClick={() => setShowAddBlock(!showAddBlock)}
              className="btn-secondary flex items-center space-x-1 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Block</span>
            </button>
          </div>

          {showAddBlock && (
            <div className="mb-3 p-3 bg-luna-pink-50 rounded-lg">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="time"
                  value={newBlockStart}
                  onChange={(e) => setNewBlockStart(e.target.value)}
                  className="p-2 border border-luna-pink-200 rounded focus:ring-2 focus:ring-luna-pink-500"
                />
                <input
                  type="time"
                  value={newBlockEnd}
                  onChange={(e) => setNewBlockEnd(e.target.value)}
                  className="p-2 border border-luna-pink-200 rounded focus:ring-2 focus:ring-luna-pink-500"
                />
                <input
                  type="text"
                  value={newBlockActivity}
                  onChange={(e) => setNewBlockActivity(e.target.value)}
                  placeholder="Activity"
                  className="p-2 border border-luna-pink-200 rounded focus:ring-2 focus:ring-luna-pink-500"
                />
              </div>
              <div className="flex space-x-2">
                <button onClick={handleAddTimeBlock} className="btn-primary text-sm">
                  Add
                </button>
                <button 
                  onClick={() => setShowAddBlock(false)} 
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {timeBlocks.map((block, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  block.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-luna-lavender-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleBlock(index)}
                    className={`p-1 rounded ${
                      block.completed 
                        ? 'text-green-600 hover:bg-green-100' 
                        : 'text-luna-lavender-500 hover:bg-luna-lavender-100'
                    }`}
                  >
                    {block.completed ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div>
                    <div className="font-medium text-luna-lavender-800">
                      {block.start} - {block.end}
                    </div>
                    <div className={`text-sm ${
                      block.completed ? 'text-green-600 line-through' : 'text-luna-lavender-600'
                    }`}>
                      {block.activity} ({calculateDuration(block.start, block.end).toFixed(1)}h)
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBlock(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {timeBlocks.length > 0 && (
            <div className="mt-3 p-3 bg-luna-lavender-50 rounded-lg text-sm">
              <div className="flex justify-between">
                <span>Planned blocks: {totalPlannedBlockTime.toFixed(1)}h</span>
                <span>Completed: {completedBlockTime.toFixed(1)}h</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
            Time Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you manage your time today? Any insights..."
            className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 resize-none"
            rows={2}
          />
        </div>

        <button onClick={handleSave} className="btn-primary w-full">
          Save Time Data
        </button>
      </div>

      {timeEntry && (
        <div className="mt-4 p-3 bg-luna-pink-50 rounded-lg">
          <div className="text-sm text-luna-lavender-700">
            <div className="flex justify-between">
              <span><span className="font-medium">Available:</span> {timeEntry.availableHours}h</span>
              <span><span className="font-medium">Planned:</span> {timeEntry.plannedHours}h</span>
            </div>
            {timeEntry.actualProductiveHours && (
              <div className="mt-1">
                <span className="font-medium">Productive:</span> {timeEntry.actualProductiveHours}h
                <span className="ml-2 text-luna-lavender-500">
                  ({Math.round((timeEntry.actualProductiveHours / timeEntry.availableHours) * 100)}% efficiency)
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;