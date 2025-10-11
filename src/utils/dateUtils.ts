export const formatDateToMMDD = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}/${day}`;
};

export const formatDateToTimeOfDay = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = String(minutes).padStart(2, "0"); // Pad minutes to always show 2 digits

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const isMoreThanTwoHoursAgo = (timestamp: string): boolean => {
  const now = new Date().getTime(); // Current time in milliseconds
  const timestampInMillis = new Date(timestamp).getTime(); // Convert Firestore Timestamp to JavaScript Date and then to milliseconds
  const twoHoursInMillis = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  return now - timestampInMillis > twoHoursInMillis;
};

export const formatMinutesToMSS = (minutesFraction: number): string => {
  const totalSeconds = Math.floor(minutesFraction * 60); // Convert to total seconds
  const minutes = Math.floor(totalSeconds / 60); // Extract minutes
  const seconds = totalSeconds % 60; // Extract remaining seconds
  const formattedSeconds = seconds.toString().padStart(2, "0"); // Pad seconds to always show 2 digits
  return `${minutes}m ${formattedSeconds}s`;
};

export const getSeasonString = (date?: Date): string => {
  const now = date ?? new Date();
  const month = now.getUTCMonth();
  const seasons = ["Winter", "Spring", "Summer", "Fall"];
  const seasonIndex = Math.floor(month / 3);
  return seasons[seasonIndex];
};

export const getSeasonEmoji = (date?: Date): string => {
  const now = date ?? new Date();
  const month = now.getUTCMonth();
  const seasons = ["🎉", "🌺", "🌞", "🎃"];
  const seasonIndex = Math.floor(month / 3);
  return seasons[seasonIndex];
};

export const getThreeMonthsAgo = (specificDate?: Date): Date => {
  const now = specificDate ?? new Date();
  now.setMonth(now.getMonth() - 3);
  return now;
};

export const formatSeasonString = (specificDate?: Date): string => {
  const date = specificDate ?? new Date();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const seasons = ["Winter", "Spring", "Summer", "Fall"];
  const seasonIndex = Math.floor(month / 3);
  const seasonYear = seasonIndex === 3 ? year + 1 : year;
  const endMonths = [2, 5, 8, 11];
  const endDate = new Date(Date.UTC(seasonYear, endMonths[seasonIndex] + 1, 0));
  return `${seasonYear} ${
    seasons[seasonIndex]
  } Season - through ${endDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })}`;
};

export const getSeasonStart = (specificDate?: Date): string => {
  const now = specificDate ?? new Date();
  const year = now.getUTCFullYear();
  const quarters = [0, 3, 6, 9];
  const lastQuarter = quarters.reduce(
    (prev, curr) => (now.getUTCMonth() >= curr ? curr : prev),
    0
  );
  return new Date(Date.UTC(year, lastQuarter, 1, 23, 59, 59)).toISOString();
};

export const formatDateStringToMMDDYYY = (dateStr: string): string => {
  const date = new Date(dateStr);
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

export const areStringArraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};
