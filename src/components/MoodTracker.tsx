import React, { useState } from 'react';
import { Smile, Frown, Meh, Heart, Zap, Leaf } from 'lucide-react';
import { Mood } from '../types';

interface MoodTrackerProps {
    mood?: Mood;
    onSaveMood: (moods: Mood['moods'], notes?: string) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ mood, onSaveMood }) => {
    const [selectedMoods, setSelectedMoods] = useState<Mood['moods']>(mood?.moods || []);
    const [notes, setNotes] = useState(mood?.notes || '');
    const [showNotes, setShowNotes] = useState(false);

    const moodOptions = [
        { value: 'happy', icon: Smile, label: 'Happy', color: 'text-yellow-500' },
        { value: 'excited', icon: Zap, label: 'Excited', color: 'text-orange-500' },
        { value: 'calm', icon: Leaf, label: 'Calm', color: 'text-green-500' },
        { value: 'neutral', icon: Meh, label: 'Neutral', color: 'text-luna-lavender-500' },
        { value: 'anxious', icon: Heart, label: 'Anxious', color: 'text-purple-500' },
        { value: 'sad', icon: Frown, label: 'Sad', color: 'text-blue-500' },
    ] as const;

    const handleMoodToggle = (moodValue: Mood['moods'][0]) => {
        const newSelectedMoods = selectedMoods.includes(moodValue)
            ? selectedMoods.filter(m => m !== moodValue)
            : [...selectedMoods, moodValue];

        setSelectedMoods(newSelectedMoods);

        if (!showNotes && newSelectedMoods.length > 0) {
            onSaveMood(newSelectedMoods, notes);
        }
    };

    const handleSaveWithNotes = () => {
        if (selectedMoods.length > 0) {
            onSaveMood(selectedMoods, notes);
            setShowNotes(false);
        }
    };

    return (
        <div className="card p-6">
            <h3 className="text-lg font-semibold text-luna-lavender-800 mb-4">How are you feeling today?</h3>
            <p className="text-sm text-luna-lavender-600 mb-4">Select all that apply - you can feel multiple ways!</p>

            <div className="grid grid-cols-3 gap-3 mb-4">
                {moodOptions.map(({ value, icon: Icon, label, color }) => (
                    <button
                        key={value}
                        onClick={() => handleMoodToggle(value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${selectedMoods.includes(value)
                            ? 'border-luna-pink-500 bg-luna-pink-50 shadow-md'
                            : 'border-luna-lavender-200 hover:border-luna-pink-300 hover:bg-luna-pink-50'
                            }`}
                    >
                        <Icon className={`w-6 h-6 ${color}`} />
                        <span className="text-sm font-medium text-luna-lavender-700">{label}</span>
                        {selectedMoods.includes(value) && (
                            <div className="w-2 h-2 bg-luna-pink-500 rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {selectedMoods.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-luna-lavender-700">
                            <span className="font-medium">Selected:</span> {selectedMoods.join(', ')}
                        </div>
                        <button
                            onClick={() => setShowNotes(!showNotes)}
                            className="text-sm text-luna-pink-600 hover:text-luna-pink-700 transition-colors"
                        >
                            {showNotes ? 'Hide notes' : 'Add notes'}
                        </button>
                    </div>

                    {showNotes && (
                        <div className="space-y-3">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="How was your day? Any thoughts or feelings you'd like to record?"
                                className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent resize-none"
                                rows={3}
                            />
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSaveWithNotes}
                                    className="btn-primary"
                                >
                                    Save Mood
                                </button>
                                <button
                                    onClick={() => setShowNotes(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {mood && mood.moods.length > 0 && !showNotes && (
                <div className="mt-4 p-3 bg-luna-pink-50 rounded-lg">
                    <p className="text-sm text-luna-lavender-700">
                        <span className="font-medium">Today's feelings:</span> {mood.moods.join(', ')}
                    </p>
                    {mood.notes && (
                        <p className="text-sm text-luna-lavender-600 mt-1">{mood.notes}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MoodTracker;