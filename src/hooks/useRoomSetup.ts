import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const useRoomSetup = () => {
  const router = useRouter();
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);
  const [roomDataSnapshot] = useDocumentData(roomDocRef);
  const [time, setTime] = useState(0);
  const timeIndex = useMemo(() => ["", "1:00", "3:00", "5:00"], []);

  const goBack = () => {
    router.push(`/`);
  };

  const startGame = () => {
    updateDoc(roomDocRef, {
      start: true,
    });
  };

  const changeColor = () => {
    const black = roomDataSnapshot?.white;
    updateDoc(roomDocRef, {
      white: roomDataSnapshot?.black,
      black,
    });
  };

  const setClock = useCallback(
    (time: string) => {
      updateDoc(roomDocRef, {
        clock: {
          white: time,
          black: time,
        },
      });
    },
    [roomDocRef]
  );

  const changeTime = (increment: boolean) => {
    if (increment)
      setTime((prevValue) => {
        const newValue = prevValue === timeIndex.length - 1 ? 0 : prevValue + 1;
        setClock(timeIndex[newValue]);
        return newValue;
      });
    else
      setTime((prevValue) => {
        const newValue = prevValue === 0 ? timeIndex.length - 1 : prevValue - 1;
        setClock(timeIndex[newValue]);
        return newValue;
      });
  };

  return { time, goBack, startGame, changeColor, changeTime };
};

export default useRoomSetup;
