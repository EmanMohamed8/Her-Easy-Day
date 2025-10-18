import React from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarDays, formatDate } from '../utils/dateUtils';
import { DayData } from '../types';

interface CalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
  dayData: Record<string, DayData>;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  onDateChange,
  onDayClick,
  dayData
}) => {
  const calendarDays = getCalendarDays(currentDate);
  
  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    onDateChange(newDate);
  };
  
  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const getDayIndicators = (date: Date) => {
    const dateKey = formatDate(date);
    const data = dayData[dateKey];
    const indicators = [];
    
    if (data?.tasks?.some(task => !task.completed)) {
      indicators.push('tasks');
    }
    if (data?.mood) {
      indicators.push('mood');
    }
    if (data?.periodEntry) {
      indicators.push('period');
    }
    if (data?.sleepEntry) {
      indicators.push('sleep');
    }
    if (data?.physicalHealthEntry) {
      indicators.push('health');
    }
    if (data?.obstacles && data.obstacles.length > 0) {
      indicators.push('obstacles');
    }
    if (data?.timeEntry) {
      indicators.push('time');
    }
    
    return indicators;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-luna-pink-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-luna-pink-600" />
        </button>
        
        <h2 className="text-xl font-semibold text-luna-lavender-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-luna-pink-50 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-luna-pink-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-luna-lavender-600">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(day => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const indicators = getDayIndicators(day);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={`
                relative p-3 text-sm rounded-lg transition-all duration-200 hover:bg-luna-pink-50
                ${isCurrentMonth ? 'text-luna-lavender-800' : 'text-luna-lavender-400'}
                ${isCurrentDay ? 'bg-luna-pink-500 text-white hover:bg-luna-pink-600' : ''}
              `}
            >
              {format(day, 'd')}
              
              {indicators.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-0.5 max-w-8">
                  {indicators.includes('tasks') && (
                    <div className="w-1.5 h-1.5 bg-luna-pink-400 rounded-full"></div>
                  )}
                  {indicators.includes('mood') && (
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  )}
                  {indicators.includes('period') && (
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  )}
                  {indicators.includes('sleep') && (
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  )}
                  {indicators.includes('health') && (
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  )}
                  {indicators.includes('obstacles') && (
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  )}
                  {indicators.includes('time') && (
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;