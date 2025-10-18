import React, { useState } from 'react';
import { Calendar, Droplets, Heart, Baby } from 'lucide-react';
import { PeriodEntry, PregnancyEntry } from '../types';
import { calculatePeriodPrediction, calculateOvulationDate } from '../utils/dateUtils';

interface PeriodTrackerProps {
  periodEntry?: PeriodEntry;
  pregnancyEntry?: PregnancyEntry;
  onSavePeriodEntry: (entry: Omit<PeriodEntry, 'id' | 'date'>) => void;
  onSavePregnancyEntry: (entry: Omit<PregnancyEntry, 'id' | 'date'>) => void;
  lastPeriodDate?: Date;
}

const PeriodTracker: React.FC<PeriodTrackerProps> = ({
  periodEntry,
  pregnancyEntry,
  onSavePeriodEntry,
  onSavePregnancyEntry,
  lastPeriodDate
}) => {
  const [activeTab, setActiveTab] = useState<'period' | 'pregnancy'>('period');
  const [periodType, setPeriodType] = useState<PeriodEntry['type']>('period');
  const [flow, setFlow] = useState<PeriodEntry['flow']>('medium');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [pregnancyWeek, setPregnancyWeek] = useState(1);
  const [pregnancySymptoms, setPregnancySymptoms] = useState<string[]>([]);
  const [pregnancyNotes, setPregnancyNotes] = useState('');
  const [weight, setWeight] = useState<number | undefined>();

  const commonSymptoms = [
    'Cramps', 'Bloating', 'Headache', 'Mood swings', 'Fatigue',
    'Back pain', 'Breast tenderness', 'Nausea', 'Acne'
  ];

  const pregnancySymptomsOptions = [
    'Morning sickness', 'Fatigue', 'Breast tenderness', 'Food aversions',
    'Frequent urination', 'Mood swings', 'Heartburn', 'Back pain',
    'Swollen feet', 'Constipation'
  ];

  const handleSymptomToggle = (symptom: string, isPregnancy = false) => {
    const currentSymptoms = isPregnancy ? pregnancySymptoms : symptoms;
    const setCurrentSymptoms = isPregnancy ? setPregnancySymptoms : setSymptoms;
    
    if (currentSymptoms.includes(symptom)) {
      setCurrentSymptoms(currentSymptoms.filter(s => s !== symptom));
    } else {
      setCurrentSymptoms([...currentSymptoms, symptom]);
    }
  };

  const handleSavePeriod = () => {
    onSavePeriodEntry({
      type: periodType,
      flow: periodType === 'period' ? flow : undefined,
      symptoms,
      notes: notes || undefined
    });
  };

  const handleSavePregnancy = () => {
    onSavePregnancyEntry({
      week: pregnancyWeek,
      symptoms: pregnancySymptoms,
      notes: pregnancyNotes || undefined,
      weight
    });
  };

  const nextPeriodDate = lastPeriodDate ? calculatePeriodPrediction(lastPeriodDate) : null;
  const ovulationDate = lastPeriodDate ? calculateOvulationDate(lastPeriodDate) : null;

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('period')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'period'
              ? 'bg-luna-pink-500 text-white'
              : 'bg-luna-lavender-100 text-luna-lavender-700 hover:bg-luna-lavender-200'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>Period</span>
        </button>
        <button
          onClick={() => setActiveTab('pregnancy')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'pregnancy'
              ? 'bg-luna-pink-500 text-white'
              : 'bg-luna-lavender-100 text-luna-lavender-700 hover:bg-luna-lavender-200'
          }`}
        >
          <Baby className="w-4 h-4" />
          <span>Pregnancy</span>
        </button>
      </div>

      {activeTab === 'period' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Type
            </label>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as PeriodEntry['type'])}
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            >
              <option value="period">Period</option>
              <option value="ovulation">Ovulation</option>
              <option value="pms">PMS</option>
            </select>
          </div>

          {periodType === 'period' && (
            <div>
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Flow
              </label>
              <select
                value={flow}
                onChange={(e) => setFlow(e.target.value as PeriodEntry['flow'])}
                className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Symptoms
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
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 resize-none"
              rows={3}
            />
          </div>

          <button onClick={handleSavePeriod} className="btn-primary w-full">
            Save Period Entry
          </button>

          {(nextPeriodDate || ovulationDate) && (
            <div className="mt-6 p-4 bg-luna-pink-50 rounded-lg">
              <h4 className="font-medium text-luna-lavender-800 mb-2">Predictions</h4>
              {nextPeriodDate && (
                <p className="text-sm text-luna-lavender-600">
                  Next period: {nextPeriodDate.toLocaleDateString()}
                </p>
              )}
              {ovulationDate && (
                <p className="text-sm text-luna-lavender-600">
                  Ovulation: {ovulationDate.toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pregnancy' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Week of Pregnancy
            </label>
            <input
              type="number"
              min="1"
              max="42"
              value={pregnancyWeek}
              onChange={(e) => setPregnancyWeek(parseInt(e.target.value))}
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Weight (optional)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight || ''}
              onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Weight in kg"
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
              Symptoms
            </label>
            <div className="grid grid-cols-2 gap-2">
              {pregnancySymptomsOptions.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom, true)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    pregnancySymptoms.includes(symptom)
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
              Notes
            </label>
            <textarea
              value={pregnancyNotes}
              onChange={(e) => setPregnancyNotes(e.target.value)}
              placeholder="How are you feeling? Any thoughts or observations..."
              className="w-full p-2 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 resize-none"
              rows={3}
            />
          </div>

          <button onClick={handleSavePregnancy} className="btn-primary w-full">
            Save Pregnancy Entry
          </button>
        </div>
      )}
    </div>
  );
};

export default PeriodTracker;