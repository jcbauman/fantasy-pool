export const formatTimeString = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const formatElapsedTime = (date1: Date, date2: Date): string => {
  const elapsedMilliseconds = Math.abs(date2.getTime() - date1.getTime());

  const seconds = Math.round(elapsedMilliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.round(hours / 24);
  return `${days}d`;
};
