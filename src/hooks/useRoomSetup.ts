import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import { doc, DocumentData, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { startingPositions } from "../constants/positions";

import { User } from "firebase/auth";

const useRoomSetup = (user: User, roomState: DocumentData) => {
  const router = useRouter();
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);
  const [time, setTime] = useState(0);
  const timeIndex = useMemo(() => ["", "1:00", "3:00", "5:00"], []);

  const goBack = () => {
    user.uid === roomState.host &&
      roomState.guest &&
      updateDoc(roomDocRef, {
        host: roomState.guest,
        white: roomState.guest,
        guest: "",
        black: "",
        whiteClock: "",
        blackClock: "",
      });
    user.uid === roomState.guest &&
      updateDoc(roomDocRef, {
        white: roomState.host,
        guest: "",
        black: "",
        whiteClock: "",
        blackClock: "",
      });
    router.push(`/`);
  };

  const startGame = () => {
    updateDoc(roomDocRef, {
      start: true,
      activePlayer: "white",
      positions: JSON.stringify(startingPositions),
      enPassantMoves: JSON.stringify({
        white: [],
        black: [],
      }),
    });
  };

  const changeColor = () => {
    const black = roomState.white;
    updateDoc(roomDocRef, {
      white: roomState.black,
      black,
    });
  };

  const setClock = (time: string) => {
    updateDoc(roomDocRef, {
      whiteClock: time,
      blackClock: time,
    });
  };

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
