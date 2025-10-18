import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/Calendar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DayData } from '../types';
import { formatDate } from '../utils/dateUtils';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayData] = useLocalStorage<Record<string, DayData>>('luna-planner-data', {});

  const handleDayClick = (date: Date) => {
    const dateString = formatDate(date);
    navigate(`/day/${dateString}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-luna-lavender-800 mb-2">
          Welcome back! ✨
        </h2>
        <p className="text-luna-lavender-600">
          Plan your days, track your mood, and take care of yourself.
        </p>
      </div>
      
      <Calendar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onDayClick={handleDayClick}
        dayData={dayData}
      />
    </div>
  );
};

export default Home;