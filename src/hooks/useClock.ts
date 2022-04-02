import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import { DocumentData } from "firebase/firestore";

const useClock = (
  player: "white" | "black",
  user: boolean,
  start: boolean,
  roomDataSnapshot: DocumentData | undefined
) => {
  const router = useRouter();
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);
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

  const updateClock = useCallback(
    (player: "white" | "black", timeLeft: string) => {
      const clockData = roomDataSnapshot?.clock;
      updateDoc(roomDocRef, {
        clock: {
          ...clockData,
          [player]: timeLeft,
        },
      });
    },
    [roomDocRef, roomDataSnapshot?.clock]
  );

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
  }, [minutes, player, seconds, start, updateClock, user]);

  return { minutes, seconds, timeLeft, updateClock };
};

export default useClock;
