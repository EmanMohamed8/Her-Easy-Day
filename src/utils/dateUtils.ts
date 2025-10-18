import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, subDays } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};

export const getCalendarDays = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  // Get the first day of the week for the month
  const startDate = subDays(start, start.getDay());
  // Get the last day of the week for the month
  const endDate = addDays(end, 6 - end.getDay());
  
  return eachDayOfInterval({ start: startDate, end: endDate });
};

export const isSameDate = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

export const calculatePeriodPrediction = (lastPeriodDate: Date, cycleLength: number = 28): Date => {
  return addDays(lastPeriodDate, cycleLength);
};

export const calculateOvulationDate = (lastPeriodDate: Date, cycleLength: number = 28): Date => {
  return addDays(lastPeriodDate, Math.floor(cycleLength / 2));
};