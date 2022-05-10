import { useState } from "react";

const usePawnPromotion = () => {
  const [pawnPromotion, setPawnPromotion] = useState("");

  const promotePawn = (pawn: string) => {
    setPawnPromotion(pawn);
  };
  const endPawnPromotion = () => {
    setPawnPromotion("");
  };

  return { pawnPromotion, promotePawn, endPawnPromotion };
};

export default usePawnPromotion;
