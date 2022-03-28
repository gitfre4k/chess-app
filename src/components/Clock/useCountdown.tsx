import { useEffect, useState } from "react";

const calcTimeLeft = (t: number) => {
  if (!t) return 0;
  const left = t - new Date().getTime();
  if (left < 0) return 0;
  return left;
};

const useCountdown = (endTime: number) => {
  const [end, setEndTime] = useState<number>(endTime);
  const [timeLeft, setTimeLeft] = useState<number>(() => calcTimeLeft(end));

  useEffect(() => {
    setTimeLeft(calcTimeLeft(end));
    const timer = setInterval(() => {
      const targetLeft = calcTimeLeft(end);
      setTimeLeft(targetLeft);
      if (targetLeft === 0) clearInterval(timer);
    });
    return () => clearInterval(timer);
  }, [end]);

  return { timeLeft, setTimeLeft };
};

export default useCountdown;
