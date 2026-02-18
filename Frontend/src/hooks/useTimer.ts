import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const start = useCallback(() => {
    setSeconds(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  const reset = useCallback(() => {
    setIsActive(false);
    setSeconds(0);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return { seconds, isActive, start, reset };
};