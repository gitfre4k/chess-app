import { useState } from "react";
import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

const usePawnPromotion = () => {
  const [pawnPromotion, setPawnPromotion] = useState("");
  const router = useRouter();
  const roomDocRef = doc(db, "rooms", `${router.query.id}`);

  const promotePawn = (pawn: string) => {
    setPawnPromotion(pawn);
    updateDoc(roomDocRef, {
      pawn: pawn ? pawn : "",
    });
  };
  const endPawnPromotion = () => {
    setPawnPromotion("");
  };

  return { pawnPromotion, promotePawn, endPawnPromotion };
};

export default usePawnPromotion;
