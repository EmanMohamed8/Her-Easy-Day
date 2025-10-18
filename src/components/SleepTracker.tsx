import React, { useState } from 'react';
import { Moon, Clock, Bed } from 'lucide-react';
import { SleepEntry } from '../types';

interface SleepTrackerProps {
  sleepEntry?: SleepEntry;
  onSaveSleep: (entry: Omit<SleepEntry, 'id' | 'date'>) => void;
}

const SleepTracker: React.FC<SleepTrackerProps> = ({ sleepEntry, onSaveSleep }) => {
  const [quality, setQuality] = useState<SleepEntry['quality']>(sleepEntry?.quality || 'good');
  const [hoursSlept, setHoursSlept] = useState(sleepEntry?.hoursSlept || 8);
  const [bedTime, setBedTime] = useState(sleepEntry?.bedTime || '22:00');
  const [wakeTime, setWakeTime] = useState(sleepEntry?.wakeTime || '06:00');
  const [notes, setNotes] = useState(sleepEntry?.notes || '');

  const qualityOptions = [
    { value: 'excellent', label: 'Excellent', color: 'bg-green-500', emoji: '😴' },
    { value: 'good', label: 'Good', color: 'bg-green-400', emoji: '😊' },
    { value: 'fair', label: 'Fair', color: 'bg-yellow-400', emoji: '😐' },
    { value: 'poor', label: 'Poor', color: 'bg-orange-400', emoji: '😔' },
    { value: 'terrible', label: 'Terrible', color: 'bg-red-400', emoji: '😵' },
  ] as const;

  const handleSave = () => {
    onSaveSleep({
      quality,
      hoursSlept,
      bedTime,
      wakeTime,
      notes: notes || undefined
    });
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Moon className="w-5 h-5 text-luna-pink-500" />
        <h3 className="text-lg font-semibold text-luna-lavender-800">Sleep Quality</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
            Sleep Quality
          </label>
          <div className="grid grid-cols-5 gap-2">
            {qualityOptions.map(({ value, label, color, emoji }) => (
              <button
                key={value}
                onClick={() => setQuality(value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                  quality === value
                    ? 'border-luna-pink-500 bg-luna-pink-50'
                    : 'border-luna-lavender-200 hover:border-luna-pink-300'
                }`}
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-xs font-medium text-luna-lavender-700">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Bedtime
            </label>
            <input
              type="time"
              value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              <Bed className="w-4 h-4 inline mr-1" />
              Wake Time
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
            Hours Slept
          </label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={hoursSlept}
            onChange={(e) => setHoursSlept(parseFloat(e.target.value))}
            className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
            Sleep Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Dreams, sleep disturbances, what helped you sleep..."
            className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 resize-none"
            rows={2}
          />
        </div>

        <button onClick={handleSave} className="btn-primary w-full">
          Save Sleep Data
        </button>
      </div>

      {sleepEntry && (
        <div className="mt-4 p-3 bg-luna-pink-50 rounded-lg">
          <p className="text-sm text-luna-lavender-700">
            <span className="font-medium">Last recorded:</span> {sleepEntry.quality} sleep, {sleepEntry.hoursSlept}h
          </p>
          {sleepEntry.bedTime && sleepEntry.wakeTime && (
            <p className="text-sm text-luna-lavender-600">
              {sleepEntry.bedTime} - {sleepEntry.wakeTime}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SleepTracker;