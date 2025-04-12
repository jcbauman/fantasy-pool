import { FC, useEffect, useState } from "react";
import { Typography } from "@mui/material";

export const TimeCounter: FC<{ startTime: Date; endTime?: Date }> = ({
  startTime,
  endTime,
}) => {
  const [time, setTime] = useState(calculateTimeDifference(startTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(() => {
        const now = endTime ?? new Date();
        const elapsed = now.getTime() - startTime.getTime();
        const totalSeconds = Math.floor(elapsed / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);
  return (
    <Typography variant="h5">
      {formatTime(time.hours, time.minutes, time.seconds)}
    </Typography>
  );
};

const formatTime = (
  hours: number,
  minutes: number,
  seconds: number
): string => {
  const formatNumber = (num: number): string => num.toString().padStart(2, "0");
  if (hours > 0) {
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(
      seconds
    )}`;
  }
  return `${formatNumber(minutes)}:${formatNumber(seconds)}`;
};

const calculateTimeDifference = (
  date: Date
): { hours: number; minutes: number; seconds: number } => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};
