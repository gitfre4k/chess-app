import { useState, useEffect } from "react";

const useClock = (time: string, update: boolean) => {
  const [minsec, setMinsec] = useState([+time.slice(0, 1), +time.slice(2, 4)]);

  useEffect(() => {
    if (!update) return;
    let myInterval = setInterval(() => {
      setMinsec((prevValue) => {
        let [minutes, seconds] = prevValue;
        if (seconds > 0) return [minutes, seconds - 1];
        if (seconds === 0) {
          if (minutes === 0) clearInterval(myInterval);
        }
        return [minutes - 1, 59];
      });
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  }, [update]);

  return minsec;
};

export default useClock;
