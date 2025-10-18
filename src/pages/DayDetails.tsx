import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TaskList from '../components/TaskList';
import MoodTracker from '../components/MoodTracker';
import PeriodTracker from '../components/PeriodTracker';
import SleepTracker from '../components/SleepTracker';
import PhysicalHealthTracker from '../components/PhysicalHealthTracker';
import ObstacleTracker from '../components/ObstacleTracker';
import TimeTracker from '../components/TimeTracker';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DayData, Task, Mood, PeriodEntry, PregnancyEntry, SleepEntry, PhysicalHealthEntry, ObstacleEntry, TimeEntry } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';

const DayDetails: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [dayData, setDayData] = useLocalStorage<Record<string, DayData>>('luna-planner-data', {});

  if (!date) {
    navigate('/');
    return null;
  }

  const currentDayData = dayData[date] || {
    date,
    tasks: [],
    mood: undefined,
    periodEntry: undefined,
    pregnancyEntry: undefined,
    sleepEntry: undefined,
    physicalHealthEntry: undefined,
    obstacles: [],
    timeEntry: undefined
  };

  const selectedDate = new Date(date);

  const updateDayData = (updates: Partial<DayData>) => {
    setDayData(prev => ({
      ...prev,
      [date]: {
        ...currentDayData,
        ...updates
      }
    }));
  };

  const handleAddTask = (text: string, priority: Task['priority']) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      priority,
      completed: false,
      createdAt: new Date()
    };
    
    updateDayData({
      tasks: [...currentDayData.tasks, newTask]
    });
  };

  const handleToggleTask = (taskId: string) => {
    updateDayData({
      tasks: currentDayData.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    });
  };

  const handleDeleteTask = (taskId: string) => {
    updateDayData({
      tasks: currentDayData.tasks.filter(task => task.id !== taskId)
    });
  };

  const handleEditTask = (taskId: string, text: string, priority: Task['priority']) => {
    updateDayData({
      tasks: currentDayData.tasks.map(task =>
        task.id === taskId ? { ...task, text, priority } : task
      )
    });
  };

  const handleSaveMood = (moods: Mood['moods'], notes?: string) => {
    const moodEntry: Mood = {
      id: Date.now().toString(),
      date,
      moods,
      notes
    };
    
    updateDayData({ mood: moodEntry });
  };

  const handleSavePeriodEntry = (entry: Omit<PeriodEntry, 'id' | 'date'>) => {
    const periodEntry: PeriodEntry = {
      id: Date.now().toString(),
      date,
      ...entry
    };
    
    updateDayData({ periodEntry });
  };

  const handleSavePregnancyEntry = (entry: Omit<PregnancyEntry, 'id' | 'date'>) => {
    const pregnancyEntry: PregnancyEntry = {
      id: Date.now().toString(),
      date,
      ...entry
    };
    
    updateDayData({ pregnancyEntry });
  };

  const handleSaveSleep = (entry: Omit<SleepEntry, 'id' | 'date'>) => {
    const sleepEntry: SleepEntry = {
      id: Date.now().toString(),
      date,
      ...entry
    };
    
    updateDayData({ sleepEntry });
  };

  const handleSavePhysicalHealth = (entry: Omit<PhysicalHealthEntry, 'id' | 'date'>) => {
    const physicalHealthEntry: PhysicalHealthEntry = {
      id: Date.now().toString(),
      date,
      ...entry
    };
    
    updateDayData({ physicalHealthEntry });
  };

  const handleSaveObstacle = (entry: Omit<ObstacleEntry, 'id' | 'date'>) => {
    const obstacleEntry: ObstacleEntry = {
      id: Date.now().toString(),
      date,
      ...entry
    };
    
    updateDayData({ 
      obstacles: [...(currentDayData.obstacles || []), obstacleEntry] 
    });
  };

  const handleDeleteObstacle = (obstacleId: string) => {
    updateDayData({
      obstacles: (currentDayData.obstacles || []).filter(obstacle => obstacle.id !== obstacleId)
    });
  };

  const handleSaveTime = (entry: Omit<TimeEntry, 'id' | 'date'>) => {
    const timeEntry: TimeEntry = {
      id: Date.now().toString(),
      date,
      ...entry
    };
    
    updateDayData({ timeEntry });
  };

  // Find last period date for predictions
  const lastPeriodDate = Object.values(dayData)
    .filter(day => day.periodEntry?.type === 'period')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-luna-pink-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-luna-pink-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-luna-lavender-800">
            {formatDisplayDate(selectedDate)}
          </h1>
          <p className="text-luna-lavender-600">
            Plan your day and track your wellness
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Tasks & Mood */}
        <div className="space-y-6">
          <TaskList
            tasks={currentDayData.tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
          
          <MoodTracker
            mood={currentDayData.mood}
            onSaveMood={handleSaveMood}
          />

          <TimeTracker
            timeEntry={currentDayData.timeEntry}
            onSaveTime={handleSaveTime}
          />
        </div>
        
        {/* Middle Column - Health & Sleep */}
        <div className="space-y-6">
          <SleepTracker
            sleepEntry={currentDayData.sleepEntry}
            onSaveSleep={handleSaveSleep}
          />

          <PhysicalHealthTracker
            physicalHealthEntry={currentDayData.physicalHealthEntry}
            onSavePhysicalHealth={handleSavePhysicalHealth}
          />
        </div>

        {/* Right Column - Period & Obstacles */}
        <div className="space-y-6">
          <PeriodTracker
            periodEntry={currentDayData.periodEntry}
            pregnancyEntry={currentDayData.pregnancyEntry}
            onSavePeriodEntry={handleSavePeriodEntry}
            onSavePregnancyEntry={handleSavePregnancyEntry}
            lastPeriodDate={lastPeriodDate ? new Date(lastPeriodDate) : undefined}
          />

          <ObstacleTracker
            obstacles={currentDayData.obstacles}
            onSaveObstacle={handleSaveObstacle}
            onDeleteObstacle={handleDeleteObstacle}
          />
        </div>
      </div>
    </div>
  );
};

export default DayDetails;