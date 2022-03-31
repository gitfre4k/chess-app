import React from "react";
import { useState, useEffect } from "react";

import { DocumentData } from "firebase/firestore";

interface IClockProps {
  start: boolean;
  player: "white" | "black";
  user: boolean;
  roomDataSnapshot: DocumentData | undefined;
  updateClock: (player: "white" | "black", timeLeft: string) => void;
}

const Clock: React.FC<IClockProps> = ({ start, player, user, roomDataSnapshot, updateClock }) => {
  const [minutes, setMinutes] = useState(+`${roomDataSnapshot?.clock[player]}`.slice(0, 1));
  const [seconds, setSeconds] = useState(+`${roomDataSnapshot?.clock[player]}`.slice(2, 4));
  const [timeLeft, setTimeLeft] = useState(`${roomDataSnapshot?.clock[player]}`);

  useEffect(() => {
    if (roomDataSnapshot?.clock && !user) {
      setTimeLeft(
        player === "white" ? roomDataSnapshot?.clock.white : roomDataSnapshot?.clock.black
      );
    }
  }, [roomDataSnapshot?.clock, player, user]);

  useEffect(() => {
    if (!start || !user) return;
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        updateClock(player, `${minutes}:${seconds - 1 < 10 ? `0${seconds - 1}` : seconds - 1}`);
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          updateClock(player, `${minutes - 1}:59`);
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  const userOutput = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  return (
    <>
      {roomDataSnapshot?.clock.white ? (
        <div>
          <p>{user ? userOutput : timeLeft}</p>
        </div>
      ) : null}
    </>
  );
};

export default Clock;
