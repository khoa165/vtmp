import { format } from 'date-fns';

export const MONTH_DATE_YEAR = 'MMM d, yyyy'; // Jun 3, 2025

export const formatRelativeDate = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - parsedDate.getTime()) / 1000
  );
  if (diffInSeconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days <= 2) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  return format(parsedDate, MONTH_DATE_YEAR);
};
