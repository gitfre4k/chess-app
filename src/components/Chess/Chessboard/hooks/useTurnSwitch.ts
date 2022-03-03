import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

const useTurnSwitch = () => {
  const [activePlayer, setActivePlayer] = useState<"white" | "black">("white");
  const router = useRouter();
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);
  const [roomSnapshot] = useDocumentData(roomDocRef);

  useEffect(() => {
    if (roomSnapshot) setActivePlayer(roomSnapshot.activePlayer);
  }, [roomSnapshot]);

  const changePlayer = () => {
    updateDoc(roomDocRef, {
      activePlayer: activePlayer === "white" ? "black" : "white",
    });
  };

  return { activePlayer, changePlayer };
};

export default useTurnSwitch;
