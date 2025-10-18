import React, { useState } from 'react';
import { User, Settings, Download, Upload, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DayData } from '../types';

const Profile: React.FC = () => {
  const [dayData, setDayData] = useLocalStorage<Record<string, DayData>>('her-easy-day-data', {});
  const [userName, setUserName] = useLocalStorage('her-easy-day-username', '');
  const [cycleLength, setCycleLength] = useLocalStorage('her-easy-day-cycle-length', 28);
  const [showExportData, setShowExportData] = useState(false);

  const handleExportData = () => {
    const dataToExport = {
      userData: { userName, cycleLength },
      dayData
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'her-easy-day-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (importedData.userData) {
          setUserName(importedData.userData.userName || '');
          setCycleLength(importedData.userData.cycleLength || 28);
        }
        if (importedData.dayData) {
          setDayData(importedData.dayData);
        }
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setDayData({});
      setUserName('');
      setCycleLength(28);
      alert('All data has been cleared.');
    }
  };

  const totalTasks = Object.values(dayData).reduce((sum, day) => sum + day.tasks.length, 0);
  const completedTasks = Object.values(dayData).reduce(
    (sum, day) => sum + day.tasks.filter(task => task.completed).length, 0
  );
  const moodEntries = Object.values(dayData).filter(day => day.mood).length;
  const periodEntries = Object.values(dayData).filter(day => day.periodEntry).length;
  const sleepEntries = Object.values(dayData).filter(day => day.sleepEntry).length;
  const healthEntries = Object.values(dayData).filter(day => day.physicalHealthEntry).length;
  const obstacleEntries = Object.values(dayData).reduce((sum, day) => sum + (day.obstacles?.length || 0), 0);
  const timeEntries = Object.values(dayData).filter(day => day.timeEntry).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-luna-lavender-800 mb-2">Profile & Settings</h1>
        <p className="text-luna-lavender-600">Manage your account and app preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-luna-pink-500" />
            <h2 className="text-xl font-semibold text-luna-lavender-800">Profile</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-luna-lavender-700 mb-2">
                Average Cycle Length (days)
              </label>
              <input
                type="number"
                min="21"
                max="35"
                value={cycleLength}
                onChange={(e) => setCycleLength(parseInt(e.target.value))}
                className="w-full p-3 border border-luna-pink-200 rounded-lg focus:ring-2 focus:ring-luna-pink-500 focus:border-transparent"
              />
              <p className="text-xs text-luna-lavender-500 mt-1">
                Used for period predictions (typically 21-35 days)
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-luna-lavender-800 mb-6">Your Stats</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-luna-pink-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-luna-pink-600">{totalTasks}</div>
              <div className="text-sm text-luna-lavender-600">Total Tasks</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <div className="text-sm text-luna-lavender-600">Completed</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{moodEntries}</div>
              <div className="text-sm text-luna-lavender-600">Mood Entries</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{periodEntries}</div>
              <div className="text-sm text-luna-lavender-600">Period Entries</div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{sleepEntries}</div>
              <div className="text-sm text-luna-lavender-600">Sleep Entries</div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{healthEntries}</div>
              <div className="text-sm text-luna-lavender-600">Health Entries</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{obstacleEntries}</div>
              <div className="text-sm text-luna-lavender-600">Obstacles</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{timeEntries}</div>
              <div className="text-sm text-luna-lavender-600">Time Entries</div>
            </div>
          </div>
          
          {totalTasks > 0 && (
            <div className="mt-4 p-3 bg-luna-lavender-50 rounded-lg">
              <div className="text-sm text-luna-lavender-700">
                Completion Rate: {Math.round((completedTasks / totalTasks) * 100)}%
              </div>
              <div className="w-full bg-luna-lavender-200 rounded-full h-2 mt-2">
                <div
                  className="bg-luna-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Data Management */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-6 h-6 text-luna-pink-500" />
            <h2 className="text-xl font-semibold text-luna-lavender-800">Data Management</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-luna-pink-200 rounded-lg hover:border-luna-pink-300 hover:bg-luna-pink-50 transition-colors"
            >
              <Download className="w-5 h-5 text-luna-pink-600" />
              <span className="font-medium text-luna-lavender-700">Export Data</span>
            </button>
            
            <label className="flex items-center justify-center space-x-2 p-4 border-2 border-luna-pink-200 rounded-lg hover:border-luna-pink-300 hover:bg-luna-pink-50 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 text-luna-pink-600" />
              <span className="font-medium text-luna-lavender-700">Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleClearAllData}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-700">Clear All Data</span>
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-luna-lavender-50 rounded-lg">
            <h3 className="font-medium text-luna-lavender-800 mb-2">About Data Storage</h3>
            <p className="text-sm text-luna-lavender-600">
              Your data is stored locally in your browser. Export your data regularly to create backups. 
              Clearing browser data will remove all your Luna Planner information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;