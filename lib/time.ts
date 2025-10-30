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

/**
 * Returns UTC Date objects that represent the start and end of the current Eastern day.
 * This is useful when storing timestamps in UTC while aligning windows to ET.
 */
export function getEasternTodayWindowUtc(): { startUtc: Date; endUtc: Date } {
  const nowUtc = new Date();
  const easternNow = getEasternNow();
  // Offset between UTC and Eastern in ms (UTC - ET)
  const offsetMs = nowUtc.getTime() - easternNow.getTime();

  const { start, end } = getEasternTodayWindow();
  // Translate ET-local Date objects to their corresponding UTC instants
  const startUtc = new Date(start.getTime() + offsetMs);
  const endUtc = new Date(end.getTime() + offsetMs);
  return { startUtc, endUtc };
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

/**
 * Returns the next Eastern midnight as a UTC Date (useful for end_ts scheduling).
 */
export function getEasternMidnightNextUtc(): Date {
  const nowUtc = new Date();
  const easternNow = getEasternNow();
  const offsetMs = nowUtc.getTime() - easternNow.getTime();
  const midnightNextEt = getEasternMidnightNext();
  return new Date(midnightNextEt.getTime() + offsetMs);
}