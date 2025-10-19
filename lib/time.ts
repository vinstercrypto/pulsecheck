/**
 * Timezone helper for America/Toronto (Eastern Time)
 */

export function getEasternNow(): Date {
  // Get current time in Eastern timezone
  const now = new Date();
  
  // Convert to Eastern time using toLocaleString with proper timezone
  const easternTimeString = now.toLocaleString("en-US", { 
    timeZone: "America/Toronto",
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // Parse the Eastern time string (format: "MM/DD/YYYY, HH:mm:ss")
  const [datePart, timePart] = easternTimeString.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');
  
  return new Date(
    parseInt(year), 
    parseInt(month) - 1, 
    parseInt(day), 
    parseInt(hour), 
    parseInt(minute), 
    parseInt(second)
  );
}

export function getEasternTodayWindow(): { start: Date; end: Date } {
  const easternNow = getEasternNow();
  
  // Start of today in Eastern time (00:00:00)
  const start = new Date(easternNow);
  start.setHours(0, 0, 0, 0);
  
  // End of today in Eastern time (23:59:59.999)
  const end = new Date(easternNow);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

export function isWithinEasternDay(date: Date): boolean {
  const { start, end } = getEasternTodayWindow();
  return date >= start && date <= end;
}

export function getEasternMidnightNext(): Date {
  const easternNow = getEasternNow();
  const midnightNext = new Date(easternNow);
  midnightNext.setDate(midnightNext.getDate() + 1);
  midnightNext.setHours(0, 0, 0, 0);
  return midnightNext;
}