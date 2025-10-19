/**
 * Timezone helper for America/Toronto (Eastern Time)
 */

export function getEasternNow(): Date {
  // Get current time in America/Toronto timezone
  const now = new Date();
  const easternTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Toronto" }));
  return easternTime;
}

export function getEasternTodayWindow(): { start: Date; end: Date } {
  const easternNow = getEasternNow();
  
  // Start of today in Eastern time
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
