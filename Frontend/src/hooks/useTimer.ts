import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialSeconds: number) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const startTimer = useCallback(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  return { timeLeft, startTimer };
};