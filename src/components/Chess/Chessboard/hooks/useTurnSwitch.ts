import { useState, useEffect } from "react";

import { updateDoc } from "firebase/firestore";

import { DocumentData, DocumentReference } from "firebase/firestore";

const useTurnSwitch = (
  roomDataSnapshot: DocumentData | undefined,
  roomDocRef: DocumentReference
) => {
  const [activePlayer, setActivePlayer] = useState<"white" | "black">("white");

  useEffect(() => {
    if (roomDataSnapshot) setActivePlayer(roomDataSnapshot.activePlayer);
  }, [roomDataSnapshot]);

  const changePlayer = () => {
    updateDoc(roomDocRef, {
      activePlayer: activePlayer === "white" ? "black" : "white",
    });
  };

  return { activePlayer, changePlayer };
};

export default useTurnSwitch;
