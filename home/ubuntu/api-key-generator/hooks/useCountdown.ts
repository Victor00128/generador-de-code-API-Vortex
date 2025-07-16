
import { useState, useEffect } from 'react';

export const useCountdown = (targetDate: number, onExpire: () => void): string => {
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const intervalId = setInterval(() => {
      const newTimeLeft = targetDate - Date.now();
      if (newTimeLeft <= 0) {
        clearInterval(intervalId);
        setTimeLeft(0);
        onExpire();
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (timeLeft <= 0) {
    return 'Expired';
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
  const pad = (num: number) => num.toString().padStart(2, '0');

  if (days > 0) {
    return `${days}d ${pad(hours)}h ${pad(minutes)}m`;
  }
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};
