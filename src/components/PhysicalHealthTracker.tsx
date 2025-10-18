import React, { useState } from 'react';
import { Activity, Droplets, Zap } from 'lucide-react';
import { PhysicalHealthEntry } from '../types';

interface PhysicalHealthTrackerProps {
  physicalHealthEntry?: PhysicalHealthEntry;
  onSavePhysicalHealth: (entry: Omit<PhysicalHealthEntry, 'id' | 'date'>) => void;
}

const PhysicalHealthTracker: React.FC<PhysicalHealthTrackerProps> = ({ 
  physicalHealthEntry, 
  onSavePhysicalHealth 
}) => {
  const [energyLevel, setEnergyLevel] = useState<PhysicalHealthEntry['energyLevel']>(
    physicalHealthEntry?.energyLevel || 'medium'
  );
  const [exerciseType, setExerciseType] = useState(physicalHealthEntry?.exerciseType || '');
  const [exerciseDuration, setExerciseDuration] = useState(physicalHealthEntry?.exerciseDuration || 0);
  const [waterIntake, setWaterIntake] = useState(physicalHealthEntry?.waterIntake || 8);
  const [symptoms, setSymptoms] = useState<string[]>(physicalHealthEntry?.symptoms || []);
  const [notes, setNotes] = useState(physicalHealthEntry?.notes || '');

  const energyOptions = [
    { value: 'very-high', label: 'Very High', color: 'bg-green-500', emoji: '⚡' },
    { value: 'high', label: 'High', color: 'bg-green-400', emoji: '💪' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-400', emoji: '👍' },
    { value: 'low', label: 'Low', color: 'bg-orange-400', emoji: '😴' },
    { value: 'very-low', label: 'Very Low', color: 'bg-red-400', emoji: '🔋' },
  ] as const;

  const commonSymptoms = [
    'Headache', 'Fatigue', 'Muscle pain', 'Joint pain', 'Nausea',
    'Dizziness', 'Congestion', 'Sore throat', 'Back pain', 'Stomach ache'
  ];

  const handleSymptomToggle = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleSave = () => {
    onSavePhysicalHealth({
      energyLevel,
      exerciseType: exerciseType || undefined,
      exerciseDuration: exerciseDuration > 0 ? exerciseDuration : undefined,
      waterIntake,
      symptoms: symptoms.length > 0 ? symptoms : undefined,
      notes: notes || undefined
    });
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-luna-pink-500" />
        <h3 className="text-lg font-semibold text-luna-lavender-800">Physical Health</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
            <Zap className="w-4 h-4 inline mr-1" />
            Energy Level
          </label>
          <div className="grid grid-cols-5 gap-2">
            {energyOptions.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => setEnergyLevel(value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                  energyLevel === value
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
              Exercise Type
            </label>
            <input
              type="text"
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              placeholder="Walking, yoga, gym..."
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="0"
              value={exerciseDuration}
              onChange={(e) => setExerciseDuration(parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
            <Droplets className="w-4 h-4 inline mr-1" />
            Water Intake (glasses)
          </label>
          <input
            type="number"
            min="0"
            max="20"
            value={waterIntake}
            onChange={(e) => setWaterIntake(parseInt(e.target.value) || 0)}
            className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
            Physical Symptoms
          </label>
          <div className="grid grid-cols-2 gap-2">
            {commonSymptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => handleSymptomToggle(symptom)}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  symptoms.includes(symptom)
                    ? 'bg-luna-pink-500 text-white border-luna-pink-500'
                    : 'bg-white text-luna-lavender-700 border-luna-lavender-200 hover:border-luna-pink-300'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
            Health Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling physically? Any observations..."
            className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 resize-none"
            rows={2}
          />
        </div>

        <button onClick={handleSave} className="btn-primary w-full">
          Save Health Data
        </button>
      </div>

      {physicalHealthEntry && (
        <div className="mt-4 p-3 bg-luna-pink-50 rounded-lg">
          <p className="text-sm text-luna-lavender-700">
            <span className="font-medium">Energy:</span> {physicalHealthEntry.energyLevel.replace('-', ' ')}
          </p>
          {physicalHealthEntry.exerciseType && (
            <p className="text-sm text-luna-lavender-600">
              Exercise: {physicalHealthEntry.exerciseType} ({physicalHealthEntry.exerciseDuration}min)
            </p>
          )}
          <p className="text-sm text-luna-lavender-600">
            Water: {physicalHealthEntry.waterIntake} glasses
          </p>
        </div>
      )}
    </div>
  );
};

export default PhysicalHealthTracker;