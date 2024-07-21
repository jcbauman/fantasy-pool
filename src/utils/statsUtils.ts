export const normalizePercentage = (value: number): string => {
  const per = Number.isNaN(value) ? 0 : (value * 100).toFixed(1);
  return per + "%";
};

export const normalizeStat = (value: number): string => {
  const per = Number.isNaN(value) ? 0 : value.toFixed(1);
  return per.toString();
};

export const getAbbreviation = (input?: string): string => {
  if (!input) return "?";
  if (!input.trim()) return "?";
  const words = input.trim().split(/\s+/);
  const abbreviation = words.map((word) => word[0].toUpperCase()).join("");
  if (abbreviation.length >= 3) {
    return abbreviation.substring(0, 3);
  }
  return abbreviation.padEnd(3, abbreviation[abbreviation.length - 1]);
};

export const formatDateToMMDD = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}/${day}`;
};

export function getTimeDifference(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);

  const seconds = (diffSeconds % 60).toString().padStart(2, "0");
  const minutes = (diffMinutes % 60).toString().padStart(2, "0");
  const hours = diffHours.toString().padStart(2, "0");
  if (diffHours > 1) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
}
