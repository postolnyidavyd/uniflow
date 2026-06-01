import { useState, useEffect } from 'react';

const pad = (n) => String(n).padStart(2, '0');

const getTimeLeft = (targetDate) => {
  if (!targetDate) return null;
  const diff = new Date(targetDate) - Date.now();
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: days > 0 ? pad(days) : null,
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    totalHours: Math.floor(totalSeconds / 3600), // Для зворотної сумісності якщо треба
  };
};

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    if (!targetDate) return;

    // Синхронізуємо перший тік з наступною секундою
    // щоб лічильник не відставав реального часу
    const msUntilNextSecond = 1000 - (Date.now() % 1000);
    let intervalId;

    const timeoutId = setTimeout(() => {
      setTimeLeft(getTimeLeft(targetDate));

      intervalId = setInterval(() => {
        const t = getTimeLeft(targetDate);
        setTimeLeft(t);
        if (!t) clearInterval(intervalId);
      }, 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [targetDate]);

  return timeLeft;
};
